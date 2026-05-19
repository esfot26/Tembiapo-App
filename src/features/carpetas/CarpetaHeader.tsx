import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/src/contexts/TemaContext";
import { S } from "./carpeta.styles";

type PathEntry = { id: string; name: string };

type Props = {
    path: PathEntry[];
    onBack: () => void;
};

export function CarpetaHeader({ path, onBack }: Props) {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const titulo = path.length === 0 ? "Mis carpetas" : path[path.length - 1].name;

    return (
        <View
            style={[
                S.header,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    paddingTop: insets.top + 4,
                },
            ]}
        >
            {/* Lado izquierdo: back button o espacio vacío */}
            <View style={S.headerSide}>
                {path.length > 0 && (
                    <TouchableOpacity
                        onPress={onBack}
                        activeOpacity={0.7}
                        style={[
                            S.backBtn,
                            {
                                backgroundColor: colors.background,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <Ionicons name="arrow-back" size={20} color={colors.foreground} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Título centrado */}
            <View style={S.headerTitle}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[S.titleText, { color: colors.foreground }]}
                >
                    {titulo}
                </Text>
            </View>

            {/* Espaciador derecho para centrar el título */}
            <View style={S.headerSide} />
        </View>
    );
}
