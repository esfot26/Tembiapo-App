import React, { useEffect, useRef, useState, useCallback } from "react";
import { Text, View, TouchableOpacity, Alert, RefreshControl, TextInput } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/contexts/TemaContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { useNotas } from "@/src/contexts/NotasContext";
import { Nota } from "@/src/services/NotasServices";
import { NotaListSkeleton } from "@/components/ui/skeleton";
import { getStyles } from "./notas.styles";
import { NotaItem } from "./components/notaItem";
import { EstadoVacio } from "./components/notasVacias";


export default function NotasScreen() {
  const { colors } = useTheme();
  const { isGuest } = useAuth();
  const styles = getStyles(colors);
  const { notas, loading, cargarNotas, eliminarNota, actualizarNota } = useNotas();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const didLoadRef = useRef(false);
  const alertShownRef = useRef(false);

  useEffect(() => {
    // Si es invitado, mostrar alerta una sola vez
    if (isGuest && !alertShownRef.current) {
      alertShownRef.current = true;
      Alert.alert(
        "Acceso Limitado",
        "Para acceder a tus notas, debes iniciar sesión.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    // Solo cargar notas si no es invitado
    if (!isGuest && !didLoadRef.current) {
      didLoadRef.current = true;
      cargarNotas();
    }
  }, [isGuest, cargarNotas]);

  const handleRefresh = async () => {
    if (isGuest) return;
    setRefreshing(true);
    await cargarNotas();
    setRefreshing(false);
  };

  // Usamos useCallback para pasar funciones a componentes hijos (NotaItem)
  const handleDelete = useCallback((notaId: string) => {
    Alert.alert(
      "Eliminar Nota",
      "¿Estás seguro de que quieres eliminar esta nota?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => eliminarNota(notaId), style: "destructive" },
      ]
    );
  }, [eliminarNota]);

  const handleToggleCompleted = useCallback((nota: Nota) => {
    actualizarNota(nota.id, { completado: !nota.completado });
  }, [actualizarNota]);


  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTop}>
          <Text style={styles.titulo}>Notas</Text>
          <TouchableOpacity style={[styles.botonAgregar, { opacity: isGuest ? 0.5 : 1 }]}
            onPress={() => {
              if (isGuest) {
                Alert.alert("Modo Invitado", "Para crear notas, debes iniciar sesión.");
                return;
              }
              router.push({ pathname: "/(tabs)/notas/crear", params: { nota: JSON.stringify({}) } });
            }}
            disabled={isGuest}
            activeOpacity={0.9}>
            <Ionicons name="add" size={22} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENIDO */}
      {isGuest ? (
        // Mensaje para invitados
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
          <Ionicons name="lock-closed" size={64} color={colors.mutedForeground} />
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginTop: 16, textAlign: "center" }}>
            Acceso Limitado
          </Text>
          <Text style={{ fontSize: 14, color: colors.mutedForeground, marginTop: 8, textAlign: "center", lineHeight: 20 }}>
            Para acceder a tus notas, debes iniciar sesión con tu cuenta.
          </Text>
        </View>
      ) : loading && notas.length === 0 ? (
        <NotaListSkeleton count={4} />
      ) : (
        <FlashList
          data={notas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 0 }}
          renderItem={({ item }) => (
            <NotaItem
              item={item}
              onToggleCompleted={handleToggleCompleted}
              onDelete={handleDelete}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={<EstadoVacio colors={colors} />}
        />
      )}
    </View>
  );
}
