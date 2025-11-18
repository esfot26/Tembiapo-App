import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useTheme } from "@/src/contexts/TemaContext";
import { Nota, Prioridad } from "@/src/services/NotasServices";
import { useNotas } from "@/src/features/notas/useNotas";


export default function NotaEditorModal() {
  const { colors } = useTheme();
  const { crearNota, actualizarNota } = useNotas();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [nota, setNota] = useState<Partial<Nota> | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [prioridad, setPrioridad] = useState<Prioridad>("baja");

  useEffect(() => {
    if (params.nota) {
      const notaParseada = JSON.parse(params.nota as string) as Nota;
      setNota(notaParseada);
      setTitulo(notaParseada.titulo);
      setDescripcion(notaParseada.descripcion);
      setCategoria(notaParseada.categoria);
      setPrioridad(notaParseada.prioridad);
    }
    const isEdit = (() => {
      try {
        const n = params.nota ? (JSON.parse(params.nota as string) as Partial<Nota>) : null;
        return !!(n && n.id);
      } catch {
        return false;
      }
    })();
    (navigation as any).setOptions({ headerTitle: isEdit ? "Editar Nota" : "Nueva Nota" });
  }, [params.nota]);

  const handleSave = async () => {
    const notaData = { titulo, descripcion, categoria, prioridad };
    if (nota && nota.id) {
      await actualizarNota(nota.id, notaData);
    } else {
      await crearNota(notaData);
    }
    router.back();

  };

  const categorias: { key: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: "Trabajo", icon: "briefcase-outline" },
    { key: "Personal", icon: "person-outline" },
    { key: "Estudio", icon: "book-outline" },
    { key: "Salud", icon: "heart-outline" },
  ];

  const renderCategoriaSelector = () => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {categorias.map((c) => {
          const active = categoria === c.key;
          return (
            <TouchableOpacity
              key={c.key}
              onPress={() => setCategoria(c.key)}
              style={[
                styles.selectorItem,
                {
                  backgroundColor: active ? colors.primary : colors.card,
                  borderColor: active ? colors.foreground : colors.foreground,
                },
              ]}
            >
              <Ionicons
                name={c.icon}
                size={20}
                color={active ? "white" : colors.foreground}
              />
              <Text
                style={{
                  marginTop: 6,
                  color: active ? "white" : colors.foreground,
                  fontWeight: active ? "700" : "500",
                }}
              >
                {c.key}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderPrioridadSelector = () => {
    const prioridades: { key: Prioridad; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
      { key: "baja", icon: "chevron-down-outline", label: "Baja" },
      { key: "media", icon: "remove-outline", label: "Media" },
      { key: "alta", icon: "chevron-up-outline", label: "Alta" },
    ];
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {prioridades.map((p) => {
          const active = prioridad === p.key;
          return (
            <TouchableOpacity
              key={p.key}
              onPress={() => setPrioridad(p.key)}
              style={[
                styles.selectorItem,
                {
                  backgroundColor: active ? colors.foreground : colors.card,
                  borderColor: active ? colors.foreground : colors.foreground,
                },
              ]}
            >
              <Ionicons
                name={p.icon}
                size={20}
                color={active ? "white" : colors.foreground}
              />
              <Text
                style={{
                  marginTop: 6,
                  color: active ? "white" : colors.foreground,
                  fontWeight: active ? "700" : "500",
                }}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* --- TITULO --- */}
      <Text style={[styles.label, { color: colors.foreground }]}>Título</Text>
      <TextInput
        value={titulo}
        onChangeText={setTitulo}
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.foreground,
            borderColor: colors.border,
          },
        ]}
        placeholder="Título de la nota"
        placeholderTextColor={colors.mutedForeground}
      />

      {/* --- DESCRIPCION --- */}
      <Text style={[styles.label, { color: colors.foreground }]}>Descripción</Text>
      <TextInput
        value={descripcion}
        onChangeText={setDescripcion}
        style={[
          styles.input,
          styles.multilineInput,
          {
            backgroundColor: colors.card,
            color: colors.foreground,
            borderColor: colors.border,
          },
        ]}
        placeholder="Descripción..."
        placeholderTextColor={colors.mutedForeground}
        multiline
      />

      {/* --- CATEGORIA --- */}
      <Text style={[styles.label, { color: colors.foreground }]}>Categoría</Text>
      {renderCategoriaSelector()}

      {/* --- PRIORIDAD --- */}
      <Text style={[styles.label, { color: colors.foreground }]}>Prioridad</Text>
      {renderPrioridadSelector()}

      {/* --- BOTONES --- */}
      <View
        style={{
          marginTop: 28,
          flexDirection: "row",
          gap: 12,
        }}
      >
        {/* GUARDAR */}
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.9}
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
            },
          ]}
        >
          <Ionicons name="save-outline" size={22} color="white" />
          <Text style={styles.actionText}>Guardar</Text>
        </TouchableOpacity>

        {/* CANCELAR */}
        <TouchableOpacity
          onPress={() => router.back()}
          //activeOpacity={0.9}
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.destructive,
              shadowColor: colors.destructive,
            },
          ]}
        >
          <Ionicons name="close-circle-outline" size={22} color="white" />
          <Text style={styles.actionText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  selectorItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
    borderWidth: 1,
  },
  saveButton: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 8,
  },
  multilineInput: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  actionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});