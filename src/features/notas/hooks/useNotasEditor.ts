import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Nota, Prioridad } from "@/src/services/NotasServices";
import { useNotas } from "@/src/contexts/NotasContext";

function parseNotaParam(raw: string | string[] | undefined) {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw as string) as Nota;
        return parsed?.id ? parsed : null;
    } catch {
        return null;
    }
}

export function useNotaEditor() {
    const { crearNota, actualizarNota } = useNotas();
    const params = useLocalSearchParams();

    const [notaId, setNotaId] = useState<string | null>(null);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("Estudio");
    const [prioridad, setPrioridad] = useState<Prioridad>("baja");
    const [errorTitulo, setErrorTitulo] = useState<string | null>(null);
    const [errorDescripcion, setErrorDescripcion] = useState<string | null>(null);

    const isEdit = !!notaId;

    useEffect(() => {
        // Reset siempre primero
        setNotaId(null);
        setTitulo("");
        setDescripcion("");
        setCategoria("Estudio");
        setPrioridad("baja");
        setErrorTitulo(null);
        setErrorDescripcion(null);

        const nota = parseNotaParam(params.nota);
        if (!nota) return;

        setNotaId(nota.id);
        setTitulo(nota.titulo ?? "");
        setDescripcion(nota.descripcion ?? "");
        setCategoria(nota.categoria ?? "Estudio");
        setPrioridad(nota.prioridad ?? "baja");
    }, [params.nota]);

    const handleSave = async () => {
        let hasError = false;

        if (!titulo.trim()) {
            setErrorTitulo("El título es obligatorio.");
            hasError = true;
        }
        if (!descripcion.trim()) {
            setErrorDescripcion("La descripción es obligatoria.");
            hasError = true;
        }
        if (hasError) return;

        try {
            const notaData = { titulo: titulo.trim(), descripcion: descripcion.trim(), categoria, prioridad };
            if (isEdit && notaId) {
                await actualizarNota(notaId, notaData);
            } else {
                await crearNota(notaData);
            }
            router.replace("/(tabs)/notas");
        } catch (e) {
            console.error("Error al procesar la nota:", e);
        }
    };

    const handleBack = () => router.replace("/(tabs)/notas");

    return {
        // estado
        titulo, setTitulo,
        descripcion, setDescripcion,
        categoria, setCategoria,
        prioridad, setPrioridad,
        errorTitulo, setErrorTitulo,
        errorDescripcion, setErrorDescripcion,
        isEdit,
        // acciones
        handleSave,
        handleBack,
    };
}