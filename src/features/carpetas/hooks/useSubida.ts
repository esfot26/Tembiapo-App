import { useRef, useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIREBASE_DB } from "@/src/services/FirebaseConfig";
import { supabase } from "@/src/services/SupabaseConfig";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXT = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp", "pdf", "jpg", "jpeg", "png"];

function isAllowedFile(name: string, size?: number): boolean {
    const ext = name.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXT.includes(ext)) return false;
    if (typeof size === "number" && size > MAX_FILE_SIZE) return false;
    return true;
}

export function useSubida(parentId: string | null, onSuccess: () => Promise<void>, pedirPermisosNecesarios: () => Promise<boolean>) {
    const auth = getAuth();
    const cancelRef = useRef(false);

    const [progress, setProgress] = useState<number>(0);
    const [uploading, setUploading] = useState<boolean>(false);

    const subirArchivo = async (file: DocumentPicker.DocumentPickerAsset) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            Toast.show({ type: "error", text1: "Error", text2: "Usuario no autenticado." });
            return;
        }

        setUploading(true);
        setProgress(0);
        cancelRef.current = false;

        try {
            const info = await FileSystem.getInfoAsync(file.uri);
            const size = typeof file.size === "number" ? file.size : (info as any)?.size;

            if (!isAllowedFile(file.name, size)) {
                Toast.show({ type: "error", text1: "Archivo no permitido", text2: "Solo PDF, imágenes JPG/PNG y documentos Office hasta 10 MB." });
                return;
            }

            const bucket = "archivos";
            const path = `${currentUser.uid}/${Date.now()}-${file.name}`;
            const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: "base64" });
            const uint8 = new Uint8Array(decode(base64) as ArrayBuffer);

            setProgress(50);

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(path, uint8, { contentType: file.mimeType || "application/octet-stream", upsert: false });

            if (uploadError) throw uploadError;

            if (cancelRef.current) {
                await supabase.storage.from(bucket).remove([path]).catch(() => {});
                return;
            }

            const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

            await addDoc(collection(FIREBASE_DB, `carpeta/${currentUser.uid}/archivos`), {
                nombre: file.name,
                carpetaId: parentId,
                url: urlData.publicUrl,
                mimeType: file.mimeType || "desconocido",
                size: file.size || 0,
                creadorId: currentUser.uid,
                fechaCreado: Timestamp.now(),
                eliminado: false,
            });

            setProgress(100);
            Toast.show({ type: "success", text1: "Archivo subido", text2: `"${file.name}" se subió correctamente.` });
            await onSuccess();
        } catch (error: any) {
            console.error("Error subiendo archivo:", error);
            Toast.show({ type: "error", text1: "Error", text2: error.message || "No se pudo subir el archivo." });
        } finally {
            setUploading(false);
            cancelRef.current = false;
        }
    };

    const handleUploadFile = async () => {
        const ok = await pedirPermisosNecesarios();
        if (!ok) {
            Toast.show({ type: "error", text1: "Permisos requeridos", text2: "No podemos acceder a tus archivos sin permisos." });
            return;
        }

        const resultado = await DocumentPicker.getDocumentAsync({ type: "*/*", copyToCacheDirectory: true });
        if (resultado.canceled) return;

        const archivo = resultado.assets[0];
        const info = await FileSystem.getInfoAsync(archivo.uri);

        if (!info.exists) {
            Toast.show({ type: "error", text1: "Archivo no accesible", text2: "Intenta nuevamente o crea un dev build en Android." });
            return;
        }

        const size = typeof archivo.size === "number" ? archivo.size : (info as any)?.size;
        if (!isAllowedFile(archivo.name, size)) {
            Toast.show({ type: "error", text1: "Archivo no permitido", text2: "Solo PDF, imágenes JPG/PNG y documentos Office hasta 10 MB." });
            return;
        }

        Toast.show({ type: "info", text1: "Subiendo archivo", text2: `Subiendo "${archivo.name}"...` });
        await subirArchivo(archivo);
    };

    const handleCancelUpload = () => {
        cancelRef.current = true;
        setUploading(false);
        setProgress(0);
        Toast.show({ type: "info", text1: "Subida cancelada", text2: "La subida del archivo ha sido cancelada." });
    };

    return { progress, uploading, subirArchivo, handleUploadFile, handleCancelUpload };
}