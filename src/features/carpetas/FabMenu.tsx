import React from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/src/contexts/TemaContext";
import { S } from "./carpeta.styles";

type Props = {
    visible: boolean;
    padreId: string | null;
    onToggle: () => void;
    onCrearCarpeta: () => void;
    onSubirArchivo: () => void;
};

export function FabMenu({
    visible,
    padreId,
    onToggle,
    onCrearCarpeta,
    onSubirArchivo,
}: Props) {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const bottomOffset = insets.bottom + Math.max(88, Math.floor(Dimensions.get("window").height * 0.08));

    return (
        <View style={[S.fabContainer, { bottom: bottomOffset }]}>
            {/* Opciones expandidas */}
            {visible && (
                <Animated.View
                    entering={FadeInUp.springify()}
                    exiting={FadeOutDown}
                    style={S.fabMenu}
                >
                    {/* Crear carpeta */}
                    <TouchableOpacity
                        onPress={onCrearCarpeta}
                        activeOpacity={0.8}
                        style={S.fabSecondary}
                    >
                        <Ionicons name="folder-open-outline" size={24} color="#4B5563" />
                    </TouchableOpacity>

                    {/* Subir archivo — solo dentro de una carpeta */}
                    {padreId && (
                        <TouchableOpacity
                            onPress={onSubirArchivo}
                            activeOpacity={0.8}
                            style={S.fabSecondary}
                        >
                            <Ionicons name="cloud-upload-outline" size={24} color="#2563EB" />
                        </TouchableOpacity>
                    )}
                </Animated.View>
            )}

            {/* Botón principal */}
            <TouchableOpacity
                onPress={onToggle}
                activeOpacity={0.9}
                style={[S.fabMain, { backgroundColor: colors.primary }]}
            >
                <Ionicons
                    name={visible ? "close" : "add"}
                    size={30}
                    color={colors.primaryForeground ?? "#fff"}
                />
            </TouchableOpacity>
        </View>
    );
}
