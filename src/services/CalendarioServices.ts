import {
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    collection,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIREBASE_DB } from "./FirebaseConfig";


export const CalendarioServices = {
    async verEventos() {
        const usuario = getAuth().currentUser;
        if (!usuario) return [];
        const ref = collection(FIREBASE_DB, "eventos", usuario.uid, "usuario_eventos");
        const q = query(ref, orderBy("fechaCreacion", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    },

    async agregarEvento(evento: any) {
        const usuario = getAuth().currentUser;
        if (!usuario) throw new Error("Usuario no autenticado");
        const ref = collection(FIREBASE_DB, "eventos", usuario.uid, "usuario_eventos");
        await addDoc(ref, {
            ...evento,
            titulo: evento.titulo,
            descripcion: evento.descripcion,
            tipo: evento.tipo,
            hora: evento.hora,
            fechaCreacion: serverTimestamp(),
            fechaActualizacion: serverTimestamp(),
        });
    },
    async actualizarEvento(id: string, data: any) {
        const usuario = getAuth().currentUser;
        if (!usuario) return;
        const ref = doc(FIREBASE_DB, "eventos", usuario.uid, "usuario_eventos", id);
        await updateDoc(ref, data);
    },

    async eliminarEvento(id: string) {
        const usuario = getAuth().currentUser;
        if (!usuario) return;
        const ref = doc(FIREBASE_DB, "eventos", usuario.uid, "usuario_eventos", id);
        await deleteDoc(ref);
    },
};