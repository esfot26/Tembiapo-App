import colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text } from "react-native";

import { useState } from "react";
import { useTheme } from "@/src/contexts/TemaContext";
import { styles } from "../styles/nota.editor.styles";


interface CategoriaSelectorProps {
    categoria: string;
    setCategoria: (c: string) => void;
}

export const renderCategoriaSelector = ({ categoria, setCategoria }: CategoriaSelectorProps) => {
    const { colors } = useTheme();

    const categorias: { key: string; icon: keyof typeof Ionicons.glyphMap }[] = [
        { key: "Trabajo", icon: "briefcase-outline" },
        { key: "Personal", icon: "person-outline" },
        { key: "Estudio", icon: "book-outline" },
        { key: "Salud", icon: "heart-outline" },
    ];

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {categorias.map((c) => {
                const active = categoria === c.key;
                return (
                    <TouchableOpacity
                        key={c.key}
                        onPress={() => setCategoria(c.key)}
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
                            name={c.icon}
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
                            {c.key}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};