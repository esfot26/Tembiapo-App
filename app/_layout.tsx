// import "@/global.css";
// import { Stack, useRouter } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import { View, ActivityIndicator, Alert, Linking, Platform } from "react-native";
// import { ActiveScreenProvider } from "@/src/contexts/ActiveScreenContext";
// import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
// import { ThemeProvider, useTheme } from "@/src/contexts/TemaContext";
// import { NotasProvider } from "@/src/contexts/NotasContext";
// import { PortalHost } from "@rn-primitives/portal";
// import Toast from "react-native-toast-message";
// import * as Notifications from "expo-notifications";
// import { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const useNotificacionesPermiso = (usuarioLogueado: boolean) => {
//   useEffect(() => {
//     if (!usuarioLogueado) return;

//     (async () => {
//       const { status: statusActual } = await Notifications.getPermissionsAsync();

//       if (statusActual === "granted") return;

//       const { status } = await Notifications.requestPermissionsAsync();

//       if (status === "denied") {
//         Alert.alert(
//           "Activar notificaciones",
//           "Para recibir recordatorios de eventos, habilitá las notificaciones en Configuración.",
//           [
//             { text: "Ahora no", style: "cancel" },
//             {
//               text: "Abrir Configuración",
//               onPress: () => Linking.openSettings(),
//             },
//           ]
//         );
//       }

//       if (Platform.OS === "android") {
//         await Notifications.setNotificationChannelAsync("calendar", {
//           name: "Recordatorios de calendario",
//           importance: Notifications.AndroidImportance.HIGH,
//         });
//       }
//     })();
//   }, [usuarioLogueado]);
// };

// function LayoutContent() {
//   const { usuario, loading } = useAuth();
//   const { theme, colors } = useTheme();
//   const router = useRouter();
//   const [flujoInicialCargando, setFlujoInicialCargando] = useState(true);
//   const [rutaDestino, setRutaDestino] = useState<string | null>(null) as any;

//   useNotificacionesPermiso(!!usuario);

//   useEffect(() => {
//     const verificarFlujo = async () => {
//       try {
//         const onboardingDone = await AsyncStorage.getItem("@tembiapo:onboarding_complete");
//         const eulaAceptado = await AsyncStorage.getItem("@tembiapo:eula_aceptado");
//         const modoInvitado = await AsyncStorage.getItem("@tembiapo:modo_invitado");

//         console.log("Flujo:", { onboardingDone, eulaAceptado, modoInvitado, usuario: !!usuario });

//         if (!onboardingDone) {
//           setRutaDestino("/(onboarding)/index");
//           setFlujoInicialCargando(false);
//           return;
//         }

//         if (!eulaAceptado) {
//           setRutaDestino("/(onboarding)/welcome");
//           setFlujoInicialCargando(false);
//           return;
//         }

//         if (modoInvitado === "true") {
//           setRutaDestino("/(tabs)/inicio");
//           setFlujoInicialCargando(false);
//           return;
//         }

//         if (usuario) {
//           setRutaDestino("/(tabs)/inicio");
//         } else {
//           setRutaDestino("/(onboarding)/welcome");  
//         }

//         setFlujoInicialCargando(false);
//       } catch (error) {
//         console.error("Error verificando flujo:", error);
//         setRutaDestino("/(onboarding)/index");
//         setFlujoInicialCargando(false);
//       }
//     };

//     if (!loading) {
//       verificarFlujo();
//     }
//   }, [loading, usuario]);

//   useEffect(() => {
//     if (!flujoInicialCargando && rutaDestino) {
//       router.replace(rutaDestino);
//     }
//   }, [flujoInicialCargando, rutaDestino]);

//   if (loading || flujoInicialCargando) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <>
//       <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
//         <Stack.Screen name="(onboarding)" />
//         <Stack.Screen name="(auth)" />
//         <Stack.Screen name="(tabs)" />
//       </Stack>
//       <StatusBar style={theme === "dark" ? "light" : "dark"} />
//       <PortalHost />
//       <Toast />
//     </>
//   );
// }

// export default function RootLayout() {
//   return (
//     <ThemeProvider>
//       <ActiveScreenProvider>
//         <AuthProvider>
//           <NotasProvider>
//             <LayoutContent />
//           </NotasProvider>
//         </AuthProvider>
//       </ActiveScreenProvider>
//     </ThemeProvider>
//   );
// }

// app/_layout.tsx
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