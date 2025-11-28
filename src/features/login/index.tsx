import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginLogic } from "./login.hook";
import { styles } from "./login.styles";
import BotonCustom from "../../../components/ui/BotonCustom";
import BotonGradiente from "../../../components/ui/BotonGradiente";
import ContraseñaButton from "../../../components/ui/ContraseñaButton";
import { router } from "expo-router";

export default function LoginScreen() {
    const {
        email, setEmail,
        password, setPassword,
        loading,
        handleLogin,
        handleLoginGoogle,
    } = LoginLogic();

    return (
        <LinearGradient colors={["#1E3A8A", "#2563EB", "#1E40AF"]} style={styles.gradient}>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Feather name="book-open" size={32} color="#1E3A8A" />
                        </View>
                        <Text style={styles.appTitle}>Tembiapo</Text>
                        <Text style={styles.subtitle}>Bienvenido de nuevo</Text>
                    </View>

                    {/* FORM */}
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Inicia Sesión</Text>

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

                        <ContraseñaButton
                            placeholder="Contraseña"
                            value={password}
                            onChangeText={setPassword}
                            backgroundColor="#F9FAFB"
                            iconColor="#1E3A8A"
                        />

                        <BotonGradiente
                            text="Iniciar sesión"
                            onPress={handleLogin}
                            colors={["#2563EB", "#1E3A8A"]}
                        />

                        {/* 🔹 LOGIN GOOGLE */}
                        <TouchableOpacity onPress={handleLoginGoogle} activeOpacity={0.8} style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#fff",
                            borderRadius: 12,
                            paddingVertical: 12,
                            marginTop: 20,
                            borderWidth: 1,
                            borderColor: "#CBD5E1",
                        }}>
                            <Feather name="search" size={20} color="#EA4335" />
                            <Text style={{ marginLeft: 10, color: "#1E3A8A", fontWeight: "bold", fontSize: 15 }}>
                                Iniciar con Google
                            </Text>
                        </TouchableOpacity>

                        {/* 🔹 FOOTER */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
                            <TouchableOpacity onPress={() => router.push("/registro")}>
                                <Text style={styles.footerLink}>Regístrate aquí</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => router.push("/resetear-password")}>
                            <Text className="text-primary mt-3 text-center">
                                ¿Olvidaste tu contraseña?
                            </Text>
                        </TouchableOpacity>


                        {loading && (
                            <View style={{ alignItems: "center", marginTop: 10 }}>
                                <Text style={{ color: "#2563EB", fontWeight: "600" }}>Cargando...</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}
