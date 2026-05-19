import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/contexts/TemaContext";

interface StatCardProps {
    value: number | string;
    label: string;
    color: string;
    description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    value,
    label,
    color,
    description
}) => {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <View
            style={[
                styles.statCard,
                {
                    backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                    borderColor: colors.border,
                },
            ]}
        >
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                {label}
            </Text>
            {description && (
                <Text style={[styles.statDescription, { color: colors.mutedForeground }]}>
                    {description}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    statCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        minHeight: 100, // Asegura que todas tengan el mismo alto en la fila
    },
    statValue: {
        fontSize: 26,
        fontWeight: "800",
        marginBottom: 2,
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        textAlign: "center",
    },
    statDescription: {
        fontSize: 9,
        marginTop: 4,
        opacity: 0.7,
    },
});