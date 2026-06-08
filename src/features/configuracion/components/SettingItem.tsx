// components/ui/SettingItem.tsx
import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useTheme } from "@/src/contexts/TemaContext";

interface SettingItemProps {
    title: string;
    icon: React.ComponentType<any>;
    color: string;
    onPress: () => void;
    showChevron?: boolean;
}

export const SettingItem = ({ title, icon: Icon, color, onPress, showChevron = true }: SettingItemProps) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
                    <Icon size={20} color={color} />
                </View>
                <Text style={[styles.settingText, { color: colors.foreground }]}>
                    {title}
                </Text>
            </View>
            {showChevron && <ChevronRight size={20} color={colors.mutedForeground} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    settingLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    settingText: {
        fontSize: 16,
    },
});