import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import BotonGradiente from "@/components/ui/BotonGradiente";
import { FIREBASE_AUTH } from "@/src/services/FirebaseConfig";
import { sendEmailVerification, reload, signOut } from "firebase/auth";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

export default function VerificarCorreo() {
    const [email, setEmail] = useState<string>("");
    const [cooldown, setCooldown] = useState<number>(0);
    const [checking, setChecking] = useState<boolean>(false);

    useEffect(() => {
        setEmail(FIREBASE_AUTH.currentUser?.email ?? "");
    }, []);

    const startCooldown = () => {
        setCooldown(60);
        const interval = setInterval(() => {
            setCooldown((c) => {
                if (c <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return c - 1;
            });
        }, 1000);
    };

    const reenviar = async () => {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) return;
        if (cooldown > 0) return;

        await sendEmailVerification(user);

        Toast.show({
            type: "success",
            text1: "Correo reenviado",
            text2: "Revisa tu bandeja nuevamente.",
        });

        startCooldown();
    };

    const verificarAhora = async () => {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) {
            Toast.show({ type: "error", text1: "Sesión no encontrada" });
            return;
        }
        setChecking(true);
        try {
            await reload(user);
            if (user.emailVerified) {
                Toast.show({ type: "success", text1: "Cuenta verificada" });
                router.replace("/(tabs)/inicio");
            } else {
                Toast.show({
                    type: "info",
                    text1: "Aún no verificado",
                    text2: "Confirma el enlace en tu correo.",
                });
            }
        } finally {
            setChecking(false);
        }
    };

    const cerrarSesion = async () => {
        await signOut(FIREBASE_AUTH);
        router.replace("/(auth)/login");
    };

    return (
        <LinearGradient colors={["#1E3A8A", "#2563EB", "#1E40AF"]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: "center", padding: 30 }}>
                    <View style={{ backgroundColor: "white", borderRadius: 24, padding: 20 }}>
                        <Text style={{ fontSize: 26, fontWeight: "bold", textAlign: "center", color: "#1E3A8A" }}>
                            Verifica tu correo
                        </Text>

                        <Text style={{ marginTop: 10, textAlign: "center", fontSize: 15,color: "#1E3A8A" }}>
                            Enviamos un enlace de verificación a
                        </Text>
                        <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "600", color: "#1E3A8A" }}>
                            {email || "tu correo"}
                        </Text>
                        <Text style={{ marginTop: 10, textAlign: "center", fontSize: 15, color: "#1E3A8A" }}>
                            Una vez verificado, podrás acceder a la aplicación.
                        </Text>

                        <View style={{ marginTop: 16 }}>
                            <BotonGradiente
                                text={cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar correo"}
                                onPress={reenviar}
                            />
                        </View>

                        <View style={{ marginTop: 12 }}>
                            <BotonGradiente
                                text={checking ? "Comprobando..." : "Ya verifiqué"}
                                onPress={verificarAhora}
                            />
                        </View>

                        <Button variant="ghost" className="mt-3" onPress={cerrarSesion}>
                            Cerrar sesión
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
