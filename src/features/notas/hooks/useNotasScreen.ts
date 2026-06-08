import { useEffect, useRef, useState, useCallback } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";
import { useNotas } from "@/src/contexts/NotasContext";
import { Nota } from "@/src/services/NotasServices";

export function useNotasScreen() {
    const { isGuest } = useAuth();
    const { notas, loading, cargarNotas, eliminarNota, actualizarNota } = useNotas();

    const [refreshing, setRefreshing] = useState(false);
    const didLoadRef = useRef(false);
    const alertShownRef = useRef(false);

    useEffect(() => {
        if (isGuest && !alertShownRef.current) {
            alertShownRef.current = true;
            Alert.alert("Acceso Limitado", "Para acceder a tus notas, debes iniciar sesión.",
                [{ text: "OK", style: "default" }]
            );
            return;
        }
        if (!isGuest && !didLoadRef.current) {
            didLoadRef.current = true;
            cargarNotas();
        }
    }, [isGuest, cargarNotas]);

    const handleRefresh = async () => {
        if (isGuest) return;
        setRefreshing(true);
        await cargarNotas();
        setRefreshing(false);
    };

    const handleDelete = useCallback((notaId: string) => {
        Alert.alert("Eliminar Nota", "¿Estás seguro de que quieres eliminar esta nota?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Eliminar", onPress: () => eliminarNota(notaId), style: "destructive" },
        ]);
    }, [eliminarNota]);

    const handleToggleCompleted = useCallback((nota: Nota) => {
        actualizarNota(nota.id, { completado: !nota.completado });
    }, [actualizarNota]);

    const handleCrear = () => {
        if (isGuest) {
            Alert.alert("Modo Invitado", "Para crear notas, debes iniciar sesión.");
            return;
        }
        router.push({ pathname: "/(tabs)/notas/crear" }); 
    };

    return {
        notas, loading, refreshing, isGuest,
        handleRefresh, handleDelete, handleToggleCompleted, handleCrear,
    };
}