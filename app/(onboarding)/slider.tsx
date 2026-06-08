import { useState } from "react";
import {
    View, Text, Pressable, StyleSheet, Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useTheme } from "@/src/contexts/TemaContext";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const SLIDES = [
    {
        emoji: "📚",
        titulo: "Organizá tus materias",
        descripcion:
            "Creá carpetas por asignatura y mantené tus apuntes siempre ordenados y accesibles.",
    },
    {
        emoji: "📝",
        titulo: "Notas inteligentes",
        descripcion:
            "Escribí, editá y organizá notas con formato enriquecido desde cualquier dispositivo.",
    },
    {
        emoji: "🗓️",
        titulo: "Eventos y recordatorios",
        descripcion:
            "Registrá exámenes y entregas. Recibí notificaciones para nunca perderte una fecha.",
    },
    {
        emoji: "☁️",
        titulo: "Todo en la nube",
        descripcion:
            "Tus datos están seguros en Firebase y disponibles en todos tus dispositivos.",
    },
];

export default function OnboardingScreen() {
    const [actual, setActual] = useState(0);
    const { colors } = useTheme();
    const esUltimo = actual === SLIDES.length - 1;

const siguiente = async () => {
    if (esUltimo) {
        await AsyncStorage.setItem("@tembiapo:onboarding_complete", "true");
        router.replace("/(onboarding)/welcome"); // ← Cambiar de eula a welcome
    } else {
        setActual((a) => a + 1);
    }
};

const saltar = async () => {
    await AsyncStorage.setItem("@tembiapo:onboarding_complete", "true");
    router.replace("/(onboarding)/welcome"); // ← También cambiar aquí
};

    return (
        <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
            {/* Botón saltar */}
            {!esUltimo && (
                <Pressable style={s.saltar} onPress={saltar}>
                    <Text style={[s.saltarTexto, { color: colors.primary }]}>Saltar</Text>
                </Pressable>
            )}

            {/* Slide */}
            <View style={s.slide}>
                <Text style={s.emoji}>{SLIDES[actual].emoji}</Text>
                <Text style={[s.titulo, { color: colors.foreground }]}>{SLIDES[actual].titulo}</Text>
                <Text style={[s.descripcion, { color: colors.foreground }]}>{SLIDES[actual].descripcion}</Text>
            </View>

            {/* Indicador de progreso */}
            <View style={s.dots}>
                {SLIDES.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            s.dot,
                            { backgroundColor: i === actual ? colors.primary : colors.border },
                            i === actual && s.dotActivo,
                        ]}
                    />
                ))}
            </View>

            {/* Botón principal */}
            <Pressable
                style={[s.boton, { backgroundColor: colors.primary }]}
                onPress={siguiente}
            >
                <Text style={s.botonTexto}>{esUltimo ? "Continuar" : "Siguiente"}</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 28 },
    saltar: { alignSelf: "flex-end", paddingTop: 16, paddingBottom: 8 },
    saltarTexto: { fontSize: 18 },
    slide: { flex: 1, justifyContent: "center", alignItems: "center", gap: 20 },
    emoji: { fontSize: 72 },
    titulo: { fontSize: 26, fontWeight: "700", textAlign: "center" },
    descripcion: { fontSize: 16, textAlign: "center", lineHeight: 24, paddingHorizontal: 8 },
    dots: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 32 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    dotActivo: { width: 24 }, // se expande el activo
    boton: { paddingVertical: 16, borderRadius: 14, alignItems: "center", marginBottom: 40 },
    botonTexto: { color: "#fff", fontSize: 17, fontWeight: "600" },
});