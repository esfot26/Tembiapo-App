import React, { useState, useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { onAuthStateChanged, type User } from "firebase/auth";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/src/services/FirebaseConfig";
import { CalendarioServices } from "@/src/services/CalendarioServices";
import { useTheme } from "@/src/contexts/TemaContext";
import { useRouter } from "expo-router";
import { tr } from "date-fns/locale";
import { SafeAreaView } from "react-native-safe-area-context";


interface UserData {
  email: string;
  username: string;
  nombreCompleto: string;
  apellido: string;
  telefono: string;
  fechaNacimiento: string;
}

interface MenuItemProps {
  iconName: string;
  iconColor: string;
  title: string;
  subtitle: string;
  titleColor?: string;
  subtitleColor?: string;
  onPress: () => void;
  count?: number;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  iconName,
  iconColor,
  title,
  subtitle,
  onPress,
  count,
}) => {
  const { colors, theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="flex-row items-center justify-between rounded-2xl p-4 mb-3 border"
      style={{
        backgroundColor: isDark
          ? "rgba(255,255,255,0.03)"
          : "rgba(0,0,0,0.02)",
        borderColor: colors.border,
        shadowColor: colors.border,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      }}
    >
      {/* 🔹 Icono + texto */}
      <View className="flex-row items-center flex-1">
        <View
          className="w-11 h-11 rounded-xl items-center justify-center mr-3"
          style={{
            backgroundColor: iconColor,
          }}
        >
          <MaterialCommunityIcons
            name={iconName as any}
            size={20}
            color={colors.primaryForeground}
          />
        </View>

        <View className="flex-1">
          <Text
            className="text-base font-semibold mb-0.5"
            style={{ color: colors.foreground }}
          >
            {title}
          </Text>
          <Text
            className="text-sm font-medium opacity-80"
            style={{ color: colors.mutedForeground }}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      {/* 🔸 Contador + icono flecha */}
      <View className="flex-row items-center">
        {count !== undefined && count > 0 && (
          <View
            style={{
              minWidth: 28,
              height: 24,
              paddingHorizontal: 8,
              borderRadius: 12,
              marginRight: 8,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.primary,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                color: colors.primaryForeground,
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              {count}
            </Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
      </View>
    </TouchableOpacity>
  );
};

export const StatCard: React.FC<{ value: number; label: string; color: string }> = ({
  value,
  label,
  color,
}) => {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View
      className="flex-1 rounded-2xl p-4 items-center justify-center border"
      style={{
        backgroundColor: isDark
          ? "rgba(255,255,255,0.04)"
          : "rgba(0,0,0,0.03)",
        borderColor: colors.border,
      }}
    >
      <Text
        className="text-3xl font-extrabold mb-1 tracking-tight"
        style={{ color }}
      >
        {value}
      </Text>
      <Text
        className="text-xs font-semibold uppercase tracking-wide"
        style={{
          color: colors.mutedForeground,

        }}
      >
        {label}
      </Text>
    </View>
  );
};

export default function Inicio() {
  const router = useRouter();

  const { colors, theme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    tareas: 0,
    completadas: 0,
    pendientes: 0,
    eventos: 0,
  });

  /** 🔹 Cargar datos del usuario */
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, "usuarios", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          email: data.email || "",
          username: data.username || "",
          nombreCompleto: data.nombreCompleto || "",
          apellido: data.apellido || "",
          telefono: data.telefono || "",
          fechaNacimiento: data.fechaNacimiento || "",
        });
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    }
  };

  /** 🔹 Cargar estadísticas (notas + eventos) */
  const fetchStats = async (uid: string) => {
    try {
      const notasRef = collection(FIREBASE_DB, "usuarios", uid, "usuario_notas");
      const unsubscribeNotas = onSnapshot(notasRef, (snapshot) => {
        const total = snapshot.size;
        const completadas = snapshot.docs.filter((d) => d.data().completado).length;
        const pendientes = total - completadas;
        setStats((prev) => ({ ...prev, tareas: total, completadas, pendientes }));
      });

      const eventos = await CalendarioServices.verEventos();
      setStats((prev) => ({ ...prev, eventos: eventos.length }));

      return unsubscribeNotas;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  /** 🔐 Cargar datos al iniciar sesión */
  useFocusEffect(
    useCallback(() => {
      let unsubscribeStats: (() => void) | undefined;
      const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, async (u) => {
        setUser(u);
        if (u) {
          await fetchUserData(u.uid);
          unsubscribeStats = await fetchStats(u.uid);
        } else {
          setUserData(null);
          setLoading(false);
        }
      });
      return () => {
        unsubscribeAuth();
        if (unsubscribeStats) unsubscribeStats();
      };
    }, [])
  );

  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-3 text-sm font-medium" style={{ color: colors.foreground }}>
          Cargando...
        </Text>
      </View>
    );
  }

  const displayName =
    userData?.nombreCompleto || userData?.username || user?.email?.split("@")[0] || "Usuario";

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 10 }}
        className="px-5 mt-3"
      >
        {/* 💬 Header */}

        <Text
          className="text-xl font-bold mb-1 mt-2"
          style={{ color: colors.foreground }}
        >
          ¡Hola, <Text className="font-extrabold text-center">{displayName}</Text> 👋
        </Text>
        <Text
          className="text-sm font-medium opacity-90 mt-2"
          style={{ color: colors.foreground }}
        >
          Bienvenido a tu espacio académico
        </Text>


        {/* 📊 Estadísticas */}
        <View className="flex-row justify-between mb-2 gap-2 m-2">
          <StatCard value={stats.tareas} label="Notas" color={colors.chart1} />
          <StatCard value={stats.pendientes} label="Pendientes" color={colors.destructive} />
          <StatCard value={stats.eventos} label="Eventos" color={colors.chart1} />
        </View>

        {/* ⚡ Menú */}
        <View className="mb-8">
          <Text className="text-lg font-bold mb-4 text-foreground"
            style={{ color: colors.primary }}
          >
            Acciones rápidas
          </Text>

          {/* Falta agregar el crud de notas de momento */}


          <MenuItem
            iconName="calendar-month"
            iconColor={colors.chart5}
            title="Calendario"
            subtitle="Tus eventos y recordatorios"
            titleColor={colors.secondaryForeground}
            subtitleColor={colors.secondaryForeground}
            onPress={() => router.push("/calendario")}
            count={stats.eventos}
          />

          <MenuItem
            iconName="folder-outline"
            iconColor={colors.chart5}
            title="Carpetas"
            subtitle="Tus documentos y apuntes"
            titleColor={colors.secondaryForeground}
            subtitleColor={colors.secondaryForeground}
            onPress={() =>
              router.push({
                pathname: "/carpeta",
                params: { padreId: null, path: JSON.stringify([]) },
              })
            }
          />

          <MenuItem
            iconName="file-document-edit-outline"
            iconColor={colors.chart5}
            title="Notas"
            subtitle="Gestiona tus apuntes"
            titleColor={colors.secondaryForeground}
            subtitleColor={colors.secondaryForeground}
            onPress={() => router.push("/notas")}
            count={stats.tareas}
          />


          <MenuItem

            iconName="cog-outline"
            iconColor={colors.chart5}
            title="Configuración"
            titleColor={colors.secondaryForeground}
            subtitle="Configura tu cuenta "
            subtitleColor={colors.secondaryForeground}
            onPress={() => router.push("/(tabs)/configuracion")}
          />
        </View>

        {/* 🕓 Estado rápido */}
        <View
          className="flex-row items-center justify-center py-4 rounded-xl"
          style={{ backgroundColor: colors.border }}
        >
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text
            className="ml-2 text-sm font-medium"
            style={{ color: colors.mutedForeground }}
          >
            {stats.pendientes} notas pendientes y {stats.eventos} eventos activos
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
