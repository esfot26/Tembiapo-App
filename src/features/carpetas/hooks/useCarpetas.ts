import { useState } from "react";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIREBASE_DB } from "@/src/services/FirebaseConfig";
import Toast from "react-native-toast-message";
import { Carpeta } from "../types";

export function useCarpetas(
    parentId: string | null,
    carpetas: Carpeta[],
    setCarpetas: React.Dispatch<React.SetStateAction<Carpeta[]>>
) {
    const auth = getAuth();

    const [actionModal, setActionModal] = useState<{
        visible: boolean;
        carpetaId: string | null;
        carpetaNombre: string;
    }>({ visible: false, carpetaId: null, carpetaNombre: "" });

    const crearCarpeta = async (nombreCarpeta: string) => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        if (!nombreCarpeta.trim()) {
            Toast.show({ type: "error", text1: "Error", text2: "El nombre de la carpeta no puede estar vacío." });
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
            const docRef = await addDoc(
                collection(FIREBASE_DB, `carpeta/${currentUser.uid}/carpetas`),
                {
                    nombre: nombreCarpeta.trim(),
                    padreId: parentId,
                    color: "#3B82F6",
                    creadorId: currentUser.uid,
                    fechaCreado: Timestamp.now(),
                    fechaActualizado: Timestamp.now(),
                    eliminado: false,
                }
            );

            setCarpetas((prev) =>
                prev.map((c) => (c.id === tempId ? { ...c, id: docRef.id } : c))
            );
            Toast.show({ type: "success", text1: "Carpeta creada", text2: `"${nombreCarpeta}" se creó correctamente.` });
        } catch (error) {
            console.error("Error creando carpeta:", error);
            setCarpetas((prev) => prev.filter((c) => c.id !== tempId));
            Toast.show({ type: "error", text1: "Error", text2: "No se pudo crear la carpeta." });
        }
    };

    const editarCarpeta = async (carpetaId: string, nuevoNombre: string) => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        if (!nuevoNombre.trim()) {
            Toast.show({ type: "error", text1: "Error", text2: "El nombre no puede estar vacío." });
            return;
        }

        const nombreOriginal = carpetas.find((c) => c.id === carpetaId)?.nombre;
        if (!nombreOriginal) return;

        setCarpetas((prev) =>
            prev.map((c) =>
                c.id === carpetaId
                    ? { ...c, nombre: nuevoNombre.trim(), fechaActualizado: Timestamp.now() }
                    : c
            )
        );

        try {
            await updateDoc(
                doc(FIREBASE_DB, `carpeta/${currentUser.uid}/carpetas/${carpetaId}`),
                { nombre: nuevoNombre.trim(), fechaActualizado: Timestamp.now() }
            );
            Toast.show({ type: "success", text1: "Carpeta renombrada", text2: `Ahora se llama "${nuevoNombre}".` });
        } catch (error) {
            console.error("Error editando carpeta:", error);
            setCarpetas((prev) =>
                prev.map((c) => (c.id === carpetaId ? { ...c, nombre: nombreOriginal } : c))
            );
            Toast.show({ type: "error", text1: "Error", text2: "No se pudo renombrar la carpeta." });
        }
    };

    const eliminarCarpeta = async (carpetaId: string) => {
        const user = auth.currentUser;
        if (!user) return;

        const carpetaEliminada = carpetas.find((c) => c.id === carpetaId);
        if (!carpetaEliminada) return;

        setCarpetas((prev) => prev.filter((c) => c.id !== carpetaId));

        try {
            await updateDoc(
                doc(FIREBASE_DB, `carpeta/${user.uid}/carpetas/${carpetaId}`),
                { eliminado: true, fechaBorrado: Timestamp.now() }
            );
            Toast.show({ type: "success", text1: "Carpeta eliminada", text2: "Se movió a la papelera correctamente." });
        } catch (error) {
            console.error("Error eliminando carpeta:", error);
            setCarpetas((prev) => [carpetaEliminada, ...prev]);
            Toast.show({ type: "error", text1: "Error", text2: "No se pudo eliminar la carpeta." });
        }
    };

    return { crearCarpeta, editarCarpeta, eliminarCarpeta, actionModal, setActionModal };
}