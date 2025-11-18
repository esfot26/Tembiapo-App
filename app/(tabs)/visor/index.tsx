import React from "react";
import { View, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/TemaContext";

export default function VisorArchivo() {
    const { url, nombre, padreId, path } = useLocalSearchParams();
    const router = useRouter();

    const { colors } = useTheme();


    const handleBack = () => {
        if (padreId) {
            // ✅ Volver a la carpeta anterior
            router.replace({
                pathname: "/(tabs)/carpeta",
                params: {
                    padreId: padreId ?? "",
                    path: JSON.stringify(path ?? []),
                },
            });
        } else {
            // Si no hay carpeta padre, volvemos al inicio
            router.replace("/(tabs)/carpeta");
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.foreground }}>
            {/* Header con botón de volver */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 32,
                    paddingHorizontal: 16,
                    backgroundColor: colors.background,
                    elevation: 4,
                }}
            >
                <TouchableOpacity
                    onPress={handleBack}
                    style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                    <Ionicons name="arrow-back" size={24} 
                    style={{ color: colors.foreground }}
                    />
                    <Text style={{ color: colors.foreground, fontWeight: "bold", fontSize: 16 }}>
                        {nombre ? nombre.slice(0, 30) : "Archivo"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* WebView */}
            <WebView
                source={{ uri: url as string }}
                startInLoadingState
                renderLoading={() => (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#fff",
                        }}
                    >
                        <ActivityIndicator size="large" color="#2563EB" />
                        <Text style={{ marginTop: 10, color: "#555" }}>
                            Cargando archivo...
                        </Text>
                    </View>
                )}
                style={{ flex: 1 }}
            />
        </View>
    );
}
