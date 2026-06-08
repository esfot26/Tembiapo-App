import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "@/src/contexts/TemaContext";
import { useConfiguracion } from "./hooks/useConfiguracion";
import { ConfiguracionInvitado } from "./components/VistaInvitado";
import { ConfiguracionHeader } from "./components/HeaderConfiguracion";
import { ConfiguracionOpciones } from "./components/ConfguracionOpciones";

export default function ConfiguracionScreen() {
    const { colors, theme } = useTheme();
    const {
        cargando, modoInvitado,
        nombreMostrar, emailMostrar, perfilParaEditar,
        handleLogout, handleSalirModoInvitado
    } = useConfiguracion();

    if (cargando) {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (modoInvitado) {
        return <ConfiguracionInvitado onSalir={handleSalirModoInvitado} />;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{
                title: "Configuración",
                headerStyle: { backgroundColor: colors.card },
                headerShadowVisible: false,
                headerTitleStyle: { color: colors.foreground },
            }} />

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}>

                <ConfiguracionHeader
                    nombre={nombreMostrar}
                    email={emailMostrar}
                    colors={colors}
                />

                <ConfiguracionOpciones
                    perfilParaEditar={perfilParaEditar}
                    onLogout={handleLogout}
                    colors={colors}
                />

                <Text style={[styles.version, { color: colors.mutedForeground }]}>
                    Versión 1.0.1
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    version: { textAlign: "center", marginTop: 50, marginBottom: 50 },
});