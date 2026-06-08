import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/TemaContext";
import { User, HelpCircle, LogOut, Moon, Sun } from "lucide-react-native";
import { SettingItem } from "./SettingItem";
import Toast from "react-native-toast-message";

interface Props {
    perfilParaEditar: object;
    onLogout: () => void;
    colors: any;
}

export function ConfiguracionOpciones({ perfilParaEditar, onLogout, colors }: Props) {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12, textAlign: "center", color: colors.foreground }}>
                Configuración
            </Text>

            <SettingItem
                title="Editar Perfil"
                icon={User}
                color={isDark ? "#38BDF8" : "#0284C7"}
                onPress={() => router.push({ pathname: "/(tabs)/editar-perfil", params: { userData: JSON.stringify(perfilParaEditar) } })}
            />

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
                title="Cerrar Sesión"
                icon={LogOut}
                color="#DC2626"
                onPress={onLogout}
                showChevron={false}
            />
        </View>
    );
}