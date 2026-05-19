import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

export default function ItemLista({ item, path, padreId, colors, router, onLongPressCarpeta, onLongPressArchivo }: any) {
    const isFolder = item.type === "folder";

    const handlePress = () => {
        if (isFolder) {
            router.push({
                pathname: "/carpeta",
                params: { padreId: item.id, path: JSON.stringify([...path, { id: item.id, name: item.nombre }]) },
            });
        } else {
            router.push({
                pathname: "/(tabs)/visor",
                params: {
                    url: item.url, nombre: item.nombre, mimeType: item.mimeType,
                    padreId: padreId ?? "", path: JSON.stringify(path ?? []),
                },
            });
        }
    };

    return (
        <Animated.View entering={FadeInUp.delay(50)} exiting={FadeOutDown} className="px-4">
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={handlePress}
                onLongPress={() => isFolder ? onLongPressCarpeta(item) : onLongPressArchivo(item)}
                delayLongPress={200}
                className="rounded-2xl p-4 my-2 flex-row items-center shadow-sm border border-gray-100"
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
            >
                <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: colors.muted }}>
                    <Ionicons
                        name={isFolder ? "folder-outline" : "document-text-outline"}
                        size={28}
                        color={isFolder ? colors.primary : colors.mutedForeground}
                    />
                </View>
                <View className="flex-1 ml-4" style={{ marginRight: 10 }}>
                    <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                        {item.nombre}
                    </Text>
                    <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
                        {isFolder ? "Carpeta" : "Archivo"}
                    </Text>
                </View>
                {isFolder && <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />}
            </TouchableOpacity>
        </Animated.View>
    );
}