import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HeaderCarpeta({ path, onBack, colors, insets }: any) {
    return (
        <View
            className="flex-row items-center justify-between px-4 py-3 border-b shadow-sm"
            style={{ backgroundColor: colors.card, borderColor: colors.border, paddingTop: insets.top + 4 }}
        >
            <View style={{ width: 64 }}>
                {path.length > 0 && (
                    <TouchableOpacity onPress={onBack} activeOpacity={0.7} className="w-9 h-9 rounded-full justify-center items-center shadow-sm" style={{ backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1 }}>
                        <Ionicons name="arrow-back" size={20} color={colors.foreground} />
                    </TouchableOpacity>
                )}
            </View>
            <View style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}>
                <Text numberOfLines={1} ellipsizeMode="tail" className="text-xl font-bold" style={{ color: colors.foreground, textAlign: "center" }}>
                    {path.length === 0 ? "Mis carpetas" : path[path.length - 1].name}
                </Text>
            </View>
            <View style={{ width: 64 }} />
        </View>
    );
}