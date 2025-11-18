import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "./FirebaseConfig";

export type Prioridad = "baja" | "media" | "alta";

export interface Nota {
    id: string;
    titulo: string;
    descripcion: string;
    completado: boolean;
    categoria: string;
    prioridad: Prioridad;
    fechaCreacion: Timestamp;
    creadorId: string;
}

export interface NotaData {
    titulo: string;
    descripcion: string;
    categoria: string;
    prioridad: Prioridad;
}

const getNotasCollection = () => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) throw new Error("Usuario no autenticado.");
    return collection(FIREBASE_DB, `usuarios/${user.uid}/usuario_notas`);
};

export const NotasService = {
    async obtenerNotas(): Promise<Nota[]> {
        const notasCollection = getNotasCollection();
        const q = query(notasCollection);
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Nota)
        );
    },

    async crearNota(notaData: NotaData): Promise<string> {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) throw new Error("Usuario no autenticado.");

        const notasCollection = getNotasCollection();
        const docRef = await addDoc(notasCollection, {
            ...notaData,
            completado: false,
            fechaCreacion: Timestamp.now(),
            creadorId: user.uid,
        });
        return docRef.id;
    },

    async actualizarNota(
        notaId: string,
        updates: Partial<Omit<Nota, "id" | "creadorId" | "fechaCreacion">>
    ): Promise<void> {
        const notasCollection = getNotasCollection();
        const notaDoc = doc(notasCollection, notaId);
        await updateDoc(notaDoc, updates);
    },

    async eliminarNota(notaId: string): Promise<void> {
        const notasCollection = getNotasCollection();
        const notaDoc = doc(notasCollection, notaId);
        await deleteDoc(notaDoc);
    },
};
