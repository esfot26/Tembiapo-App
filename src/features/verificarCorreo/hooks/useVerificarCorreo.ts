import { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "@/src/services/FirebaseConfig";
import { sendEmailVerification, reload, signOut } from "firebase/auth";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

export function useVerificarCorreo() {
    const [email, setEmail] = useState("");
    const [cooldown, setCooldown] = useState(0);
    const [checking, setChecking] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        setEmail(FIREBASE_AUTH.currentUser?.email ?? "");
    }, []);

    const startCooldown = () => {
        setCooldown(60);
        const interval = setInterval(() => {
            setCooldown((c) => {
                if (c <= 1) { clearInterval(interval); return 0; }
                return c - 1;
            });
        }, 1000);
    };

    const reenviar = async () => {
        const user = FIREBASE_AUTH.currentUser;
        if (!user || cooldown > 0) return;
        try {
            setSending(true);
            await sendEmailVerification(user);
            Toast.show({
                type: "success",
                text1: "Correo reenviado ✉️",
                text2: "Revisa tu bandeja de entrada y spam.",
            });
            startCooldown();
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Error al reenviar",
                text2: error.code === "auth/too-many-requests"
                    ? "Demasiados intentos. Espera unos minutos."
                    : "No se pudo enviar el correo. Intenta de nuevo.",
            });
        } finally {
            setSending(false);
        }
    };

    const verificarAhora = async () => {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) {
            Toast.show({ type: "error", text1: "Sesión no encontrada" });
            return;
        }
        try {
            setChecking(true);
            await reload(user);
            if (user.emailVerified) {
                Toast.show({ type: "success", text1: "¡Cuenta verificada! 🎉", text2: "Bienvenido a Tembiapo." });
                router.replace("/(tabs)/inicio");
            } else {
                Toast.show({ type: "info", text1: "Aún no verificado", text2: "Confirma el enlace en tu correo antes de continuar." });
            }
        } finally {
            setChecking(false);
        }
    };

    const volverAlLogin = async () => {
        await signOut(FIREBASE_AUTH);
        router.replace("/(auth)/login");
    };

    return { email, cooldown, checking, sending, reenviar, verificarAhora, volverAlLogin };
}