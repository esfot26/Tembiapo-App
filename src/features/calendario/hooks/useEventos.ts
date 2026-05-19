import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { FIREBASE_DB } from "@/src/services/FirebaseConfig";
import { Evento } from "../types";
import { User } from "firebase/auth";

export const useEventos = (usuario: User | null, selectedDate: Date | null, setSelectedDate: Dispatch<SetStateAction<Date | null>>, uid?: string) => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!uid) return;

        const ref = collection(FIREBASE_DB, "eventos", uid, "usuario_eventos");

        const unsub = onSnapshot(ref, (snapshot) => {
            const lista = snapshot.docs.map((d) => {
                const data = d.data() as any;
                return {
                    id: d.id,
                    titulo: data.titulo || "Sin título",
                    descripcion: data.descripcion || "",
                    fecha: data.fecha?.toDate?.() || new Date(),
                    tipo: data.tipo || "otro",
                    hora: data.hora || "",
                    notificar: data.notificar ?? false,
                    recordatorioOffsetMinutos: data.recordatorioOffsetMinutos ?? null,
                    notificationId: data.notificationId,
                } as Evento;
            });
            setEventos(lista);
            setLoading(false);
        });

        return () => unsub();
    }, [uid]);

    const eventosDeDia = (fecha: Date) =>
        eventos.filter(
            (ev) =>
                ev.fecha.getDate() === fecha.getDate() &&
                ev.fecha.getMonth() === fecha.getMonth() &&
                ev.fecha.getFullYear() === fecha.getFullYear()
        );

    return { eventos, loading, eventosDeDia };
};