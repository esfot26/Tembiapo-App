// app/index.tsx
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "@/src/services/FirebaseConfig";
import { useTheme } from "@/src/contexts/TemaContext";

export default function Index() {
    const { colors } = useTheme();
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const verificarFlujo = async () => {
            try {
                // 1. Verificar onboarding
                const onboardingComplete = await AsyncStorage.getItem("@tembiapo:onboarding_complete");

                // 2. Verificar EULA
                const eulaAceptado = await AsyncStorage.getItem("@tembiapo:eula_aceptado");

                // 3. Verificar modo invitado
                const modoInvitado = await AsyncStorage.getItem("@tembiapo:modo_invitado");

                // 4. Verificar usuario actual
                const usuarioActual = FIREBASE_AUTH.currentUser;

                console.log("Index - Verificando:", {
                    onboardingComplete,
                    eulaAceptado,
                    modoInvitado,
                    tieneUsuario: !!usuarioActual
                });

                // Caso 1: No vio el onboarding
                if (!onboardingComplete) {
                    console.log("→ Mostrando onboarding");
                    router.replace("/(onboarding)/index");
                    return;
                }

                // Caso 2: No aceptó EULA
                if (!eulaAceptado) {
                    console.log("→ Mostrando welcome");
                    router.replace("/(onboarding)/welcome");
                    return;
                }

                // Caso 3: Modo invitado activo
                if (modoInvitado === "true") {
                    console.log("→ Modo invitado");
                    router.replace("/(tabs)/inicio");
                    return;
                }

                // Caso 4: Usuario logueado
                if (usuarioActual) {
                    console.log("→ Usuario logueado");
                    router.replace("/(tabs)/inicio");
                    return;
                }

                // Caso 5: Por defecto, mostrar welcome
                console.log("→ Por defecto: welcome");
                router.replace("/(onboarding)/slider");

            } catch (error) {
                console.error("Error en verificación:", error);
                router.replace("/(onboarding)/index");
            } finally {
                setCargando(false);
            }
        };

        verificarFlujo();
    }, []);

    if (cargando) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return null;
}