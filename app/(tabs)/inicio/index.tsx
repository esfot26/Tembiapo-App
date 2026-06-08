import React, { useCallback, useEffect, useState } from "react";
import { Text, View, ActivityIndicator, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { useTheme } from "@/src/contexts/TemaContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "@/src/services/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tus módulos
import styles from "./Inicio.styles";
import { MenuItem } from "@/components/ui/menuItem";
import { StatCard } from "@/components/ui/statCard";
import { useInicioData } from "@/src/hooks/useInicioData";

export default function Inicio() {
  const router = useRouter();
  const { colors } = useTheme();
  const [modoInvitado, setModoInvitado] = useState(false);
  const [verificandoModo, setVerificandoModo] = useState(true);


  const { user, userData, stats, loading, fetchUserData, subscribeToData } = useInicioData();

  useEffect(() => {
    const verificarModo = async () => {
      const invitado = await AsyncStorage.getItem("@tembiapo:modo_invitado");
      const usuarioActual = FIREBASE_AUTH.currentUser;

      // Si hay usuario logueado, no debe ser modo invitado
      if (usuarioActual && invitado === "true") {
        // Limpiar modo invitado si hay usuario logueado
        await AsyncStorage.removeItem("@tembiapo:modo_invitado");
        setModoInvitado(false);
      } else {
        setModoInvitado(invitado === "true");
      }

      setVerificandoModo(false);
    };

    verificarModo();

    // Escuchar cambios en la autenticación
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        // Si hay usuario, asegurarse de que modo invitado esté desactivado
        await AsyncStorage.removeItem("@tembiapo:modo_invitado");
        setModoInvitado(false);
      } else {
        // Verificar modo invitado solo si no hay usuario
        const invitado = await AsyncStorage.getItem("@tembiapo:modo_invitado");
        setModoInvitado(invitado === "true");
      }
    });

    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Si es modo invitado, no hacer nada de Firebase
      if (modoInvitado) {
        return;
      }

      let unsubscribe: (() => void) | undefined;

      const authUnsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (currentUser) => {
        if (currentUser) {
          await fetchUserData(currentUser.uid);
          unsubscribe = subscribeToData(currentUser.uid);
        }
      });

      return () => {
        authUnsubscribe();
        if (unsubscribe) unsubscribe();
      };
    }, [subscribeToData, modoInvitado])
  );

  // Mostrar loading solo si no es invitado y está cargando datos
  if (verificandoModo) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.foreground }]}>Verificando...</Text>
      </View>
    );
  }
  // Si es modo invitado, no esperar loading de Firebase
  if (modoInvitado) {
    const displayName = "Invitado";
    const displayStats = { tareas: 0, pendientes: 0, eventos: 0 };

    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.container}
        >
          <Text style={[styles.welcomeTitle, { color: colors.foreground }]}>
            ¡Hola, <Text style={styles.boldText}>{displayName}</Text> 👋
          </Text>

          <Text style={[styles.welcomeSubtitle, { color: colors.foreground }]}>
            Estás en modo explorador
          </Text>

          {/* Banner de modo invitado */}
          <View style={[styles.invitadoBanner, { backgroundColor: colors.card + "20", borderColor: colors.primary }]}>
            <Ionicons name="alert-circle-outline" size={24} color={colors.primary} />
            <Text style={[styles.invitadoTexto, { color: colors.secondaryForeground }]}>
              Modo invitado: Los datos no se guardarán al cerrar la app. Inicia sesión para guardar tu progreso.
            </Text>
          </View>

          <View style={styles.statsRow}>
            <StatCard value={displayStats.tareas} label="Notas" color={colors.chart1} />
            <StatCard value={displayStats.pendientes} label="Pendientes" color={colors.destructive} />
            <StatCard value={displayStats.eventos} label="Eventos" color={colors.chart5} />
          </View>

          <View style={styles.menuSection}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Acciones rápidas</Text>

            <MenuItem
              iconName="calendar-month"
              iconColor={colors.chart5}
              title="Calendario"
              subtitle="Tus eventos y recordatorios"
              onPress={() => router.push("/calendario")}
              count={displayStats.eventos}
            />

            <MenuItem
              iconName="folder-outline"
              iconColor={colors.chart5}
              title="Carpetas"
              subtitle="Tus documentos y apuntes"
              onPress={() => router.push({ pathname: "/carpeta", params: { padreId: null } })}
            />

            <MenuItem
              iconName="file-document-edit-outline"
              iconColor={colors.chart5}
              title="Notas"
              subtitle="Gestiona tus apuntes"
              onPress={() => router.push("/notas")}
              count={displayStats.tareas}
            />

            <MenuItem
              iconName="cog-outline"
              iconColor={colors.chart5}
              title="Configuración"
              subtitle="Configura tu cuenta"
              onPress={() => router.push("/(tabs)/configuracion")}
            />
          </View>

          <View style={[styles.statusBanner, { backgroundColor: colors.border }]}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={[styles.statusText, { color: colors.mutedForeground }]}>
              Modo invitado  - Inicia sesión para guardar tus datos
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.foreground }]}>Cargando tus datos...</Text>
      </View>
    );
  }

  const displayName = userData?.nombreCompleto || userData?.username || user?.email?.split("@")[0] || "Usuario";

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.container}
      >
        <Text style={[styles.welcomeTitle, { color: colors.foreground }]}>
          ¡Hola, <Text style={styles.boldText}>{displayName}</Text> 👋
        </Text>

        <Text style={[styles.welcomeSubtitle, { color: colors.foreground }]}>
          Bienvenido a tu espacio académico
        </Text>

        <View style={styles.statsRow}>
          <StatCard value={stats.tareas} label="Notas" color={colors.chart1} />
          <StatCard value={stats.pendientes} label="Pendientes" color={colors.destructive} />
          <StatCard value={stats.eventos} label="Eventos" color={colors.chart5} />
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Acciones rápidas</Text>

          <MenuItem
            iconName="calendar-month"
            iconColor={colors.chart5}
            title="Calendario"
            subtitle="Tus eventos y recordatorios"
            onPress={() => router.push("/calendario")}
            count={stats.eventos}
          />

          <MenuItem
            iconName="folder-outline"
            iconColor={colors.chart5}
            title="Carpetas"
            subtitle="Tus documentos y apuntes"
            onPress={() => router.push({ pathname: "/carpeta", params: { padreId: null } })}
          />

          <MenuItem
            iconName="file-document-edit-outline"
            iconColor={colors.chart5}
            title="Notas"
            subtitle="Gestiona tus apuntes"
            onPress={() => router.push("/notas")}
            count={stats.tareas}
          />

          <MenuItem
            iconName="cog-outline"
            iconColor={colors.chart5}
            title="Configuración"
            subtitle="Configura tu cuenta"
            onPress={() => router.push("/(tabs)/configuracion")}
          />
        </View>

        <View style={[styles.statusBanner, { backgroundColor: colors.border }]}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text style={[styles.statusText, { color: colors.mutedForeground }]}>
            {stats.pendientes} pendientes y {stats.eventos} eventos activos
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}