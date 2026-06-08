import { useEffect, useRef } from "react";
import { Alert } from "react-native";

export function useGuestGuard(isGuest: boolean) {
    const alertShownRef = useRef(false);

    useEffect(() => {
        if (isGuest && !alertShownRef.current) {
            alertShownRef.current = true;
            Alert.alert(
                "Acceso Limitado",
                "Para acceder a tus eventos, debes iniciar sesión.",
                [{ text: "OK", style: "default" }]
            );
        }
    }, [isGuest]);


    const guardAction = (mensaje: string, accion: () => void) => {
        if (isGuest) {
            Alert.alert("No permitido", mensaje);
            return;
        }
        accion();
    };

    return { guardAction };
}