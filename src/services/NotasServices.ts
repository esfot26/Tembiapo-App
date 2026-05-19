import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    Timestamp,
    updateDoc,
    orderBy,
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

const prioridadesValidas: Prioridad[] = ["baja", "media", "alta"];

const validarNota = (nota: NotaData) => {
    if (!nota.titulo || !nota.titulo.trim()) {
        throw new Error("El título es obligatorio.");
    }

    if (nota.titulo.trim().length > 100) {
        throw new Error("El título no puede superar 100 caracteres.");
    }

    if (!nota.descripcion || !nota.descripcion.trim()) {
        throw new Error("La descripción es obligatoria.");
    }

    if (!nota.categoria || !nota.categoria.trim()) {
        throw new Error("La categoría es obligatoria.");
    }

    if (!prioridadesValidas.includes(nota.prioridad)) {
        throw new Error("Prioridad inválida.");
    }
};

const getNotasCollection = () => {
    const user = FIREBASE_AUTH.currentUser;

    if (!user) {
        throw new Error("Usuario no autenticado.");
    }

    return collection(
        FIREBASE_DB,
        `usuarios/${user.uid}/usuario_notas`
    );
};

export const NotasService = {
    async obtenerNotas(): Promise<Nota[]> {
        try {
            const notasCollection = getNotasCollection();

            const q = query(
                notasCollection,
                orderBy("fechaCreacion", "desc")
            );

            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(
                (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Nota)
            );
        } catch (error) {
            console.error("Error obteniendo notas:", error);
            throw error;
        }
    },

    async crearNota(notaData: NotaData): Promise<Nota> {
        try {
            validarNota(notaData);

            const user = FIREBASE_AUTH.currentUser;

            if (!user) {
                throw new Error("Usuario no autenticado.");
            }

            const notasCollection = getNotasCollection();

            const payload = {
                titulo: notaData.titulo.trim(),
                descripcion: notaData.descripcion.trim() || "",
                categoria: notaData.categoria.trim(),
                prioridad: notaData.prioridad,
                completado: false,
                fechaCreacion: Timestamp.now(),
                creadorId: user.uid,
            };

            const docRef = await addDoc(notasCollection, payload);

            return {
                id: docRef.id,
                ...payload,
            };
        } catch (error) {
            console.error("Error creando nota:", error);
            throw error;
        }
    },

    async actualizarNota(
        notaId: string,
        updates: Partial<NotaData & { completado: boolean }>
    ): Promise<void> {
        try {
            if (!notaId) {
                throw new Error("ID de nota inválido.");
            }

            const dataToUpdate: any = {};

            if (updates.titulo !== undefined) {
                if (!updates.titulo.trim()) {
                    throw new Error("El título no puede estar vacío.");
                }

                dataToUpdate.titulo = updates.titulo.trim();
            }

            if (updates.descripcion !== undefined) {
                dataToUpdate.descripcion = updates.descripcion.trim() || "";
            }

            if (updates.categoria !== undefined) {
                dataToUpdate.categoria = updates.categoria.trim();
            }

            if (updates.prioridad !== undefined) {
                if (!prioridadesValidas.includes(updates.prioridad)) {
                    throw new Error("Prioridad inválida.");
                }

                dataToUpdate.prioridad = updates.prioridad;
            }

            if (updates.completado !== undefined) {
                dataToUpdate.completado = updates.completado;
            }

            const notasCollection = getNotasCollection();

            const notaDoc = doc(notasCollection, notaId);

            await updateDoc(notaDoc, dataToUpdate);
        } catch (error) {
            console.error("Error actualizando nota:", error);
            throw error;
        }
    },

    async eliminarNota(notaId: string): Promise<void> {
        try {
            if (!notaId) {
                throw new Error("ID inválido.");
            }

            const notasCollection = getNotasCollection();

            const notaDoc = doc(notasCollection, notaId);

            await deleteDoc(notaDoc);
        } catch (error) {
            console.error("Error eliminando nota:", error);
            throw error;
        }
    },
};