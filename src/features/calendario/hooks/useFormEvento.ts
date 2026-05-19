import { useState } from "react";
import { Evento } from "../types";

export const useFormEvento = () => {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [hora, setHora] = useState("");
    const [tipo, setTipo] = useState("otro");
    const [notificar, setNotificar] = useState(false);
    const [recordatorioOffset, setRecordatorioOffset] = useState<number | null>(null);
    const [editingEvento, setEditingEvento] = useState<Evento | null>(null);

    const resetForm = () => {
        setTitulo("");
        setDescripcion("");
        setHora("");
        setTipo("otro");
        setNotificar(false);
        setRecordatorioOffset(null);
        setEditingEvento(null);
    };

    const cargarEvento = (ev: Evento) => {
        setEditingEvento(ev);
        setTitulo(ev.titulo);
        setDescripcion(ev.descripcion || "");
        setHora(ev.hora || "");
        setTipo(ev.tipo || "otro");
        setNotificar(!!ev.notificar);
        setRecordatorioOffset(ev.recordatorioOffsetMinutos ?? null);
    };

    return {
        titulo, setTitulo,
        descripcion, setDescripcion,
        hora, setHora,
        tipo, setTipo,
        notificar, setNotificar,
        recordatorioOffset, setRecordatorioOffset,
        editingEvento, setEditingEvento,
        resetForm,
        cargarEvento,
    };
};

export type UseFormEventoReturn = ReturnType<typeof useFormEvento>;