import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { ActiveScreenProvider } from "@/src/contexts/ActiveScreenContext";
import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/src/contexts/TemaContext";
import { NotasProvider } from "@/src/contexts/NotasContext";
import { PortalHost } from "@rn-primitives/portal";
import Toast from "react-native-toast-message";


if (!__DEV__) {
  const defaultHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error("Error global capturado:", error, "Fatal:", isFatal);
    defaultHandler(error, isFatal);
  });
}

function RootLayoutContent() {
  const { loading } = useAuth();
  const { colors, theme } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <PortalHost />
      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ActiveScreenProvider>
        <AuthProvider>
          <NotasProvider>
            <RootLayoutContent />
          </NotasProvider>
        </AuthProvider>
      </ActiveScreenProvider>
    </ThemeProvider>
  );
}