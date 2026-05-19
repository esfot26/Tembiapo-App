import { Prioridad } from "@/src/services/NotasServices";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "../styles/nota.editor.styles"; // Ajustá la ruta si es necesario
import { useTheme } from "@/src/contexts/TemaContext";

// Definimos qué necesita recibir este componente
interface PrioridadSelectorProps {
    prioridad: Prioridad;
    setPrioridad: (p: Prioridad) => void;
}

export const renderPrioridadSelector = ({ prioridad, setPrioridad }: PrioridadSelectorProps) => {
    const { colors } = useTheme();

    const prioridades: { key: Prioridad; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
        { key: "baja", icon: "chevron-down-outline", label: "Baja" },
        { key: "media", icon: "remove-outline", label: "Media" },
        { key: "alta", icon: "chevron-up-outline", label: "Alta" },
    ];

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {prioridades.map((p) => {
                const active = prioridad === p.key;
                return (
                    <TouchableOpacity
                        key={p.key}
                        onPress={() => setPrioridad(p.key)} // Cambia el estado del padre directamente
                        activeOpacity={0.8}
                        style={[
                            styles.selectorItem,
                            {
                                backgroundColor: active ? colors.primary : colors.card,
                                borderColor: active ? colors.primary : colors.border,
                            },
                        ]}
                    >
                        <Ionicons
                            name={p.icon}
                            size={20}
                            color={active ? "white" : colors.foreground}
                        />
                        <Text
                            style={{
                                marginTop: 6,
                                color: active ? "white" : colors.foreground,
                                fontWeight: active ? "700" : "500",
                            }}
                        >
                            {p.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};