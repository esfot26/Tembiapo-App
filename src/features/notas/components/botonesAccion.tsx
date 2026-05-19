import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/TemaContext";

interface AccionesNotaProps {
    item: any; // O el tipo de tu Nota
    onDelete: (id: string) => void;
}

export const AccionesNota = ({ item, onDelete }: AccionesNotaProps) => {
    const router = useRouter();
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const handleEdit = () => {
        router.push({
            pathname: "/(tabs)/notas/crear",
            params: { nota: JSON.stringify(item) },
        });
    };

    return (
        <View style={styles.container}>
            {/* Botón Editar */}
            <TouchableOpacity
                onPress={handleEdit}
                activeOpacity={0.7}
                style={[styles.button, { backgroundColor: colors.primary, marginRight: 12 }]}
            >
                <Ionicons name="pencil-outline" size={20} color={colors.primaryForeground || "#fff"} />
            </TouchableOpacity>

            {/* Botón Borrar */}
            <TouchableOpacity
                onPress={() => onDelete(item.id)}
                activeOpacity={0.7}
                style={[styles.button, { backgroundColor: colors.destructive }]}
            >
                <Ionicons name="trash-outline" size={20} color={"#fff"} />
            </TouchableOpacity>
        </View>
    );
};

const getStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
        },
        button: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            // Elevación sutil para un look más moderno
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
        },
    });