import React from "react";
import { View, Platform, StyleSheet } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SunIcon, MoonStarIcon } from "lucide-react-native";
import { useTheme } from "@/src/contexts/TemaContext"; // 👈 tu contexto global

export function TemaSwitcher() {
    const { theme, colors, toggleTheme } = useTheme();

    return (
        <View style={styles.container}>
            <Button
                onPress={toggleTheme}
                size="icon"
                className="rounded-full shadow-md"
                style={[
                    styles.button,
                    { backgroundColor: colors.primary }, // 👈 usa tu paleta THEME
                ]}
            >
                <Icon
                    as={theme === "dark" ? SunIcon : MoonStarIcon}
                    className="text-white size-5"
                />
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: Platform.OS === "ios" ? 60 : 40,
        right: 20,
        zIndex: 999,
    },
    button: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
});
