import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import {
    User,
    HelpCircle,
    LogOut,
    ChevronRight,
    Moon,
    Sun,
    AlertCircle,
    Eye,
    EyeOff,
    PlayCircle,
} from "lucide-react-native";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/TemaContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { FIREBASE_APP, FIREBASE_DB } from "@/src/services/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { SettingItem } from "./components/SettingItem";

export default function ConfiguracionScreen() {
    const { colors, theme, toggleTheme } = useTheme();
    const { usuario } = useAuth();
    const router = useRouter();
    const auth = getAuth(FIREBASE_APP);
    const [perfil, setPerfil] = useState<any | null>(null);
    const [modoInvitado, setModoInvitado] = useState(false);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const verificarModoYCargarPerfil = async () => {
            try {
                // Verificar modo invitado
                const invitado = await AsyncStorage.getItem("@tembiapo:modo_invitado");
                const esInvitado = invitado === "true";
                setModoInvitado(esInvitado);

                // Cargar perfil solo si no es invitado y hay usuario
                if (!esInvitado && usuario?.uid) {
                    const ref = doc(FIREBASE_DB, "usuarios", usuario.uid);
                    const snap = await getDoc(ref);
                    if (snap.exists()) {
                        setPerfil(snap.data());
                    }
                }
            } catch (e) {
                console.log("Error:", e);
            } finally {
                setCargando(false);
            }
        };
        verificarModoYCargarPerfil();
    }, [usuario?.uid]);

    // 🔹 Cerrar sesión (para usuarios autenticados)
    const handleLogout = async () => {
        Alert.alert("Cerrar Sesión", "¿Deseas salir de tu cuenta?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Cerrar Sesión",
                style: "destructive",
                onPress: async () => {
                    try {
                        await signOut(auth);
                        await AsyncStorage.removeItem("@tembiapo:modo_invitado");
                        router.replace("/(onboarding)/welcome");
                        Toast.show({
                            type: "success",
                            text1: "Sesión cerrada",
                            text2: "Has cerrado sesión correctamente",
                        });
                    } catch (error) {
                        console.error("Error al cerrar sesión:", error);
                        Toast.show({
                            type: "error",
                            text1: "Error al cerrar sesión",
                        });
                    }
                },
            },
        ]);
    };

    // 🔹 Salir del modo invitado
    const handleSalirModoInvitado = () => {
        Alert.alert(
            "Salir del modo invitado",
            "¿Deseas salir del modo invitado? Podrás iniciar sesión para guardar tus datos.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Salir",
                    onPress: async () => {
                        await AsyncStorage.removeItem("@tembiapo:modo_invitado");
                        router.replace("/(onboarding)/slider");
                        Toast.show({
                            type: "info",
                            text1: "Modo invitado",
                            text2: "Has salido del modo invitado",
                        });
                    },
                },
            ]
        );
    };

    // 🔹 Reiniciar tutorial (onboarding)
    const handleReiniciarTutorial = () => {
        Alert.alert(
            "Reiniciar tutorial",
            "¿Deseas ver el tutorial de bienvenida nuevamente?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Reiniciar",
                    onPress: async () => {
                        await AsyncStorage.removeItem("@tembiapo:onboarding_complete");
                        await AsyncStorage.removeItem("@tembiapo:eula_aceptado");
                        router.replace("/(onboarding)/slider");
                        Toast.show({
                            type: "info",
                            text1: "Tutorial reiniciado",
                            text2: "Verás la introducción en tu próxima visita",
                        });
                    },
                },
            ]
        );
    };

    const isDark = theme === "dark";

    // Mostrar pantalla de carga
    if (cargando) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ color: colors.foreground }}>Cargando...</Text>
            </View>
        );
    }

    // ========== VISTA PARA MODO INVITADO ==========
    if (modoInvitado) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Stack.Screen
                    options={{
                        title: "Configuración",
                        headerStyle: { backgroundColor: colors.card },
                        headerShadowVisible: false,
                        headerTitleStyle: { color: colors.foreground },
                    }}
                />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* HEADER para invitado */}
                    <View style={styles.header}>
                        <View
                            style={[
                                styles.avatarContainer,
                                { backgroundColor: colors.primary || "#F59E0B" },
                            ]}
                        >
                            <Eye size={40} color="#FFF" />
                        </View>
                        <Text style={[styles.name, { color: colors.foreground }]}>
                            Modo Invitado
                        </Text>
                        <Text style={[styles.email, { color: colors.mutedForeground }]}>
                            Estás explorando la app sin cuenta
                        </Text>
                        <View style={[styles.badge, { backgroundColor: colors.background}]}>
                            <AlertCircle size={14} color={colors.primary} />
                            <Text style={[styles.badgeText, { color: colors.foreground }]}>
                                Datos no guardados en la nube
                            </Text>
                        </View>
                    </View>

                    {/* CONFIGURACIÓN para invitado */}
                    <View style={styles.settingsSection}>
                        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                            Configuración
                        </Text>

                        <SettingItem
                            title={`Tema: ${isDark ? "Oscuro" : "Claro"}`}
                            icon={isDark ? Moon : Sun}
                            color={isDark ? "#334155" : "#FACC15"}
                            onPress={toggleTheme}
                        />

                        <SettingItem
                            title="Ayuda y Soporte"
                            icon={HelpCircle}
                            color="#10B981"
                            onPress={() => Toast.show({ type: "info", text1: "🔜 Próximamente 🔜" })}
                        />

                        <SettingItem
                            title="Salir del modo invitado"
                            icon={LogOut}
                            color={colors.destructive || "#DC2626"}
                            onPress={handleSalirModoInvitado}
                            showChevron={false}
                        />
                    </View>

                    <Text style={[styles.version, { color: colors.mutedForeground }]}>
                        Versión 1.0.1
                    </Text>
                </ScrollView>
            </View>
        );
    }

    // ========== VISTA PARA USUARIO AUTENTICADO ==========
    const nombreMostrar = perfil?.nombreCompleto || usuario?.displayName || "Usuario";
    const emailMostrar = perfil?.email || usuario?.email || "";

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen
                options={{
                    title: "Configuración",
                    headerStyle: { backgroundColor: colors.card },
                    headerShadowVisible: false,
                    headerTitleStyle: { color: colors.foreground },
                }}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER para usuario autenticado */}
                <View style={styles.header}>
                    <View
                        style={[
                            styles.avatarContainer,
                            { backgroundColor: colors.primary },
                        ]}
                    >
                        <Text style={styles.avatarText}>
                            {nombreMostrar.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <Text style={[styles.name, { color: colors.foreground }]}>
                        {nombreMostrar}
                    </Text>
                    <Text style={[styles.email, { color: colors.mutedForeground }]}>
                        {emailMostrar}
                    </Text>
                </View>

                {/* CONFIGURACIÓN para usuario autenticado */}
                <View style={styles.settingsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                        Configuración
                    </Text>

                    <SettingItem
                        title="Editar Perfil"
                        icon={User}
                        color={colors.primary}
                        onPress={() =>
                            router.push({
                                pathname: "/(tabs)/editar-perfil",
                                params: {
                                    userData: JSON.stringify({
                                        nombreCompleto: perfil?.nombreCompleto || usuario?.displayName || "",
                                        email: perfil?.email || usuario?.email || "",
                                        telefono: perfil?.telefono || "",
                                        username: perfil?.username || "",
                                        fechaNacimiento: perfil?.fechaNacimiento || "",
                                    }),
                                },
                            })
                        }
                    />

                    <SettingItem
                        title={`Tema: ${isDark ? "Oscuro" : "Claro"}`}
                        icon={isDark ? Moon : Sun}
                        color={isDark ? "#334155" : "#FACC15"}
                        onPress={toggleTheme}
                    />

                    <SettingItem
                        title="Ayuda y Soporte"
                        icon={HelpCircle}
                        color="#10B981"
                        onPress={() => Toast.show({ type: "info", text1: "🔜 Próximamente 🔜" })}
                    />

                    <SettingItem
                        title="Cerrar Sesión"
                        icon={LogOut}
                        color="#DC2626"
                        onPress={handleLogout}
                        showChevron={false}
                    />
                </View>

                <Text style={[styles.version, { color: colors.mutedForeground }]}>
                    Versión 1.0.1
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    header: { alignItems: "center", paddingTop: 30, paddingBottom: 20, paddingHorizontal: 20 },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    avatarText: { fontSize: 40, fontWeight: "500", color: "#FFF" },
    name: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
    email: { fontSize: 14, marginBottom: 8 },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "500",
    },
    statsRow: {
        flexDirection: "row",
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
    },
    settingsSection: { paddingHorizontal: 20 },
    version: { textAlign: "center", marginTop: 50, marginBottom: 50 },
});