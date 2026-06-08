// app/(onboarding)/eula.tsx
import { useState } from "react";
import {
    View, Text, ScrollView, Pressable, Switch,
    StyleSheet, NativeScrollEvent, NativeSyntheticEvent,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { router } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTheme } from "@/src/contexts/TemaContext";
import { FIREBASE_DB } from "@/src/services/FirebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EULAScreen() {
    const [aceptado, setAceptado] = useState(false);
    const [llegóAlFinal, setLlegóAlFinal] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const { usuario } = useAuth();
    const { colors } = useTheme();

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
        const esElFinal = layoutMeasurement.height + contentOffset.y >= contentSize.height - 32;
        if (esElFinal) setLlegóAlFinal(true);
    };

    const aceptarEULA = async () => {
        if (!aceptado || guardando) return;
        setGuardando(true);

        try {
            const ahora = new Date().toISOString();

            // Guardar localmente
            await AsyncStorage.setItem("@tembiapo:eula_aceptado", "true");
            await AsyncStorage.setItem("@tembiapo:eula_fecha", ahora);
            await AsyncStorage.setItem("@tembiapo:eula_version", "1.0.0");

            // Si hay usuario autenticado, guardar en Firestore
            if (usuario) {
                await setDoc(
                    doc(FIREBASE_DB, "usuarios", usuario.uid, "legal", "eula"),
                    {
                        aceptado: true,
                        aceptadoEn: serverTimestamp(),
                        version: "1.0.0",
                        plataforma: "mobile",
                    }
                );
            }

            router.replace("/(auth)/login");

        } catch (err) {
            console.error("Error al guardar EULA:", err);
        } finally {
            setGuardando(false);
        }
    };

    const puedeAceptar = llegóAlFinal && aceptado;

    return (
        <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
            <Text style={[s.titulo, { color: colors.foreground }]}>Términos y condiciones</Text>
            <Text style={[s.subtitulo, { color: colors.foreground }]}>
                Leé el documento completo antes de continuar.
            </Text>

            <ScrollView
                style={[s.scroll, { borderColor: colors.border }]}
                contentContainerStyle={s.scrollContent}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator
            >
                <SeccionEULA titulo="1. Acuerdo de licencia (EULA)">
                    Tembiapo App es una aplicación educativa desarrollada para estudiantes.
                    Al usar esta app, aceptás este Acuerdo de Licencia de Usuario Final (EULA)
                    en su totalidad. Si no estás de acuerdo, no podés usar la aplicación.
                </SeccionEULA>

                <SeccionEULA titulo="2. Política de privacidad">
                    Recopilamos únicamente la información necesaria para el funcionamiento
                    de la app: correo electrónico, nombre de perfil y contenido que vos mismo
                    creás (notas, carpetas, eventos). No compartimos tus datos con terceros
                    con fines publicitarios ni comerciales.
                </SeccionEULA>

                <SeccionEULA titulo="3. Uso de Firebase">
                    Utilizamos Firebase (Google LLC) para autenticación, base de datos en
                    tiempo real (Firestore) y almacenamiento de archivos. Tus datos se
                    almacenan en servidores de Google sujetos a la política de privacidad de
                    Firebase.
                </SeccionEULA>

                <SeccionEULA titulo="4. Google Authentication">
                    Podés iniciar sesión con tu cuenta de Google. En ese caso, Google
                    comparte con nosotros únicamente tu nombre, correo electrónico y foto de
                    perfil. No tenemos acceso a tu contraseña de Google.
                </SeccionEULA>

                <SeccionEULA titulo="5. Responsabilidad sobre el contenido">
                    Sos responsable de todo el contenido que subas o crees en la app.
                    No subas contenido ilegal, ofensivo ni que viole derechos de terceros.
                </SeccionEULA>

                <SeccionEULA titulo="6. Protección de datos">
                    Cumplimos con las normativas de protección de datos aplicables. Podés
                    solicitar la eliminación total de tu cuenta y datos en cualquier momento.
                </SeccionEULA>

                <SeccionEULA titulo="7. Modificaciones">
                    Nos reservamos el derecho de actualizar estos términos. Te notificaremos
                    sobre cambios significativos mediante una notificación en la app.
                </SeccionEULA>

                <Text style={[s.version, { color: colors.foreground }]}>
                    Versión 1.0.1 · {new Date().getFullYear()} Tembiapo App
                </Text>
            </ScrollView>

            {!llegóAlFinal && (
                <Text style={[s.hint, { color: colors.secondary }]}>
                    ↓ Desplazate hasta el final para continuar
                </Text>
            )}

            <Pressable
                style={s.checkboxRow}
                onPress={() => {
                    if (llegóAlFinal) setAceptado((a) => !a);
                }}
                disabled={!llegóAlFinal}
            >
                <Switch
                    value={aceptado}
                    onValueChange={(v) => {
                        if (llegóAlFinal) setAceptado(v);
                    }}
                    disabled={!llegóAlFinal}
                    trackColor={{ true: colors.primary }}
                    thumbColor="#fff"
                />
                <Text
                    style={[
                        s.checkboxLabel,
                        { color: llegóAlFinal ? colors.foreground : colors.secondary },
                    ]}
                >
                    He leído y acepto los Términos y Condiciones
                </Text>
            </Pressable>

            <Pressable
                style={[
                    s.boton,
                    { backgroundColor: puedeAceptar ? colors.primary : colors.border },
                ]}
                onPress={aceptarEULA}
                disabled={!puedeAceptar || guardando}
            >
                <Text style={[s.botonTexto, { color: puedeAceptar ? "#fff" : colors.foreground }]}>
                    {guardando ? "Guardando…" : "Continuar"}
                </Text>
            </Pressable>
        </SafeAreaView>
    );
}

function SeccionEULA({ titulo, children }: { titulo: string; children: string }) {
    const { colors } = useTheme();
    return (
        <View style={s.seccion}>
            <Text style={[s.seccionTitulo, { color: colors.foreground }]}>{titulo}</Text>
            <Text style={[s.seccionTexto, { color: colors.foreground }]}>{children}</Text>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
    titulo: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
    subtitulo: { fontSize: 14, marginBottom: 16 },
    scroll: { flex: 1, borderWidth: 1, borderRadius: 12 },
    scrollContent: { padding: 16, gap: 4 },
    seccion: { marginBottom: 20 },
    seccionTitulo: { fontSize: 15, fontWeight: "600", marginBottom: 6 },
    seccionTexto: { fontSize: 14, lineHeight: 22 },
    version: { fontSize: 12, textAlign: "center", marginTop: 8 },
    hint: { fontSize: 12, textAlign: "center", paddingVertical: 8 },
    checkboxRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 16 },
    checkboxLabel: { flex: 1, fontSize: 13, lineHeight: 20 },
    boton: { paddingVertical: 16, borderRadius: 14, alignItems: "center", marginBottom: 16 },
    botonTexto: { fontSize: 17, fontWeight: "600" },
});