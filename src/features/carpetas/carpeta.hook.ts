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

import { deleteObject, getStorage, ref, updateMetadata } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { FIREBASE_DB } from "@/src/services/FirebaseConfig";

import { supabase } from "@/src/services/SupabaseConfig";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";

// 🔹 Hook de permisos
import { usePermisos } from "@/src/hooks/usePermisos";

export type Carpeta = {
    id: string;
    nombre: string;
    color?: string;
    icono?: string;
    descripcion?: string;
    favorito?: boolean;
    padreId: string | null;
    creadorId?: string;
    fechaCreado: Timestamp;
    fechaActualizado: Timestamp;
    fechaBorrado?: Timestamp | null;
    eliminado?: boolean;
};

export type ArchivoItem = {
    id: string;
    nombre: string;
    carpetaId: string | null;
    url: string;
    mimeType: string;
    size: number;
    color?: string;
    creadorId?: string;
    favorito?: boolean;
    descripcion?: string;
    fechaCreado: Timestamp;
    fechaActualizado?: Timestamp;
    fechaBorrado?: Timestamp | null;
    eliminado?: boolean;
};

export function useCarpeta(parentId: string | null) {
    const auth = getAuth();

    // 🔹 HOOK DE PERMISOS (DENTRO DEL HOOK → CORRECTO)
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
    const [uploadTaskRef, setUploadTaskRef] = useState<any>(null);
    const [currentUploadPath, setCurrentUploadPath] = useState<string | null>(null);
    const cancelRef = useRef(false);

    const [actionModal, setActionModal] = useState<{
        visible: boolean;
        carpetaId: string | null;
        carpetaNombre: string;
    }>({
        visible: false,
        carpetaId: null,
        carpetaNombre: "",
    });

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

    /** 🔹 Crear carpeta */
    const crearCarpeta = async (nombreCarpeta: string) => {
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

        try {
            await addDoc(collection(FIREBASE_DB, `carpeta/${currentUser.uid}/carpetas`), {
                nombre: nombreCarpeta.trim(),
                padreId: parentId,
                color: "#3B82F6",
                creadorId: currentUser.uid,
                fechaCreado: Timestamp.now(),
                fechaActualizado: Timestamp.now(),
                eliminado: false,
            });

            Toast.show({
                type: "success",
                text1: "Carpeta creada",
                text2: `"${nombreCarpeta}" se creó correctamente.`,
            });

            await cargarContenido();
        } catch (error) {
            console.error("Error creando carpeta:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo crear la carpeta.",
            });
        }
    };

    /** 🔹 Editar carpeta */
    const editarCarpeta = async (carpetaId: string, nuevoNombre: string) => {
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

        try {
            const ref = doc(FIREBASE_DB, `carpeta/${currentUser.uid}/carpetas/${carpetaId}`);
            await updateDoc(ref, {
                nombre: nuevoNombre.trim(),
                fechaActualizado: Timestamp.now(),
            });

            Toast.show({
                type: "success",
                text1: "Carpeta renombrada",
                text2: `Ahora se llama "${nuevoNombre}".`,
            });
            await cargarContenido();
        } catch (error) {
            console.error("Error editando carpeta:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo renombrar la carpeta.",
            });
        }
    };

    /** 🔹 Eliminar carpeta */
    const eliminarCarpeta = async (carpetaId: string) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const carpetaRef = doc(FIREBASE_DB, `carpeta/${user.uid}/carpetas/${carpetaId}`);
            await updateDoc(carpetaRef, {
                eliminado: true,
                fechaBorrado: Timestamp.now(),
            });

            Toast.show({
                type: "success",
                text1: "Carpeta eliminada",
                text2: "Se movió a la papelera correctamente.",
            });

            await cargarContenido();
        } catch (error) {
            console.error("Error eliminando carpeta:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo eliminar la carpeta.",
            });
        }
    };

    /** 🔹 Eliminar archivo */
    const eliminarArchivo = async (archivoId: string, archivoNombre: string) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const storage = getStorage();
            const fileRef = ref(storage, `carpeta/${user.uid}/${archivoNombre}`);
            await deleteObject(fileRef).catch(() => { });

            await deleteDoc(doc(FIREBASE_DB, `carpeta/${user.uid}/archivos/${archivoId}`));

            Toast.show({
                type: "success",
                text1: "Archivo eliminado",
                text2: "Se movió a la papelera correctamente.",
            });

            await cargarContenido();
        } catch (error) {
            console.error("Error eliminando archivo:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo eliminar el archivo.",
            });
        }
    };

    /** 🔹 Renombrar archivo */
    const renombrarArchivo = async (archivoId: string, nuevoNombre: string) => {
        const user = auth.currentUser;
        if (!user) return;
        if (!nuevoNombre.trim()) {
            Toast.show({ type: "error", text1: "Error", text2: "El nombre no puede estar vacío." });
            return;
        }
        try {
            const refDoc = doc(FIREBASE_DB, `carpeta/${user.uid}/archivos/${archivoId}`);
            await updateDoc(refDoc, {
                nombre: nuevoNombre.trim(),
                fechaActualizado: Timestamp.now(),
            });
            Toast.show({ type: "success", text1: "Archivo renombrado", text2: `Ahora se llama "${nuevoNombre}".` });
            await cargarContenido();
        } catch (error) {
            console.error("Error renombrando archivo:", error);
            Toast.show({ type: "error", text1: "Error", text2: "No se pudo renombrar el archivo." });
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
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Usuario no autenticado.",
            });
            return;
        }

        setUploading(true);
        setProgress(0);
        cancelRef.current = false;

        try {
            const bucket = "archivos";
            const path = `${currentUser.uid}/${Date.now()}-${file.name}`;
            setCurrentUploadPath(path);
            const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: "base64" });
            const fileBody = decode(base64);

            setProgress(50);

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(path, fileBody, {
                    contentType: file.mimeType || "application/octet-stream",
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
            const publicUrl = urlData.publicUrl;

            if (cancelRef.current) {
                await supabase.storage.from(bucket).remove([path]).catch(() => {});
                setCurrentUploadPath(null);
                return;
            }

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
            });

            await cargarContenido();
        } catch (error: any) {
            console.error("Error subiendo archivo:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "No se pudo subir el archivo.",
            });
        } finally {
            setUploading(false);
            setCurrentUploadPath(null);
            cancelRef.current = false;
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

        const resultado = await DocumentPicker.getDocumentAsync({ type: "*/*" });

        if (!resultado.canceled) {
            const archivo = resultado.assets[0];

            Toast.show({
                type: "info",
                text1: "Subiendo archivo",
                text2: `Subiendo "${archivo.name}"...`,
            });

            const uploadTask = await subirArchivo(archivo, setProgress, setUploading);
            setUploadTaskRef(uploadTask);
        }
    };

    /** 🔹 Cancelar subida */
    const handleCancelUpload = () => {
        cancelRef.current = true;
        setUploading(false);
        setProgress(0);
        Toast.show({
            type: "info",
            text1: "Subida cancelada",
            text2: "La subida del archivo ha sido cancelada.",
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
