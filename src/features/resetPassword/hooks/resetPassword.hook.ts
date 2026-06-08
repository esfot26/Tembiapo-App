import { FIREBASE_AUTH } from "@/src/services/FirebaseConfig";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import Toast from "react-native-toast-message";

export const handleReset = async (email: string, setLoading: (loading: boolean) => void) => {
    if (!email.trim()) {
        Toast.show({
            type: "error",
            text1: "Campo vacío",
            text2: "Ingresa tu correo electrónico.",
        });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        Toast.show({
            type: "error",
            text1: "Correo inválido",
            text2: "Ingresa un correo con formato válido (ej: usuario@correo.com).",
        });
        return;
    }

    try {
        setLoading(true);
        await sendPasswordResetEmail(FIREBASE_AUTH, email.trim());

        Toast.show({
            type: "success",
            text1: "Correo enviado ✉️",
            text2: "Revisa tu bandeja de entrada y spam.",
        });

        setTimeout(() => router.back(), 2000);

    } catch (error: any) {
        console.log("Error reset password:", error.code);

        const firebaseErrors: Record<string, string> = {
            "auth/invalid-email": "El formato del correo no es válido.",
            "auth/missing-email": "Ingresa un correo válido.",
            "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.",
            "auth/network-request-failed": "Sin conexión. Verifica tu internet.",
        };

        Toast.show({
            type: "error",
            text1: "Error al enviar",
            text2: firebaseErrors[error.code] ?? "Ocurrió un error inesperado.",
        });
    } finally {
        setLoading(false);
    }
};