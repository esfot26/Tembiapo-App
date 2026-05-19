import { useState, useCallback } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIREBASE_DB } from "@/src/services/FirebaseConfig";
import Toast from "react-native-toast-message";
import { ArchivoItem, Carpeta } from "../types";


export function useContenido(parentId: string | null) {
    const auth = getAuth();
    const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
    const [archivos, setArchivos] = useState<ArchivoItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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

            setCarpetas(carpetasSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Carpeta)));
            setArchivos(archivosSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ArchivoItem)));
        } catch (error: any) {
            console.error("Error al cargar contenido:", error);
            Toast.show({ type: "error", text1: "Error", text2: error.message || "No se pudo cargar el contenido." });
        } finally {
            setLoading(false);
        }
    }, [parentId]);

    return { carpetas, setCarpetas, archivos, setArchivos, loading, cargarContenido };
}