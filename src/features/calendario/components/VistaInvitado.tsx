import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props { colors: any }

export function VistaInvitados({ colors }: Props) {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
            <Ionicons name="lock-closed" size={64} color={colors.mutedForeground} />
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginTop: 16, textAlign: "center" }}>
                Acceso Limitado
            </Text>
            <Text style={{ fontSize: 14, color: colors.mutedForeground, marginTop: 8, textAlign: "center", lineHeight: 20 }}>
                Para acceder a tus eventos, debés iniciar sesión con tu cuenta.
            </Text>
        </View>
    );
}