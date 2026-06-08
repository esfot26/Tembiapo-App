import { router, Stack } from "expo-router";
import { Eye, AlertCircle, Moon, Sun, HelpCircle, LogOut } from "lucide-react-native";
import { View, ScrollView, Text } from "react-native";
import Toast from "react-native-toast-message";
import { styles } from "../styles/configuracion.styles";
import { SettingItem } from "./SettingItem";
import { useTheme } from "@/src/contexts/TemaContext";
import { JSX } from "react";

interface Props {
    onSalir: () => void;
}

export const ConfiguracionInvitado = ({ onSalir }: Props): JSX.Element => {
    const { colors, theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{
                title: "Configuración",
                headerStyle: { backgroundColor: colors.card },
                headerShadowVisible: false,
                headerTitleStyle: { color: colors.foreground },
            }} />

            <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
                        <Eye size={40} color="#FFF" />
                    </View>
                    <Text style={[styles.name, { color: colors.foreground }]}>Modo Invitado</Text>
                    <Text style={[styles.email, { color: colors.mutedForeground }]}>
                        Estás explorando la app sin cuenta
                    </Text>
                    <View style={[styles.badge, { backgroundColor: colors.background }]}>
                        <AlertCircle size={14} color={colors.primary} />
                        <Text style={[styles.badgeText, { color: colors.foreground }]}>
                            Datos no guardados en la nube
                        </Text>
                    </View>
                </View>

                <View style={styles.settingsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                        Configuración
                    </Text>

                    <SettingItem
                        title={`Tema: ${isDark ? "Oscuro" : "Claro"}`}
                        icon={isDark ? Moon : Sun}
                        color={isDark ? "#818CF8" : "#F59E0B"}
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
                        color="#DC2626"
                        onPress={onSalir}   // 👈 delega al hook
                        showChevron={false}
                    />
                </View>

                <Text style={[styles.version, { color: colors.mutedForeground }]}>
                    Versión 1.0.1
                </Text>
            </ScrollView>
        </View>
    );
};