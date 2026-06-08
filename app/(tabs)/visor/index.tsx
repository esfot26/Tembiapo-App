import React, { useMemo, useState } from "react";
import * as Linking from "expo-linking";
import { View, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/src/contexts/TemaContext";

export default function VisorArchivo() {
    const { url, nombre, padreId, path, mimeType } = useLocalSearchParams();
    const router = useRouter();

    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const rawUrl = String(url ?? "");
    const m = String(mimeType ?? "").toLowerCase();
    const ext = rawUrl.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
    const isPdf = m.includes("pdf") || ext === "pdf";
    const isOffice = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext) ||
        m.includes("msword") || m.includes("officedocument") || m.includes("powerpoint") || m.includes("excel");
    const [pdfFallback, setPdfFallback] = useState(false);

    const handleBack = () => {
        const parentId = Array.isArray(padreId) ? padreId[0] : padreId;
        const rawPath = Array.isArray(path) ? path[0] : path;   // useLocalSearchParams puede devolver string[]

        if (parentId) {
            router.replace({
                pathname: "/(tabs)/carpeta",
                params: {
                    padreId: parentId,
                    path: rawPath ?? "[]",   
                },
            });
        } else {
            router.replace("/(tabs)/carpeta");
        }
    };

    const viewerUrl = useMemo(() => {
        if (isPdf) {
            return `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(rawUrl)}`;
        }
        if (isOffice) {
            return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(rawUrl)}`;
        }
        return rawUrl;
    }, [rawUrl, isPdf, isOffice]);

    const pdfHtml = "";

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            {/* Header con botón de volver */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingTop: insets.top + 4,
                    paddingBottom: 10,
                    paddingHorizontal: 16,
                    backgroundColor: colors.background,
                    elevation: 4,
                }}
            >
                <TouchableOpacity
                    onPress={handleBack}
                    activeOpacity={0.7}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.background,
                        borderWidth: 1,
                        borderColor: colors.border,
                        shadowOpacity: 0.12,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 2,
                    }}
                >
                    <Ionicons name="arrow-back" size={22} style={{ color: colors.foreground }} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: colors.foreground, fontSize: 16, fontWeight: "700" }}>
                        {typeof nombre === "string" && nombre.length > 0 ? nombre : "Archivo"}
                    </Text>
                </View>
                <View style={{ width: 36 }} />
            </View>

            {/* WebView */}
            <WebView
                source={{ uri: viewerUrl }}
                startInLoadingState
                renderLoading={() => (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: colors.background,
                        }}
                    >
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={{ marginTop: 10, color: colors.mutedForeground }}>
                            Cargando archivo...
                        </Text>
                    </View>
                )}
                style={{ flex: 1, backgroundColor: colors.background }}
                allowsFullscreenVideo
                originWhitelist={["*"]}
                javaScriptEnabled
                domStorageEnabled
                userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
                onHttpError={() => { if (isPdf) setPdfFallback(true); }}
                onError={() => { if (isPdf) setPdfFallback(true); }}
            />
            {isPdf && pdfFallback && (
                <View style={{ padding: 12, backgroundColor: colors.background }}>
                    <Text style={{ color: colors.mutedForeground, marginBottom: 8 }}>
                        No se pudo cargar el visor. Puedes abrir el PDF en el navegador.
                    </Text>
                    <TouchableOpacity
                        onPress={() => Linking.openURL(rawUrl)}
                        style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 12, alignSelf: "flex-start" }}
                    >
                        <Text style={{ color: colors.primaryForeground, fontWeight: "600" }}>Abrir en navegador</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
