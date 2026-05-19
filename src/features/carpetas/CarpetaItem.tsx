import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { useTheme } from "@/src/contexts/TemaContext";
import { S } from "./carpeta.styles";
import { ArchivoItem, Carpeta } from "./types";


type Item =
    | (Carpeta & { type: "folder" })
    | (ArchivoItem & { type: "file" });

type Props = {
    item: Item;
    onPress: (item: Item) => void;
    onLongPress: (item: Item) => void;
};

export function CarpetaItem({ item, onPress, onLongPress }: Props) {
    const { colors } = useTheme();
    const isFolder = item.type === "folder";

    return (
        <Animated.View entering={FadeInUp.delay(50)} exiting={FadeOutDown}>
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onPress(item)}
                onLongPress={() => onLongPress(item)}
                delayLongPress={200}
                style={[
                    S.itemContainer,
                    {
                        backgroundColor: colors.background,
                        borderColor: colors.border ?? "#F3F4F6",
                    },
                ]}
            >
                {/* Ícono */}
                <View
                    style={[
                        S.itemIcon,
                        { backgroundColor: isFolder ? "#EFF6FF" : "#F9FAFB" },
                    ]}
                >
                    <Ionicons
                        name={isFolder ? "folder-outline" : "document-text-outline"}
                        size={26}
                        color={isFolder ? "#2563EB" : "#6B7280"}
                    />
                </View>

                {/* Nombre y tipo */}
                <View style={S.itemInfo}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[S.itemName, { color: colors.foreground }]}
                    >
                        {item.nombre}
                    </Text>
                    <Text style={[S.itemType, { color: colors.mutedForeground ?? "#9CA3AF" }]}>
                        {isFolder ? "Carpeta" : "Archivo"}
                    </Text>
                </View>

                {/* Chevron solo en carpetas */}
                {isFolder && (
                    <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}
