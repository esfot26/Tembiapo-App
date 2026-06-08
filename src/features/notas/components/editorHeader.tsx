import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    isEdit: boolean;
    paddingTop: number;
    colors: any;
    onBack: () => void;
}

export function EditorHeader({ isEdit, paddingTop, colors, onBack }: Props) {
    return (
        <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            paddingHorizontal: 16, paddingBottom: 12,
            paddingTop, backgroundColor: colors.card,
            borderBottomWidth: 1, borderColor: colors.border,
        }}>
            <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={{
                width: 36, height: 36, borderRadius: 18,
                justifyContent: "center", alignItems: "center",
                backgroundColor: colors.background,
                borderWidth: 1, borderColor: colors.border,
            }}>
                <Ionicons name="arrow-back" size={20} color={colors.foreground} />
            </TouchableOpacity>

            <Text numberOfLines={1} style={{ flex: 1, textAlign: "center", color: colors.foreground, fontSize: 18, fontWeight: "700" }}>
                {isEdit ? "Editar Nota" : "Crear Nota"}
            </Text>

            <View style={{ width: 36 }} />
        </View>
    );
}