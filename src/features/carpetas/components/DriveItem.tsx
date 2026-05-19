// components/DriveItem.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

type DriveItem = {
    type: string;
    nombre: string;
};

type DriveItemProps = {
    item: DriveItem;
    onPress: (item: DriveItem) => void;
    onLongPress: (item: DriveItem) => void;
    colors: {
        background: string;
        foreground: string;
        muted: string;
    };
};
    
export default function DriveItem({ item, onPress, onLongPress, colors }: DriveItemProps) {
    const isFolder = item.type === "folder";

    return (
        <Animated.View entering={FadeInUp.delay(50)} exiting={FadeOutDown} className="px-4">
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onPress(item)}
                onLongPress={() => onLongPress(item)}
                delayLongPress={200}
                className="bg-white rounded-2xl p-4 my-2 flex-row items-center shadow-sm border border-gray-100"
                style={{
                    backgroundColor: colors.background,
                    borderColor: colors.foreground,
                }}
            >
                <View
                    className={`w-12 h-12 rounded-xl items-center justify-center ${isFolder ? "bg-blue-100" : "bg-gray-100"
                        }`}
                    style={{ backgroundColor: colors.muted }}
                >
                    <Ionicons
                        name={isFolder ? "folder-outline" : "document-text-outline"}
                        size={28}
                        color={isFolder ? "#2563EB" : "#6B7280"}
                    />
                </View>

                <View className="flex-1 ml-4" style={{ marginRight: 10 }}>
                    <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                        {item.nombre}
                    </Text>
                    <Text className="text-xs mt-1" style={{ color: colors.foreground }}>
                        {isFolder ? "Carpeta" : "Archivo"}
                    </Text>
                </View>

                {isFolder && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
            </TouchableOpacity>
        </Animated.View>
    );
}