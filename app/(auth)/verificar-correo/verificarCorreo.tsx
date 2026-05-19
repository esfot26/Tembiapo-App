import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/text";
import BotonGradiente from "@/components/ui/BotonGradiente";
import { FIREBASE_AUTH } from "@/src/services/FirebaseConfig";
import { sendEmailVerification, reload, signOut } from "firebase/auth";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function VerificarCorreo() {
    const [email, setEmail] = useState<string>("");
    const [cooldown, setCooldown] = useState<number>(0);
    const [checking, setChecking] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);

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
        setChecking(true);
        try {
            await reload(user);
            if (user.emailVerified) {
                Toast.show({
                    type: "success",
                    text1: "¡Cuenta verificada! 🎉",
                    text2: "Bienvenido a Tembiapo.",
                });
                router.replace("/(tabs)/inicio");
            } else {
                Toast.show({
                    type: "info",
                    text1: "Aún no verificado",
                    text2: "Confirma el enlace en tu correo antes de continuar.",
                });
            }
        } finally {
            setChecking(false);
        }
    };

    // ✅ Cierra sesión y va al login
    const volverAlLogin = async () => {
        await signOut(FIREBASE_AUTH);
        router.replace("/(auth)/login");
    };

    return (
        <LinearGradient colors={["#1E3A8A", "#2563EB", "#1E40AF"]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.wrapper}>
                    <View style={styles.card}>

                        {/* Ícono */}
                        <View style={styles.iconContainer}>
                            <Feather name="mail" size={36} color="#1E3A8A" />
                        </View>

                        {/* Título */}
                        <Text style={styles.title}>Verifica tu correo</Text>

                        {/* Descripción */}
                        <Text style={styles.description}>
                            Enviamos un enlace de verificación a
                        </Text>
                        <Text style={styles.emailText}>
                            {email || "tu correo"}
                        </Text>
                        <Text style={styles.description}>
                            Abre el enlace y luego presiona el botón de abajo.
                        </Text>

                        {/* Botón verificar */}
                        <View style={styles.buttonRow}>
                            <BotonGradiente
                                text={checking ? "Comprobando..." : "Ya verifiqué ✓"}
                                onPress={verificarAhora}
                                disabled={checking}
                                colors={["#2563EB", "#1E3A8A"]}
                            />
                        </View>

                        {/* Botón reenviar */}
                        <View style={styles.buttonRow}>
                            <BotonGradiente
                                text={
                                    sending ? "Enviando..." :
                                        cooldown > 0 ? `Reenviar en ${cooldown}s` :
                                            "Reenviar correo"
                                }
                                onPress={reenviar}
                                disabled={cooldown > 0 || sending}
                                colors={["#64748B", "#475569"]}
                            />
                        </View>

                        {/* Separador */}
                        <View style={styles.separator} />

                        {/* ✅ Volver al login */}
                        <TouchableOpacity onPress={volverAlLogin} style={styles.backButton}>
                            <Feather name="arrow-left" size={16} color="#64748B" />
                            <Text style={styles.backText}>
                                No puedo verificar, volver al inicio de sesión
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "center",
        padding: 30,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    iconContainer: {
        alignSelf: "center",
        backgroundColor: "#EFF6FF",
        borderRadius: 100,
        padding: 16,
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#1E3A8A",
        marginBottom: 8,
    },
    description: {
        textAlign: "center",
        fontSize: 14,
        color: "#64748B",
        marginTop: 4,
    },
    emailText: {
        textAlign: "center",
        fontSize: 15,
        fontWeight: "700",
        color: "#1E3A8A",
        marginTop: 2,
    },
    buttonRow: {
        marginTop: 12,
    },
    separator: {
        height: 1,
        backgroundColor: "#E2E8F0",
        marginVertical: 16,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    backText: {
        color: "#64748B",
        fontSize: 13,
        textAlign: "center",
    },
});