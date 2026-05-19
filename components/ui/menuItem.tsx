import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/src/contexts/TemaContext";

// Definimos las Props para que sea flexible
interface MenuItemProps {
    iconName: keyof typeof MaterialCommunityIcons.glyphMap; // Tipado estricto de iconos
    iconColor: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    count?: number;
    showChevron?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
    iconName,
    iconColor,
    title,
    subtitle,
    onPress,
    count,
    showChevron = true, // Por defecto mostramos la flecha
}) => {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.menuItem,
                {
                    backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                    borderColor: colors.border,
                },
            ]}
        >
            <View style={styles.menuItemLeft}>
                {/* Contenedor del Icono */}
                <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
                    <MaterialCommunityIcons
                        name={iconName}
                        size={22}
                        color={colors.primaryForeground}
                    />
                </View>

                {/* Textos */}
                <View style={styles.textContainer}>
                    <Text style={[styles.menuTitle, { color: colors.foreground }]}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text style={[styles.menuSubtitle, { color: colors.mutedForeground }]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>

            {/* Lado Derecho: Badge y Flecha */}
            <View style={styles.menuItemRight}>
                {count !== undefined && count > 0 && (
                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.badgeText, { color: colors.primaryForeground }]}>
                            {count}
                        </Text>
                    </View>
                )}
                {showChevron && (
                    <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    menuSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    menuItemRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    badge: {
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        paddingHorizontal: 6,
        marginRight: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        fontSize: 11,
        fontWeight: "bold",
    },
});