import React, { useCallback } from "react";
import { Text, View, ActivityIndicator, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { useTheme } from "@/src/contexts/TemaContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "@/src/services/FirebaseConfig";

// Tus módulos
import styles from "./Inicio.styles";
import { MenuItem } from "@/components/ui/menuItem";
import { StatCard } from "@/components/ui/statCard";
import { useInicioData } from "@/src/hooks/useInicioData";

export default function Inicio() {
  const router = useRouter();
  const { colors } = useTheme();

  // Extraemos 'user' también para el fallback del nombre
  const { user, userData, stats, loading, fetchUserData, subscribeToData } = useInicioData();

  useFocusEffect(
    useCallback(() => {
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
    }, [subscribeToData])
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.foreground }]}>Cargando...</Text>
      </View>
    );
  }

  const displayName =
    userData?.nombreCompleto || userData?.username || user?.email?.split("@")[0] || "Usuario";

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