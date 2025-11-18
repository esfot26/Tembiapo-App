import React, { useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/contexts/TemaContext";
import { useNotas } from "@/src/features/notas/useNotas";
import { Nota } from "@/src/services/NotasServices";

export default function NotasScreen() {
  const { colors } = useTheme();
  const { notas, cargarNotas, eliminarNota, actualizarNota } = useNotas();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      cargarNotas();
    });

    return unsubscribe;
  }, [navigation, cargarNotas]);

  const handleEdit = (nota: Nota) => {
    router.push({
      pathname: "/(modals)/nota-editor",
      params: { nota: JSON.stringify(nota) }
    });
  };

  const handleDelete = (notaId: string) => {
    Alert.alert(
      "Eliminar Nota",
      "¿Estás seguro de que quieres eliminar esta nota?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => eliminarNota(notaId),
          style: "destructive",
        },
      ]
    );
  };

  const handleToggleCompleted = (nota: Nota) => {
    actualizarNota(nota.id, { completado: !nota.completado });
  };

  const categoriaIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
    Trabajo: "briefcase-outline",
    Personal: "person-outline",
    Estudio: "book-outline",
    Salud: "heart-outline",

  };

  const prioridadIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
    baja: "chevron-down-outline",
    media: "remove-outline",
    alta: "chevron-up-outline",
  };

  const renderItem = ({ item }: { item: Nota }) => (
    <Animated.View
      entering={FadeInUp.duration(200)}
      exiting={FadeOutDown.duration(200)}
      style={{
        backgroundColor: colors.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.muted,
        marginHorizontal: 16,
        marginVertical: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View style={{ flex: 1, paddingRight: 12, paddingLeft: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => handleToggleCompleted(item)}
            activeOpacity={0.8}
            style={{ marginRight: 8 }}
          >
            <Ionicons
              name={item.completado ? "checkmark-circle" : "checkmark-circle-outline"}
              size={22}
              color={item.completado ? colors.primary : colors.mutedForeground}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: item.completado ? colors.mutedForeground : colors.foreground,
              fontSize: 20,
              fontWeight: "bold",
              textDecorationLine: item.completado ? "line-through" : "none",
            }}
          >
            {item.titulo}
          </Text>
        </View>
        <Text
          style={{
            color: item.completado ? colors.mutedForeground : colors.mutedForeground,
            marginTop: 4,
            textDecorationLine: item.completado ? "line-through" : "none",
          }}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {item.descripcion}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.background,
              borderColor: colors.muted,
              borderWidth: 1,
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 14,
              marginRight: 8,
            }}
          >
            <Ionicons
              name={categoriaIcon[item.categoria] || "pricetag-outline"}
              size={16}
              color={colors.primary}
            />
            <Text style={{ color: colors.foreground, marginLeft: 6, fontSize: 12 }}>
              {item.categoria}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.background,
              borderColor: colors.muted,
              borderWidth: 1,
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 14,
              marginRight: 8,
            }}
          >
            <Ionicons
              name={prioridadIcon[item.prioridad] || "options-outline"}
              size={16}
              color={colors.primary}
            />
            <Text style={{ color: colors.foreground, marginLeft: 6, fontSize: 12 }}>
              {item.prioridad}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.background,
              borderColor: colors.muted,
              borderWidth: 1,
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 14,
            }}
          >
            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            <Text style={{ color: colors.foreground, marginLeft: 6, fontSize: 12 }}>
              {item.fechaCreacion.toDate().toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Botones de accion */}

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          activeOpacity={0.8}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.primary,
            marginLeft: 12,
            marginRight: 12,
          }}
        >
          <Ionicons name="pencil-outline" size={20} color={colors.primaryForeground} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          activeOpacity={0.8}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.destructive,
          }}
        >
          <Ionicons name="trash-outline" size={20} color={"#fff"} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: colors.foreground, fontSize: 24, fontWeight: "bold" }}>Notas</Text>
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "/(modals)/nota-editor", params: { nota: JSON.stringify({}) } })
          }
          activeOpacity={0.9}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.primary,
          }}
        >
          <Ionicons name="add" size={22} color={colors.primaryForeground} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 0 }}
        ListEmptyComponent={() => (
          <View className="items-center mt-20 px-4">
            <Ionicons name="document-text-outline" size={48} color={colors.mutedForeground} />
            <Text
              style={{
                color: colors.mutedForeground,
                fontSize: 16,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              No hay notas todavía.
            </Text>
          </View>
        )}
      />


    </View>
  );
}