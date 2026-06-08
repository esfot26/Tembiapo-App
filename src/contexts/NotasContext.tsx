import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { Nota, NotasService, NotaData } from "../services/NotasServices";

type NotasContextType = {
    notas: Nota[];
    setNotas: React.Dispatch<React.SetStateAction<Nota[]>>;
    loading: boolean;
    cargarNotas: () => Promise<void>;
    crearNota: (notaData: NotaData) => Promise<void>;
    actualizarNota: (notaId: string, updates: Partial<Omit<Nota, "id" | "creadorId" | "fechaCreacion">>) => Promise<void>;
    eliminarNota: (notaId: string) => Promise<void>;
};

const NotasContext = createContext<NotasContextType | undefined>(undefined);

export const NotasProvider = ({ children }: { children: ReactNode }) => {
    const [notas, setNotas] = useState<Nota[]>([]);
    const [loading, setLoading] = useState(false);

    const cargarNotas = useCallback(async () => {
        setLoading(true);
        try {
            const notasObtenidas = await NotasService.obtenerNotas();
            setNotas(notasObtenidas);
        } catch (error) {
            //console.error("Error al cargar las notas:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: " ❌ No se pudieron cargar las notas.",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const crearNota = async (notaData: NotaData) => {

        const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
        const tempNota: Nota = {
            id: tempId,
            ...notaData,
            completado: false,
            creadorId: "temp",
            fechaCreacion: { toDate: () => new Date() } as any,
        };

        setNotas((prev) => [tempNota, ...prev]);

        try {

            const nuevaNota = await NotasService.crearNota(notaData);

            setNotas((prev) =>
                prev.map((n) => (n.id === tempId ? (nuevaNota as unknown as Nota) : n))
            );

            Toast.show({
                type: "success",
                text1: "¡Nota creada!",
                text2: "✅​ Tu nueva nota ya está disponible.",
                visibilityTime: 1500,
                autoHide: true,
                topOffset: 60,
            });
        } catch (error) {
            console.error("Error al crear la nota:", error);

            setNotas((prev) => prev.filter((n) => n.id !== tempId));

            Toast.show({
                type: "error",
                text1: "Error",
                text2: " ❌ No se pudo crear la nota.",
            });
        }
    };

    const actualizarNota = async (
        notaId: string,
        updates: Partial<Omit<Nota, "id" | "creadorId" | "fechaCreacion">>
    ) => {

        const notaOriginal = notas.find((n) => n.id === notaId);
        if (!notaOriginal) return;

        setNotas((prev) =>
            prev.map((n) => (n.id === notaId ? { ...n, ...updates } : n))
        );

        try {

            await NotasService.actualizarNota(notaId, updates);

            let tituloToast = "Nota Actualizada";
            let mensajeToast = "✅ La nota ha sido actualizada exitosamente.";

            if (updates.completado !== undefined) {
                tituloToast = updates.completado ? "¡Nota Completada! 🎉" : "Nota Pendiente 📋";
                mensajeToast = updates.completado
                    ? "La nota se marcó como completada."
                    : "La nota se marcó como pendiente.";
            }

            Toast.show({
                type: "success",
                text1: tituloToast,
                text2: mensajeToast,
                visibilityTime: 1500, 
                autoHide: true,
                topOffset: 60,
            });
        } catch (error) {
            console.error("Error al actualizar la nota:", error);

            setNotas((prev) =>
                prev.map((n) => (n.id === notaId ? notaOriginal : n))
            );

            Toast.show({
                type: "error",
                text1: "Error",
                text2: " ❌ No se pudo actualizar la nota.",
            });
        }
    };

    const eliminarNota = async (notaId: string) => {

        const notaEliminada = notas.find((n) => n.id === notaId);
        if (!notaEliminada) return;
        setNotas((prev) => prev.filter((n) => n.id !== notaId));

        try {
            await NotasService.eliminarNota(notaId);

            Toast.show({
                type: "success",
                text1: "🗑️ Nota eliminada",
                text2: "✅​ La nota fue eliminada correctamente .",
                visibilityTime: 1500,
                autoHide: true,
                topOffset: 50,
                position: "top",
            });
        } catch (error) {
            console.error("Error al eliminar la nota:", error);
            setNotas((prev) => [notaEliminada, ...prev]);

            Toast.show({
                type: "error",
                text1: "Error",
                text2: " ❌ No se pudo eliminar la nota.",
                autoHide: true,
                topOffset: 60,
            });
        }
    };

    return (
        <NotasContext.Provider
            value={{
                notas,
                setNotas,
                loading,
                cargarNotas,
                crearNota,
                actualizarNota,
                eliminarNota,
            }}
        >
            {children}
        </NotasContext.Provider>
    );
};

export const useNotas = () => {
    const context = useContext(NotasContext);
    if (!context) {
        throw new Error("useNotas debe usarse dentro de NotasProvider");
    }
    return context;
};
