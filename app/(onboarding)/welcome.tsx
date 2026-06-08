// app/(onboarding)/welcome.tsx
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WelcomeScreen() {
    const seleccionarOpcion = async (tipo: "invitado" | "login") => {
        if (tipo === "invitado") {
            // Invitado: guardar modo y redirigir directamente a tabs
            await AsyncStorage.setItem("@tembiapo:modo_invitado", "true");
            // También guardar que "aceptó" una versión simplificada
            await AsyncStorage.setItem("@tembiapo:eula_aceptado", "true");
            router.replace("/(tabs)/inicio");
        } else {
            // Login: ir a EULA primero
            router.push({
                pathname: "/(onboarding)/eula",
                params: { tipoAcceso: "login" },
            });
        }
    };

    return (
        <LinearGradient colors={["#1E3A8A", "#2563EB", "#1E40AF"]} style={styles.gradient}>
            <SafeAreaView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* HEADER */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Feather name="book-open" size={40} color="#1E3A8A" />
                        </View>
                        <Text style={styles.appTitle}>Tembiapo</Text>
                        <Text style={styles.subtitle}>
                            Organizá tu vida académica
                        </Text>
                    </View>

                    {/* CARACTERÍSTICAS DESTACADAS */}
                    <View style={styles.featuresContainer}>
                        <View style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <Feather name="folder" size={24} color="#2563EB" />
                            </View>
                            <Text style={styles.featureText}>Organizá materias</Text>
                        </View>

                        <View style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <Feather name="edit-2" size={24} color="#2563EB" />
                            </View>
                            <Text style={styles.featureText}>Notas inteligentes</Text>
                        </View>

                        <View style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <Feather name="calendar" size={24} color="#2563EB" />
                            </View>
                            <Text style={styles.featureText}>Recordatorios</Text>
                        </View>

                        <View style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <Feather name="cloud" size={24} color="#2563EB" />
                            </View>
                            <Text style={styles.featureText}>Sincronización en la nube</Text>
                        </View>
                    </View>

                    {/* BOTONES DE ACCIÓN */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.botonInvitado}
                            onPress={() => seleccionarOpcion("invitado")}
                            activeOpacity={0.8}
                        >
                            <Feather name="user" size={20} color="#1E3A8A" />
                            <Text style={styles.botonInvitadoTexto}>
                                Entrar como invitado
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botonLogin}
                            onPress={() => seleccionarOpcion("login")}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={["#2563EB", "#1E3A8A"]}
                                style={styles.botonLoginGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Feather name="log-in" size={20} color="#fff" />
                                <Text style={styles.botonLoginTexto}>
                                    Iniciar sesión
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* TÉRMINOS Y CONDICIONES */}
                    <View style={styles.termsContainer}>
                        <Text style={styles.termsText}>
                            Al continuar como invitado, aceptás nuestros{" "}
                            <Text style={styles.termsLink}>Términos y condiciones</Text>
                            {" "}y{" "}
                            <Text style={styles.termsLink}>Política de privacidad</Text>
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 24,
    },
    header: {
        alignItems: "center",
        marginBottom: 48,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    appTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 8,
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        color: "#DBEAFE",
        textAlign: "center",
    },
    featuresContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 16,
        marginBottom: 48,
    },
    featureItem: {
        alignItems: "center",
        width: "45%",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#EFF6FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    featureText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1E3A8A",
        textAlign: "center",
    },
    buttonsContainer: {
        gap: 16,
        marginBottom: 32,
    },
    botonInvitado: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 14,
        gap: 10,
        borderWidth: 1,
        borderColor: "#CBD5E1",
    },
    botonInvitadoTexto: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E3A8A",
    },
    botonLogin: {
        borderRadius: 12,
        overflow: "hidden",
    },
    botonLoginGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        gap: 10,
    },
    botonLoginTexto: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    termsContainer: {
        marginTop: "auto",
        paddingTop: 20,
    },
    termsText: {
        fontSize: 12,
        color: "#DBEAFE",
        textAlign: "center",
        lineHeight: 18,
    },
    termsLink: {
        color: "#fff",
        fontWeight: "600",
        textDecorationLine: "underline",
    },
});