import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Alert, Linking, Platform } from "react-native";
import { ActiveScreenProvider } from "@/src/contexts/ActiveScreenContext";
import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/src/contexts/TemaContext";
import { NotasProvider } from "@/src/contexts/NotasContext";
import { PortalHost } from "@rn-primitives/portal";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import "../global.css";

// 👇 Hook separado para mantener LayoutContent limpio
const useNotificacionesPermiso = (usuarioLogueado: boolean) => {
  useEffect(() => {
    if (!usuarioLogueado) return;

    (async () => {
      const { status: statusActual } = await Notifications.getPermissionsAsync();

      if (statusActual === "granted") return; // ya tiene permisos, no molestamos

      const { status } = await Notifications.requestPermissionsAsync();

      if (status === "denied") {
        Alert.alert(
          "Activar notificaciones",
          "Para recibir recordatorios de eventos, habilitá las notificaciones en Configuración.",
          [
            { text: "Ahora no", style: "cancel" },
            {
              text: "Abrir Configuración",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }

      // Canal Android
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("calendar", {
          name: "Recordatorios de calendario",
          importance: Notifications.AndroidImportance.HIGH,
        });
      }
    })();
  }, [usuarioLogueado]);
};

function LayoutContent() {
  const { usuario, loading } = useAuth();
  const { theme, colors } = useTheme();

  useNotificacionesPermiso(!!usuario); // 👈 se activa solo cuando hay usuario

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!usuario) {
    return (
      <>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
          <Stack.Screen name="(auth)/login/index" />
          <Stack.Screen name="(auth)/registro/index" />
          <Stack.Screen name="(auth)/verificar-correo/verificarCorreo" />
        </Stack>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
      </>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ActiveScreenProvider>
        <AuthProvider>
          <NotasProvider>
            <LayoutContent />
            <PortalHost />
            <Toast />
          </NotasProvider>
        </AuthProvider>
      </ActiveScreenProvider>
    </ThemeProvider>
  );
}