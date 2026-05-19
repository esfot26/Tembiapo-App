import { updateDoc, doc, deleteDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { FIREBASE_DB } from "@/src/services/FirebaseConfig";
import Toast from "react-native-toast-message";
import { ArchivoItem } from "../types";

export function useArchivos(
    archivos: ArchivoItem[],
    setArchivos: React.Dispatch<React.SetStateAction<ArchivoItem[]>>
) {
    const auth = getAuth();

    const eliminarArchivo = async (archivoId: string, archivoNombre: string) => {
        const user = auth.currentUser;
        if (!user) return;

        const archivoEliminado = archivos.find((a) => a.id === archivoId);
        if (!archivoEliminado) return;

        setArchivos((prev) => prev.filter((a) => a.id !== archivoId));

        try {
            const storage = getStorage();
            const fileRef = ref(storage, `carpeta/${user.uid}/${archivoNombre}`);
            await deleteObject(fileRef).catch(() => {});
            await deleteDoc(doc(FIREBASE_DB, `carpeta/${user.uid}/archivos/${archivoId}`));
            Toast.show({ type: "success", text1: "Archivo eliminado", text2: "Se movió a la papelera correctamente." });
        } catch (error) {
            console.error("Error eliminando archivo:", error);
            setArchivos((prev) => [archivoEliminado, ...prev]);
            Toast.show({ type: "error", text1: "Error", text2: "No se pudo eliminar el archivo." });
        }
    };

    const renombrarArchivo = async (archivoId: string, nuevoNombre: string) => {
        const user = auth.currentUser;
        if (!user) return;

        if (!nuevoNombre.trim()) {
            Toast.show({ type: "error", text1: "Error", text2: "El nombre no puede estar vacío." });
            return;
        }

        const nombreOriginal = archivos.find((a) => a.id === archivoId)?.nombre;
        if (!nombreOriginal) return;

        setArchivos((prev) =>
            prev.map((a) =>
                a.id === archivoId
                    ? { ...a, nombre: nuevoNombre.trim(), fechaActualizado: Timestamp.now() }
                    : a
            )
        );

        try {
            await updateDoc(
                doc(FIREBASE_DB, `carpeta/${user.uid}/archivos/${archivoId}`),
                { nombre: nuevoNombre.trim(), fechaActualizado: Timestamp.now() }
            );
            Toast.show({ type: "success", text1: "Archivo renombrado", text2: `Ahora se llama "${nuevoNombre}".` });
        } catch (error) {
            console.error("Error renombrando archivo:", error);
            setArchivos((prev) =>
                prev.map((a) => (a.id === archivoId ? { ...a, nombre: nombreOriginal } : a))
            );
            Toast.show({ type: "error", text1: "Error", text2: "No se pudo renombrar el archivo." });
        }
    };

    return { eliminarArchivo, renombrarArchivo };
}