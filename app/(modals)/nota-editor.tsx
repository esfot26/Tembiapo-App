import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/src/contexts/TemaContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { Nota, Prioridad } from "@/src/services/NotasServices";
import { useNotas } from "@/src/contexts/NotasContext";
import { renderCategoriaSelector } from "@/src/features/notas/components/renderCategoria";
import { renderPrioridadSelector } from "@/src/features/notas/components/renderPrioridad";
import { styles } from "@/src/features/notas/styles/nota.editor.styles";
export default function ModalScreen() {
  const { colors } = useTheme();
  const { isGuest } = useAuth();
  const { crearNota, actualizarNota } = useNotas();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Estados de los campos
  const [notaId, setNotaId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  // Corrección 1: Inicializamos con una categoría por defecto válida
  const [categoria, setCategoria] = useState("Estudio");
  const [prioridad, setPrioridad] = useState<Prioridad>("baja");

  // Estado para validación visual
  const [errorTitulo, setErrorTitulo] = useState<string | null>(null);
  const [errorDescripcion, setErrorDescripcion] = useState<string | null>(null);
  // Determinamos si es edición basándonos puramente en la existencia del id capturado
  const isEdit = !!notaId;

  // Corrección 2: Un solo punto de entrada seguro para parsear el parámetro
  useEffect(() => {
    if (params.nota) {
      try {
        const notaParseada = JSON.parse(params.nota as string) as Nota;
        if (notaParseada && notaParseada.id) {
          setNotaId(notaParseada.id);
          setTitulo(notaParseada.titulo || "");
          setDescripcion(notaParseada.descripcion || "");
          setCategoria(notaParseada.categoria || "Estudio");
          setPrioridad(notaParseada.prioridad || "baja");
        }
      } catch (error) {
        console.error("Error parseando la nota en el editor:", error);
      }
    } else {
      setNotaId(null);
      setTitulo("");
      setDescripcion("");
      setCategoria("Estudio");
      setPrioridad("baja");
      setErrorTitulo(null);
      setErrorDescripcion(null);
    }
  }, [params.nota]);

  // Corrección 3: Control de validaciones antes del envío a Firebase
  const handleSave = async () => {
    if (!titulo.trim()) {
      setErrorTitulo("El título es obligatorio para guardar la nota.");
      return;
    }

    if (!descripcion.trim()) {
      setErrorDescripcion("La descripción es obligatoria para guardar la nota.");
      return;
    }

    const notaData = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      categoria,
      prioridad
    };

    try {
      if (isEdit && notaId) {
        await actualizarNota(notaId, notaData);
      } else {
        await crearNota(notaData);
      }
      router.replace("/(tabs)/notas");
    } catch (error) {
      console.error("Error al procesar la nota:", error);
    }
  };


  const handleBack = () => {

    setNotaId(null);
    setTitulo("");
    setDescripcion("");
    setCategoria("Estudio");
    setPrioridad("baja");
    setErrorTitulo(null);
    setErrorDescripcion(null);


    router.replace("/(tabs)/notas");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderColor: colors.border,
          paddingTop: insets.top + 4,
          paddingBottom: 12,

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
          }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: colors.foreground, fontSize: 18, fontWeight: "700" }}>
            {isEdit ? "Editar Nota" : "Crear Nota"}
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Aviso de modo invitado */}
        {isGuest && (
          <View style={{
            backgroundColor: "#fef3c7",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            alignItems: "center",
            gap: 12,
          }}>
            <Ionicons name="lock-closed" size={32} color="#d97706" />
            <Text style={{ fontSize: 14, color: "#d97706", fontWeight: "600", textAlign: "center" }}>
              Modo Invitado
            </Text>
            <Text style={{ fontSize: 13, color: "#b45309", textAlign: "center" }}>
              Para crear notas, debes iniciar sesión con tu cuenta.
            </Text>
          </View>
        )}

        {/* Formulario - solo mostrar si no es invitado */}
        {!isGuest ? (
          <>
        {/* --- TITULO --- */}
        <Text style={[styles.label, { color: colors.foreground }]}>Título *</Text>
        <TextInput
          value={titulo}
          onChangeText={(text) => {
            setTitulo(text);
            if (errorTitulo) setErrorTitulo(null); // Limpieza reactiva del error
          }}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.foreground,
              // El borde cambia dinámicamente si hay error
              borderColor: errorTitulo ? colors.destructive : colors.border,
            },
          ]}
          placeholder="Título de la nota"
          placeholderTextColor={colors.mutedForeground}
        />
        {/* Texto del error sutil abajo del input */}
        {errorTitulo && (
          <Text style={[styles.errorTexto, { color: colors.destructive }]}>
            {errorTitulo}
          </Text>
        )}

        {/* --- DESCRIPCION --- */}
        <Text style={[styles.label, { color: colors.foreground }]}>Descripción *</Text>
        <TextInput
          value={descripcion}
          onChangeText={(text) => {
            setDescripcion(text);
            if (errorDescripcion) setErrorDescripcion(null); // Limpieza reactiva al escribir
          }}
          style={[
            styles.input,
            styles.multilineInput,
            {
              backgroundColor: colors.card,
              color: colors.foreground,
              borderColor: errorDescripcion ? colors.destructive : colors.border,
            },
          ]}
          placeholder="Descripción..."
          placeholderTextColor={colors.mutedForeground}
          multiline
        />
        {errorDescripcion && (
          <Text style={[styles.errorTexto, { color: colors.destructive, marginBottom: 8 }]}>
            {errorDescripcion}
          </Text>
        )}

        {/* --- CATEGORIA --- */}
        <Text style={[styles.label, { color: colors.foreground }]}>Categoría</Text>
        {renderCategoriaSelector({ categoria, setCategoria })}

        {/* --- PRIORIDAD --- */}
        <Text style={[styles.label, { color: colors.foreground }]}>Prioridad</Text>
        {renderPrioridadSelector({ prioridad, setPrioridad })}

        {/* --- BOTONES --- */}
        <View style={{ marginTop: 28, flexDirection: "row", gap: 12 }}>
          {/* GUARDAR */}
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.9}
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="save-outline" size={22} color="white" />
            <Text style={styles.actionText}>Guardar</Text>
          </TouchableOpacity>

          {/* CANCELAR */}
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.8}
            style={[styles.actionButton, { backgroundColor: colors.destructive }]}
          >
            <Ionicons name="close-circle-outline" size={22} color="white" />
            <Text style={styles.actionText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
          </>
        ) : (
          // Solo botón cancelar en modo invitado
          <View style={{ marginTop: 28 }}>
            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.8}
              style={[styles.actionButton, { backgroundColor: colors.destructive, width: "100%" }]}
            >
              <Ionicons name="close-circle-outline" size={22} color="white" />
              <Text style={styles.actionText}>Volver</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

