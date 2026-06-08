import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { FIREBASE_APP, FIREBASE_DB } from "@/src/services/FirebaseConfig";
import { useAuth } from "@/src/contexts/AuthContext";

export function useConfiguracion() {
    const { usuario } = useAuth();
    const router = useRouter();
    const auth = getAuth(FIREBASE_APP);

    const [perfil, setPerfil] = useState<any | null>(null);
    const [modoInvitado, setModoInvitado] = useState(false);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const invitado = await AsyncStorage.getItem("@tembiapo:modo_invitado");
                const esInvitado = invitado === "true";
                setModoInvitado(esInvitado);

                if (!esInvitado && usuario?.uid) {
                    const snap = await getDoc(doc(FIREBASE_DB, "usuarios", usuario.uid));
                    if (snap.exists()) setPerfil(snap.data());
                }
            } catch (e) {
                console.error("Error cargando configuración:", e);
            } finally {
                setCargando(false);
            }
        };
        init();
    }, [usuario?.uid]);

    const handleLogout = () => {
        Alert.alert("Cerrar Sesión", "¿Deseas salir de tu cuenta?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Cerrar Sesión", style: "destructive",
                onPress: async () => {
                    try {
                        await signOut(auth);
                        await AsyncStorage.removeItem("@tembiapo:modo_invitado");
                        router.replace("/(onboarding)/welcome");
                        Toast.show({ type: "success", text1: "Sesión cerrada", text2: "Has cerrado sesión correctamente" });
                    } catch {
                        Toast.show({ type: "error", text1: "Error al cerrar sesión" });
                    }
                },
            },
        ]);
    };

    const handleSalirModoInvitado = () => {
        Alert.alert("Salir del modo invitado", "¿Deseas salir? Podrás iniciar sesión para guardar tus datos.", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Salir",
                onPress: async () => {
                    await AsyncStorage.removeItem("@tembiapo:modo_invitado");
                    router.replace("/(onboarding)/slider");
                    Toast.show({ type: "info", text1: "Modo invitado", text2: "Has salido del modo invitado" });
                },
            },
        ]);
    };

    const handleReiniciarTutorial = () => {
        Alert.alert("Reiniciar tutorial", "¿Deseas ver el tutorial nuevamente?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Reiniciar",
                onPress: async () => {
                    await AsyncStorage.removeItem("@tembiapo:onboarding_complete");
                    await AsyncStorage.removeItem("@tembiapo:eula_aceptado");
                    router.replace("/(onboarding)/slider");
                    Toast.show({ type: "info", text1: "Tutorial reiniciado", text2: "Verás la introducción en tu próxima visita" });
                },
            },
        ]);
    };

    const nombreMostrar = perfil?.nombreCompleto || usuario?.displayName || "Usuario Invitado";
    const emailMostrar = perfil?.email || usuario?.email || "";

    const perfilParaEditar = {
        nombreCompleto: perfil?.nombreCompleto || usuario?.displayName || "",
        email: perfil?.email || usuario?.email || "",
        telefono: perfil?.telefono || "",
        username: perfil?.username || "",
        fechaNacimiento: perfil?.fechaNacimiento || "",
    };

    return {
        cargando, modoInvitado,
        nombreMostrar, emailMostrar, perfilParaEditar,
        handleLogout, handleSalirModoInvitado, handleReiniciarTutorial,
    };
}