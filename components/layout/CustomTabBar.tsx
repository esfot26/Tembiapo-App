import React from "react";
import {
    View,
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions,
    Platform,
    Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
} from "react-native-reanimated";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "@/src/contexts/TemaContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { colors, theme } = useTheme();
    const insets = useSafeAreaInsets();
    const { width, height } = Dimensions.get("window");

    // 🧩 Solo mostrar estas pestañas
    const visibleRoutes = ["inicio", "carpeta", "notas", "calendario", "configuracion"];

    // 🧭 Íconos personalizados
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
        inicio: "home-outline",
        carpeta: "folder-outline",
        notas: "document-text-outline",
        configuracion: "settings-outline",
        calendario: "calendar-outline",
        
    };

    const activeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
        inicio: "home",
        carpeta: "folder",
        notas: "document-text",
        calendario: "calendar",
        configuracion: "settings",

        
    };

    const labels: Record<string, string> = {
        inicio: "Inicio",
        carpeta: "Carpetas",
        notas: "Notas",
        calendario: "Calendario",
        configuracion: "Configuración",
        
    };

    return (
        <Animated.View
            entering={FadeInUp.duration(300)}
            style={[
                styles.tabContainer,
                {
                    backgroundColor: colors.card,
                    shadowColor: theme === "dark" ? "#000" : colors.primary,
                    borderColor: colors.border,
                    bottom: (Platform.OS === "ios" ? 12 : 8) + insets.bottom,
                    left: Math.max(16, width * 0.05),
                    right: Math.max(16, width * 0.05),
                    height: Math.min(68, Math.max(56, height * 0.085)),
                    zIndex: 100,
                },
            ]}
        >
            {state.routes
                .filter((route: { name: string }) => visibleRoutes.includes(route.name.replace("/index", "")))
                .map((route: { name: string; key: string }, index: number) => {
                    const isFocused = state.index === index;
                    const routeKey = route.name.replace("/index", "");
                    const iconName = isFocused
                        ? activeIcons[routeKey] ?? "ellipse"
                        : icons[routeKey] ?? "ellipse-outline";
                    const label = labels[routeKey] ?? routeKey;

                    const scale = useSharedValue(isFocused ? 1.2 : 1);
                    React.useEffect(() => {
                        scale.value = withTiming(isFocused ? 1.2 : 1, { duration: 200 });
                    }, [isFocused]);

                    const animatedIconStyle = useAnimatedStyle(() => ({
                        transform: [{ scale: interpolate(scale.value, [1, 1.2], [1, 1.15]) }],
                    }));

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TouchableWithoutFeedback key={route.key} onPress={onPress}>
                            <View style={styles.tabButton}>
                                <Animated.View
                                    style={[styles.iconContainer, animatedIconStyle]}
                                >
                                    <Ionicons
                                        name={iconName}
                                        size={24}
                                        color={
                                            isFocused
                                                ? colors.primary
                                                : theme === "dark"
                                                    ? "#aaa"
                                                    : colors.primary
                                        }
                                    />
                                </Animated.View>
                                <Text
                                    style={[
                                        styles.label,
                                        {
                                            color: isFocused
                                                ? colors.primary
                                                : theme === "dark"
                                                    ? "#aaa"
                                                    : colors.primary,
                                        },
                                    ]}
                                >
                                    {label}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        borderRadius: 25,
        borderWidth: 1,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 10,
        elevation: 10,
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        fontSize: 10.5,
        fontWeight: "500",
        textAlign: "center",
    },
});
