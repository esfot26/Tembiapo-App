import React, { useEffect, useRef, useState, useCallback } from "react";
import { Text, View, TouchableOpacity, Alert, RefreshControl, TextInput } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/contexts/TemaContext";
import { useNotas } from "@/src/contexts/NotasContext";
import { Nota } from "@/src/services/NotasServices";
import { NotaListSkeleton } from "@/components/ui/skeleton";
import { getStyles } from "./notas.styles";
import { NotaItem } from "./components/notaItem";
import { EstadoVacio } from "./components/notasVacias";


export default function NotasScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { notas, loading, cargarNotas, eliminarNota, actualizarNota } = useNotas();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const didLoadRef = useRef(false);

  useEffect(() => {
    if (!didLoadRef.current) {
      didLoadRef.current = true;
      cargarNotas();
    }
  }, [cargarNotas]);

  const handleRefresh = async () => {
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
          <TouchableOpacity style={styles.botonAgregar}
            onPress={() => router.push({ pathname: "/(tabs)/notas/crear", params: { nota: JSON.stringify({}) } })}
            activeOpacity={0.9}>
            <Ionicons name="add" size={22} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENIDO */}
      {loading && notas.length === 0 ? (
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
