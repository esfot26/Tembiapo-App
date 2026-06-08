import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/TemaContext";

interface HeaderPerfilProps {
    titulo: string;
    onBack?: () => void;
}
export function HeaderPerfil({ titulo, onBack }: HeaderPerfilProps) {
    const { colors } = useTheme();
    const router = useRouter();

    const handleBack = onBack ?? (() => router.replace("/(tabs)/configuracion"));

    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 12,
        }}>
            <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.7}
                style={{
                    width: 36, height: 36,
                    borderRadius: 18,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    elevation: 2,
                    shadowOpacity: 0.12,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                }}
            >
                <Ionicons name="arrow-back" size={20} color={colors.foreground} />
            </TouchableOpacity>

            <Text style={{
                flex: 1,
                textAlign: "center",
                fontSize: 18,
                fontWeight: "700",
                color: colors.foreground,
            }}
                numberOfLines={1}
            >
                {titulo}
            </Text>

            {/* Espaciador para centrar el título */}
            <View style={{ width: 36 }} />
        </View>
    );
}