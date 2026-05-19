// components/EstadoVacio.tsx
import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const EstadoVacio = ({ colors }: { colors: any }) => (
    <View style={{ alignItems: "center", marginTop: 80, paddingHorizontal: 16 }}>
        <Ionicons name="document-text-outline" size={48} color={colors.mutedForeground} />
        <Text style={{ color: colors.mutedForeground, fontSize: 16, marginTop: 10, textAlign: "center" }}>
            No hay notas todavía.
        </Text>
    </View>
);