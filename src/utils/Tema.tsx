import React from "react";
import { View, Platform } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SunIcon, MoonStarIcon } from "lucide-react-native";
import { usePersistentTheme } from "../hooks/useTemaPersistencia";

const THEME_ICONS = {
    light: SunIcon,
    dark: MoonStarIcon,
};

export function Tema() {
    const { colorScheme, toggleAndSaveTheme } = usePersistentTheme();

    return (
        <View
            style={{
                position: "absolute",
                top: Platform.OS === "ios" ? 60 : 40,
                right: 20,
                zIndex: 999,
            }}
        >
            <Button
                onPress={toggleAndSaveTheme}
                size="icon"
                className="rounded-full bg-blue-500 shadow-md"
            >
                <Icon
                    as={THEME_ICONS[colorScheme ?? "light"]}
                    className="text-white size-5"
                />
            </Button>
        </View>
    );
}