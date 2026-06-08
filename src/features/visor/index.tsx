import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useMemo } from "react";
import { View, TouchableOpacity, Linking, ActivityIndicator, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { styles } from "./styles/visor.styles";
import { useTheme } from "@/src/contexts/TemaContext";
import { getFileCategory } from "./components/categorioArchivo";
import { buildPdfViewerHtml } from "./pdfVisor";

export default function VisorArchivoScreen() {
  const { url, nombre, padreId, path, mimeType } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const rawUrl = String(url ?? "");
  const category = getFileCategory(rawUrl, String(mimeType ?? ""));
  const [failed, setFailed] = useState(false);

  const handleBack = () => {
    const parentId = Array.isArray(padreId) ? padreId[0] : padreId;
    const rawPath = Array.isArray(path) ? path[0] : path;
    if (parentId) {
      router.replace({ pathname: "/(tabs)/carpeta", params: { padreId: parentId, path: rawPath ?? "[]" } });
    } else {
      router.replace("/(tabs)/carpeta");
    }
  };

  const webViewSource = useMemo(() => {
    if (category === "pdf") {
      return { html: buildPdfViewerHtml(rawUrl), baseUrl: "" };
    }
    if (category === "office") {
      return { uri: `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(rawUrl)}` };
    }
    return { uri: rawUrl };
  }, [rawUrl, category]);

  const displayName = typeof nombre === "string" && nombre.length > 0 ? nombre : "Archivo";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 4, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={[styles.backBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={22} style={{ color: colors.foreground }} />
        </TouchableOpacity>
        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.title, { color: colors.foreground }]}>
          {displayName}
        </Text>
        {/* Botón abrir en navegador (siempre disponible) */}
        <TouchableOpacity onPress={() => Linking.openURL(rawUrl)} activeOpacity={0.7} style={[styles.backBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="open-outline" size={20} style={{ color: colors.foreground }} />
        </TouchableOpacity>
      </View>

      {/* Archivo no soportado */}
      {category === "unsupported" ? (
        <View style={[styles.unsupported, { backgroundColor: colors.background }]}>
          <Ionicons name="document-outline" size={64} color={colors.mutedForeground} />
          <Text style={[styles.unsupportedTitle, { color: colors.foreground }]}>
            Vista previa no disponible
          </Text>
          <Text style={[styles.unsupportedSub, { color: colors.mutedForeground }]}>
            Este tipo de archivo no puede previsualizarse.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(rawUrl)}
            style={[styles.openBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={{ color: colors.primaryForeground, fontWeight: "600" }}>Abrir en navegador</Text>
          </TouchableOpacity>
        </View>
      ) : failed ? (
        /* Fallback de error — reemplaza al WebView */
        <View style={[styles.unsupported, { backgroundColor: colors.background }]}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.mutedForeground} />
          <Text style={[styles.unsupportedTitle, { color: colors.foreground }]}>No se pudo cargar</Text>
          <Text style={[styles.unsupportedSub, { color: colors.mutedForeground }]}>
            Hubo un problema al mostrar el archivo.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(rawUrl)}
            style={[styles.openBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={{ color: colors.primaryForeground, fontWeight: "600" }}>Abrir en navegador</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFailed(false)} style={{ marginTop: 12 }}>
            <Text style={{ color: colors.mutedForeground }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          source={webViewSource}
          startInLoadingState
          renderLoading={() => (
            <View style={[styles.loading, { backgroundColor: colors.background }]}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: 10, color: colors.mutedForeground }}>Cargando archivo...</Text>
            </View>
          )}
          style={{ flex: 1, backgroundColor: colors.background }}
          allowsFullscreenVideo
          originWhitelist={["*"]}
          javaScriptEnabled
          domStorageEnabled
          userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
          onHttpError={() => setFailed(true)}
          onError={() => setFailed(true)}
          onMessage={(e) => { if (e.nativeEvent.data === "PDF_ERROR") setFailed(true); }}
        />
      )}
    </View>
  );
}