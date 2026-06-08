import { useCallback, useState, useEffect, useRef } from "react";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    updateDoc,
    doc,
    deleteDoc,
} from "firebase/firestore";

import { deleteObject, getStorage, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { FIREBASE_DB } from "@/src/services/FirebaseConfig";

import { supabase } from "@/src/services/SupabaseConfig";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";

// 🔹 Hook de permisos
import { usePermisos } from "@/src/hooks/usePermisos";
import { ArchivoItem, Carpeta } from "../types";



export function useCarpeta(parentId: string | null) {
    const auth = getAuth();

    const {
        pedirPermisosNecesarios,
        verificarPermisos,
        estadoPermisos,
    } = usePermisos();

    const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
    const [archivos, setArchivos] = useState<ArchivoItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newFolder, setNewFolder] = useState("");
    const [isFabMenuVisible, setFabMenuVisible] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [uploading, setUploading] = useState<boolean>(false);
    const cancelRef = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [uploadTaskRef, setUploadTaskRef] = useState<any>(null);
    const [currentUploadPath, setCurrentUploadPath] = useState<string | null>(null);


    const [actionModal, setActionModal] = useState<{
        visible: boolean;
        carpetaId: string | null;
        carpetaNombre: string;
    }>({
        visible: false,
        carpetaId: null,
        carpetaNombre: "",
    });

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const allowedExt = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp", "pdf", "jpg", "jpeg", "png"];
    const bannedExt = ["exe", "apk", "zip", "rar", "mp4", "mp3"];
    const isAllowedFile = (name: string, size?: number) => {
        const ext = name.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
        if (!allowedExt.includes(ext)) return false;
        if (bannedExt.includes(ext)) return false;
        if (typeof size === "number" && size > MAX_FILE_SIZE) return false;
        return true;
    };

    // 🔹 AL ENTRAR A UNA CARPETA: pedir permisos si faltan
    useEffect(() => {
        async function checkPerms() {
            const ok = await pedirPermisosNecesarios();

            if (!ok) {
                Toast.show({
                    type: "error",
                    text1: "Permisos requeridos",
                    text2: "La app necesita acceso al almacenamiento.",
                });
            }
        }

        checkPerms();
    }, [parentId]);



    /** 🔹 Cargar carpetas y archivos */
    const cargarContenido = useCallback(async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        setLoading(true);
        try {
            const carpetasQuery = query(
                collection(FIREBASE_DB, `carpeta/${currentUser.uid}/carpetas`),
                where("padreId", "==", parentId),
                where("eliminado", "==", false),
                orderBy("fechaCreado", "desc")
            );

            const archivosQuery = query(
                collection(FIREBASE_DB, `carpeta/${currentUser.uid}/archivos`),
                where("carpetaId", "==", parentId),
                where("eliminado", "==", false),
                orderBy("fechaCreado", "desc")
            );

            const [carpetasSnap, archivosSnap] = await Promise.all([
                getDocs(carpetasQuery),
                getDocs(archivosQuery),
            ]);

            const carpetasData = carpetasSnap.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() } as Carpeta)
            );
            const archivosData = archivosSnap.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() } as ArchivoItem)
            );

            setCarpetas(carpetasData);
            setArchivos(archivosData);
        } catch (error: any) {
            console.error("Error al cargar contenido:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "No se pudo cargar el contenido.",
            });
        } finally {
            setLoading(false);
        }
    }, [parentId]);


    const crearCarpeta = async (nombreCarpeta: string) => {
        const inicio = Date.now();
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        if (!nombreCarpeta.trim()) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "El nombre de la carpeta no puede estar vacío.",
            });
            return;
        }


        const nombreDuplicado = carpetas.some(
            (c) => c.nombre.trim().toLowerCase() === nombreCarpeta.trim().toLowerCase()
        );

        if (nombreDuplicado) {
            Toast.show({
                type: "error",
                text1: "Nombre duplicado",
                text2: `Ya existe una carpeta llamada "${nombreCarpeta}".`,
            });
            return;
        }

        const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
        const tempCarpeta: Carpeta = {
            id: tempId,
            nombre: nombreCarpeta.trim(),
            padreId: parentId,
            color: "#3B82F6",
            creadorId: currentUser.uid,
            fechaCreado: Timestamp.now(),
            fechaActualizado: Timestamp.now(),
            eliminado: false,
        };


        setCarpetas((prev) => [tempCarpeta, ...prev]);

        try {

            const docRef = await addDoc(collection(FIREBASE_DB, `carpeta/${currentUser.uid}/carpetas`), {
                nombre: nombreCarpeta.trim(),
                padreId: parentId,
                color: "#3B82F6",
                creadorId: currentUser.uid,
                fechaCreado: Timestamp.now(),
                fechaActualizado: Timestamp.now(),
                eliminado: false,
            });


            setCarpetas((prev) =>
                prev.map((c) => (c.id === tempId ? { ...c, id: docRef.id } : c))
            );

            const fin = Date.now();
            console.log(`Tiempo de creación: ${fin - inicio} ms`);
            const tiempoRespuesta = Date.now() - inicio;
            console.log(`[PRUEBA] crearCarpeta: ${tiempoRespuesta}ms`);

            if (tiempoRespuesta > 2000) {
                console.warn(`⚠️ Tiempo excedido: ${tiempoRespuesta}ms`);
            }

            Toast.show({
                type: "success",
                text1: "Carpeta creada",
                text2: `"${nombreCarpeta}" se creó correctamente.`,
                visibilityTime: 1500,
                autoHide: true,
                topOffset: 60,
            });
        } catch (error) {
            console.error("Error creando carpeta:", error);

            // ❌ Rollback: Remover carpeta temporal
            setCarpetas((prev) => prev.filter((c) => c.id !== tempId));

            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo crear la carpeta.",
            });
        }


    };

    /** 🔹 Editar carpeta (con Optimistic Update) */
    const editarCarpeta = async (carpetaId: string, nuevoNombre: string) => {
        const inicio = Date.now();
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        if (!nuevoNombre.trim()) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "El nombre no puede estar vacío.",
            });
            return;
        }

        const nombreDuplicado = carpetas.some(
            (c) => c.id !== carpetaId && c.nombre.trim().toLowerCase() === nuevoNombre.trim().toLowerCase()
        )

        if (nombreDuplicado) {
            Toast.show({
                type: "error",
                text1: "Nombre duplicado",
                text2: `Ya existe una carpeta llamada "${nuevoNombre}".`,
            });
            return;
        }

        // 💾 Guardar nombre original para rollback
        const carpetaOriginal = carpetas.find((c) => c.id === carpetaId);
        if (!carpetaOriginal) return;
        const nombreOriginal = carpetaOriginal.nombre;

        // ✅ Actualizar inmediatamente en la UI
        setCarpetas((prev) =>
            prev.map((c) =>
                c.id === carpetaId
                    ? { ...c, nombre: nuevoNombre.trim(), fechaActualizado: Timestamp.now() }
                    : c
            )
        );

        const fin = Date.now();
        console.log(`Tiempo de edicion: ${fin - inicio} ms`);
        const tiempoRespuesta = Date.now() - inicio;
        console.log(`[PRUEBA] editarCarpeta: ${tiempoRespuesta}ms`);

        if (tiempoRespuesta > 2000) {
            console.warn(`⚠️ Tiempo excedido: ${tiempoRespuesta}ms`);
        }

        try {
            // 📡 Actualizar en Firebase en segundo plano
            const ref = doc(FIREBASE_DB, `carpeta/${currentUser.uid}/carpetas/${carpetaId}`);
            await updateDoc(ref, {
                nombre: nuevoNombre.trim(),
                fechaActualizado: Timestamp.now(),
            });

            Toast.show({
                type: "success",
                text1: "Carpeta renombrada",
                text2: `Ahora se llama "${nuevoNombre}".`,
                visibilityTime: 1500,
                autoHide: true,
                topOffset: 60,
            });
        } catch (error) {
            console.error("Error editando carpeta:", error);

            // ❌ Rollback: Restaurar nombre original
            setCarpetas((prev) =>
                prev.map((c) =>
                    c.id === carpetaId ? { ...c, nombre: nombreOriginal } : c
                )
            );

            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo renombrar la carpeta.",
            });
        }
    };

    /** 🔹 Eliminar carpeta (con Optimistic Update) */
    const eliminarCarpeta = async (carpetaId: string) => {
        const user = auth.currentUser;
        if (!user) return;

        // 💾 Guardar carpeta para rollback
        const carpetaEliminada = carpetas.find((c) => c.id === carpetaId);
        if (!carpetaEliminada) return;

        // ✅ Remover inmediatamente de la UI
        setCarpetas((prev) => prev.filter((c) => c.id !== carpetaId));

        try {
            // 📡 Marcar como eliminada en Firebase
            const carpetaRef = doc(FIREBASE_DB, `carpeta/${user.uid}/carpetas/${carpetaId}`);
            await updateDoc(carpetaRef, {
                eliminado: true,
                fechaBorrado: Timestamp.now(),
            });

            Toast.show({
                type: "success",
                text1: "Carpeta eliminada",
                text2: "Se movió a la papelera correctamente.",
                visibilityTime: 1500,
                autoHide: true,
                topOffset: 60,
            });
        } catch (error) {
            console.error("Error eliminando carpeta:", error);

            // ❌ Rollback: Restaurar carpeta
            setCarpetas((prev) => [carpetaEliminada, ...prev]);

            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo eliminar la carpeta.",
            });
        }
    };

    /** 🔹 Eliminar archivo (con Optimistic Update) */
    const eliminarArchivo = async (archivoId: string, archivoNombre: string) => {
        const user = auth.currentUser;
        if (!user) return;

        // 💾 Guardar archivo para rollback
        const archivoEliminado = archivos.find((a) => a.id === archivoId);
        if (!archivoEliminado) return;

        // ✅ Remover inmediatamente de la UI
        setArchivos((prev) => prev.filter((a) => a.id !== archivoId));

        try {
            // 📡 Eliminar de Storage y Firestore
            const storage = getStorage();
            const fileRef = ref(storage, `carpeta/${user.uid}/${archivoNombre}`);
            await deleteObject(fileRef).catch(() => { });

            await deleteDoc(doc(FIREBASE_DB, `carpeta/${user.uid}/archivos/${archivoId}`));

            Toast.show({
                type: "success",
                text1: "Archivo eliminado",
                text2: "Se movió a la papelera correctamente.",
                visibilityTime: 1500,
                autoHide: true,
                topOffset: 60,
            });
        } catch (error) {
            console.error("Error eliminando archivo:", error);

            // ❌ Rollback: Restaurar archivo
            setArchivos((prev) => [archivoEliminado, ...prev]);

            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo eliminar el archivo.",
            });
        }
    };

    /** 🔹 Renombrar archivo (con Optimistic Update) */
    const renombrarArchivo = async (archivoId: string, nuevoNombre: string) => {
        const user = auth.currentUser;
        if (!user) return;

        if (!nuevoNombre.trim()) {
            Toast.show({ type: "error", text1: "Error", text2: "El nombre no puede estar vacío." });
            return;
        }

        // 💾 Guardar nombre original para rollback
        const archivoOriginal = archivos.find((a) => a.id === archivoId);
        if (!archivoOriginal) return;
        const nombreOriginal = archivoOriginal.nombre;

        setArchivos((prev) =>
            prev.map((a) =>
                a.id === archivoId
                    ? { ...a, nombre: nuevoNombre.trim(), fechaActualizado: Timestamp.now() }
                    : a
            )
        );

        try {
            // 📡 Actualizar en Firebase en segundo plano
            const refDoc = doc(FIREBASE_DB, `carpeta/${user.uid}/archivos/${archivoId}`);
            await updateDoc(refDoc, {
                nombre: nuevoNombre.trim(),
                fechaActualizado: Timestamp.now(),
            });

            Toast.show({
                type: "success",
                text1: "Archivo renombrado",
                text2: `Ahora se llama "${nuevoNombre}".`,
                visibilityTime: 1500,
                autoHide: true,
                topOffset: 60,
            });
        } catch (error) {
            console.error("Error renombrando archivo:", error);

            setArchivos((prev) =>
                prev.map((a) =>
                    a.id === archivoId ? { ...a, nombre: nombreOriginal } : a
                )
            );

            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo renombrar el archivo."
            });
        }
    };

    /** 🔹 Subir archivo (Supabase) */
    const subirArchivo = async (
        file: DocumentPicker.DocumentPickerAsset,
        setProgress: (n: number) => void,
        setUploading: (b: boolean) => void
    ) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            Toast.show({ type: "error", text1: "Error", text2: "Usuario no autenticado." });
            return;
        }

        setUploading(true);
        setProgress(0);
        cancelRef.current = false;

        // ✅ Crear nuevo AbortController para esta subida
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const infoCheck = await FileSystem.getInfoAsync(file.uri);
            const sizeCheck = typeof file.size === "number" ? file.size : (infoCheck as any)?.size;

            if (!isAllowedFile(file.name, sizeCheck)) {
                Toast.show({ type: "error", text1: "Archivo no permitido", text2: "Solo PDF, imágenes JPG/PNG y documentos Office hasta 10 MB." });
                return;
            }

            const bucket = "archivos";
            const path = `${currentUser.uid}/${Date.now()}-${file.name}`;
            setCurrentUploadPath(path);

            const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: "base64" });

            // ✅ Verificar cancelación antes de continuar
            if (cancelRef.current || abortController.signal.aborted) {
                setCurrentUploadPath(null);
                return;
            }

            const fileBuffer = decode(base64);
            const uint8 = new Uint8Array(fileBuffer as ArrayBuffer);

            setProgress(30);

            // ✅ Pasar signal al fetch interno de Supabase
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(path, uint8, {
                    contentType: file.mimeType || "application/octet-stream",
                    upsert: false,
                    // @ts-ignore — Supabase acepta fetch options
                    fetchOptions: { signal: abortController.signal },
                });

            // ✅ Verificar cancelación después del upload
            if (cancelRef.current || abortController.signal.aborted) {
                await supabase.storage.from(bucket).remove([path]).catch(() => { });
                setCurrentUploadPath(null);
                return;
            }

            if (uploadError) throw uploadError;

            setProgress(75);

            const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
            const publicUrl = urlData.publicUrl;

            await addDoc(collection(FIREBASE_DB, `carpeta/${currentUser.uid}/archivos`), {
                nombre: file.name,
                carpetaId: parentId,
                url: publicUrl,
                mimeType: file.mimeType || "desconocido",
                size: file.size || 0,
                creadorId: currentUser.uid,
                fechaCreado: Timestamp.now(),
                eliminado: false,
            });

            setProgress(100);
            Toast.show({
                type: "success",
                text1: "Archivo subido",
                text2: `"${file.name}" se subió correctamente.`,
                visibilityTime: 1500,
                autoHide: true,
                topOffset: 60,
            });

            await cargarContenido();

        } catch (error: any) {
            // ✅ Si fue cancelado no mostrar error
            if (cancelRef.current || error?.name === "AbortError") {
                return;
            }
            console.error("Error subiendo archivo:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "No se pudo subir el archivo.",
            });
        } finally {
            setUploading(false);
            setProgress(0);
            setCurrentUploadPath(null);
            cancelRef.current = false;
            abortControllerRef.current = null;
        }
    };

    /** 🔹 Abrir DocumentPicker con validación de permisos */
    const handleUploadFile = async () => {
        // 🔐 Verificar permisos antes de subir
        const ok = await pedirPermisosNecesarios();
        if (!ok) {
            Toast.show({
                type: "error",
                text1: "Permisos requeridos",
                text2: "No podemos acceder a tus archivos sin permisos.",
            });
            return;
        }

        setFabMenuVisible(false);

        const resultado = await DocumentPicker.getDocumentAsync({ type: "*/*", copyToCacheDirectory: true });

        if (!resultado.canceled) {
            const archivo = resultado.assets[0];
            const info = await FileSystem.getInfoAsync(archivo.uri);
            if (!info.exists) {
                Toast.show({
                    type: "error",
                    text1: "Archivo no accesible",
                    text2: "Intenta nuevamente o crea un dev build en Android.",
                });
                return;
            }
            const sizeCheck = typeof archivo.size === "number" ? archivo.size : (info as any)?.size;
            if (!isAllowedFile(archivo.name, sizeCheck)) {
                Toast.show({ type: "error", text1: "Archivo no permitido", text2: "Solo PDF, imágenes JPG/PNG y documentos Office hasta 10 MB." });
                return;
            }

            Toast.show({
                type: "info",
                text1: "Subiendo archivo",
                text2: `Subiendo "${archivo.name}"...`,
            });

            const uploadTask = await subirArchivo(archivo, setProgress, setUploading);
            setUploadTaskRef(uploadTask);
        }
    };

    const handleCancelUpload = () => {
        cancelRef.current = true;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }

        setUploading(false);
        setProgress(0);

        Toast.show({
            type: "info",
            text1: "Subida cancelada",
            text2: "La subida del archivo fue cancelada.",
        });
    };
    return {
        carpetas,
        archivos,
        loading,

        cargarContenido,
        crearCarpeta,
        editarCarpeta,
        eliminarCarpeta,

        eliminarArchivo,
        renombrarArchivo,
        subirArchivo,
        handleUploadFile,
        handleCancelUpload,

        isModalVisible,
        setModalVisible,
        newFolder,
        setNewFolder,
        isFabMenuVisible,
        setFabMenuVisible,

        progress,
        uploading,
        verificarPermisos,
        pedirPermisosNecesarios,
        actionModal,
        setActionModal,
    };
}
export { Carpeta, ArchivoItem };

