import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Alert,
} from "react-native";
import {
    User,
    HelpCircle,
    LogOut,
    ChevronRight,
    Moon,
    Sun,
} from "lucide-react-native";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/TemaContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { FIREBASE_APP } from "@/src/services/FirebaseConfig";
import Toast from "react-native-toast-message";

export default function ConfiguracionScreen() {
    const { colors, theme, toggleTheme } = useTheme();
    const { usuario } = useAuth();
    const router = useRouter();
    const auth = getAuth(FIREBASE_APP);

    // 🔹 Cerrar sesión
    const handleLogout = async () => {
        Alert.alert("Cerrar Sesión", "¿Deseas salir de tu cuenta?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Cerrar Sesión",
                style: "destructive",
                onPress: async () => {
                    try {
                        await signOut(auth);
                        router.replace("/(auth)/login");
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

    const isDark = theme === "dark";

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
                {/* HEADER */}
                <View style={styles.header}>
                    <View
                        style={[
                            styles.avatarContainer,
                            { backgroundColor: colors.primary },
                        ]}
                    >
                        <Text style={styles.avatarText}>
                            {usuario?.displayName?.charAt(0).toUpperCase() || "U"}
                        </Text>
                    </View>
                    <Text style={[styles.name, { color: colors.foreground }]}>
                        {usuario?.displayName || "Usuario"}
                    </Text>
                    <Text style={[styles.email, { color: colors.foreground }]}>
                        {usuario?.email || ""}
                    </Text>
                </View>

                {/* STATS */}
                {/* <View
                    style={[
                        styles.statsRow,
                        { backgroundColor: colors.card, borderColor: colors.border },
                    ]}
                >
                    <Stat label="Cursos" value="12" color={colors.primary} />
                    <Divider color={colors.border} />
                    <Stat label="Promedio" value="85%" color="#F59E0B" />
                    <Divider color={colors.border} />
                    <Stat label="Tareas" value="24" color="#10B981" />
                </View> */}

                {/* CONFIGURACIÓN */}
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
                                        nombreCompleto: usuario?.displayName || (usuario as any)?.nombreCompleto || "",
                                        email: usuario?.email || "",
                                        telefono: (usuario as any)?.telefono || "",
                                        username: (usuario as any)?.username || "",
                                        fechaNacimiento: (usuario as any)?.fechaNacimiento || "",
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
                        onPress={() => Toast.show({ type: "info", text1: "Próximamente" })}
                    />

                    <SettingItem
                        title="Cerrar Sesión"
                        icon={LogOut}
                        color="#DC2626"
                        onPress={handleLogout}
                        showChevron={false}
                    />
                </View>

                <Text style={[styles.version, { color: colors.foreground }]}>
                    Versión 1.0.1
                </Text>
            </ScrollView>
        </View>
    );
}

/* 📍 COMPONENTES REUTILIZABLES */

function SettingItem({ title, icon: Icon, color, onPress, showChevron = true }: {
    title: string;
    icon: React.ComponentType<{ color: string; size: number }>;
    color: string;
    onPress: () => void;
    showChevron?: boolean;
}) {
    const scale = React.useRef(new Animated.Value(1)).current;
    const { colors, theme } = useTheme(); // ✅ usar el tema aquí
    const isDark = theme === "dark";
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPressIn={() =>
                Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()
            }
            onPressOut={() =>
                Animated.spring(scale, {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                }).start()
            }
            onPress={onPress}
        >
            <Animated.View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: isDark ? "#FFFFFF11" : "#00000009",
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    transform: [{ scale }],
                }}
            >
                <View style={[styles.iconContainer, { backgroundColor: color }]}>
                    <Icon color="#fff" size={20} />
                </View>
                <Text
                    style={{
                        flex: 1,
                        fontSize: 16,
                        fontWeight: "600",
                        color: colors.foreground,
                    }}
                >

                    {title}</Text>
                {showChevron && (
                    <ChevronRight
                        color={isDark ? "#9CA3AF" : "#4B5563"} // ✅ cambia según modo
                        size={20}
                    />
                )}
            </Animated.View>
        </TouchableOpacity>
    );
}

function Stat({ label, value, color }: {
    label: string;
    value: string;
    color: string;
}) {
    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color }}>{value}</Text>
            <Text style={{ fontSize: 13, color: "#6B7280", fontWeight: "500" }}>
                {label}
            </Text>
        </View>
    );
}

function Divider({ color }: { color: string }) {
    return <View style={{ width: 1, height: "100%", backgroundColor: color }} />;
}

/* 💅 ESTILOS BASE */
const styles = StyleSheet.create({
    container: { flex: 1, borderColor: "#E5E7EB", borderWidth: 1, },
    scrollView: { flex: 1 },
    header: { alignItems: "center", padding: 50 },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    avatarText: { fontSize: 40, fontWeight: "500", color: "#FFF" },
    name: { fontSize: 22, fontWeight: "700" },
    email: { fontSize: 14 },
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
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    //settingTitle: { flex: 1, fontSize: 16, fontWeight: "600", color: "#F3F4F6" },
    version: { textAlign: "center", marginTop: 50, marginBottom: 50 },
});
