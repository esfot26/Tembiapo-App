import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { FIREBASE_AUTH } from "@/src/services/FirebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import BotonCustom from "@/components/ui/BotonCustom";
import BotonGradiente from "@/components/ui/BotonGradiente";


export default function ResetPasswordScreen() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        // Validación campo vacío
        if (!email.trim()) {
            Toast.show({
                type: "error",
                text1: "Campo vacío",
                text2: "Ingresa tu correo electrónico.",
            });
            return;
        }

        // Validación formato
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

    return (
        <LinearGradient colors={["#1E3A8A", "#2563EB", "#1E40AF"]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 25, paddingVertical: 25 }}
                >
                    <View style={{ alignItems: "center", marginBottom: 12 }}>
                        <View style={{ backgroundColor: "white", borderRadius: 100, padding: 8 }}>
                            <Feather name="unlock" size={32} color="#1E3A8A" />
                        </View>
                        <Text style={{ color: "white", fontSize: 28, fontWeight: "bold", marginTop: 4 }}>
                            Recuperar contraseña
                        </Text>
                        <Text style={{ color: "#DBEAFE", marginTop: 2, fontSize: 15 }}>
                            Te enviaremos un enlace de restablecimiento
                        </Text>
                    </View>

                    <View
                        style={{
                            backgroundColor: "white",
                            borderRadius: 35,
                            padding: 14,
                            shadowColor: "#000",
                            shadowOpacity: 0.15,
                            shadowRadius: 10,
                            elevation: 6,
                        }}
                    >
                        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1E3A8A", marginBottom: 8 }}>
                            Ingresa tu correo
                        </Text>

                        <BotonCustom
                            iconName="mail"
                            placeholder="Correo electrónico"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            backgroundColor="#F9FAFB"
                            iconColor="#1E3A8A"
                        />

                        {/* <Button
                            className="text-white"
                            onPress={handleReset} disabled={loading}>
                            {loading ? "Enviando..." : "Enviar correo"}
                        </Button> */}

                        <BotonGradiente
                            text={loading ? "Enviando..." : "Enviar correo"}
                            onPress={handleReset}
                            colors={["#2563EB", "#1E3A8A"]}
                        />

                        <View style={{ alignItems: "center", marginTop: 12 }}>
                            <Text style={{ color: "#64748B" }}>¿Recordaste tu contraseña?</Text>
                            <Text
                                onPress={() => router.back()}
                                style={{ color: "#1E3A8A", fontWeight: "bold", marginTop: 4 }}
                            >
                                Volver al inicio de sesión
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}
