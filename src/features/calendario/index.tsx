import React, { useEffect, useRef, useState } from "react";
import {ScrollView, Alert, Animated, View,
    Platform, ActivityIndicator, Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { FIREBASE_DB } from "@/src/services/FirebaseConfig";
import {
    collection, addDoc, deleteDoc,
    doc, Timestamp, updateDoc
} from "firebase/firestore";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";
import { useTheme } from "@/src/contexts/TemaContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { useEventos } from "./hooks/useEventos";
import { useFormEvento } from "./hooks/useFormEvento"; 
import { CalendarioHeader } from "./components/CalendarioHeader";
import { DiasGrid } from "./components/DiasGrid";
import { EventosDia } from "./components/EventosDia";
import { EventoModal } from "./components/EventoModal";
import { Evento } from "./types";
import { cancelarNotificacion, inicializarNotificaciones, programarNotificacionEvento } from "./notificaciones";


export default function CalendarioScreen() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false);

    const { colors, theme } = useTheme();
    const { isGuest } = useAuth();
    const auth = getAuth();
    const usuario = auth.currentUser;
    const alertShownRef = useRef(false);

    const { eventos, loading, eventosDeDia } = useEventos(usuario, selectedDate, setSelectedDate, usuario?.uid);
    const form = useFormEvento(); // 👈 reemplaza el useState

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const eventosDia = selectedDate ? eventosDeDia(selectedDate) : [];

    useEffect(() => {
        // Mostrar alerta una sola vez si es invitado
        if (isGuest && !alertShownRef.current) {
            alertShownRef.current = true;
            Alert.alert(
                "Acceso Limitado",
                "Para acceder a tus eventos, debes iniciar sesión.",
                [{ text: "OK", style: "default" }]
            );
        }
    }, [isGuest]);

    useEffect(() => {
        inicializarNotificaciones();
        (async () => {
            await Notifications.requestPermissionsAsync();
            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("calendar", {
                    name: "Calendar",
                    importance: Notifications.AndroidImportance.HIGH,
                });
            }
        })();
    }, []);

    useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, friction: 7, useNativeDriver: true }),
        ]).start();
    }, [selectedDate]);

    const abrirModalNuevo = () => {
        if (isGuest) {
            Alert.alert("No permitido", "Los invitados no pueden crear eventos. Por favor, inicia sesión.");
            return;
        }
        if (!selectedDate) {
            Alert.alert("Selecciona un día", "Primero elige una fecha en el calendario.");
            return;
        }
        form.resetForm(); // ✅ ahora existe
        setModalVisible(true);
    };

    const abrirModalEditar = (ev: Evento) => {
        if (isGuest) {
            Alert.alert("No permitido", "Los invitados no pueden editar eventos. Por favor, inicia sesión.");
            return;
        }
        setSelectedDate(ev.fecha);
        form.cargarEvento(ev); // ✅ ahora existe
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
        form.resetForm();
    };

    const guardarEvento = async () => {

        if (isGuest) {
            Alert.alert("No permitido", "Los invitados no pueden crear eventos. Por favor, inicia sesión.");
            return;
        }

        if (!usuario || !selectedDate || !form.titulo.trim()) {
            Alert.alert("Error", "Completa el título y la fecha.");
            return;
        }

        try {
            const ref = collection(FIREBASE_DB, "eventos", usuario.uid, "usuario_eventos");

            const dataBase = {
                titulo: form.titulo,
                descripcion: form.descripcion,
                tipo: form.tipo,
                hora: form.hora,
                fecha: Timestamp.fromDate(selectedDate),
                notificar: form.notificar,
                recordatorioOffsetMinutos: form.notificar ? form.recordatorioOffset : null,
                fechaActualizacion: Timestamp.now(),
            };

            let nuevoNotificationId: string | null = null;

            if (form.notificar) {
                if (!form.hora) {
                    Alert.alert("Selecciona una hora", "Para activar recordatorio, elige una hora.");
                    return;
                }
                if (form.editingEvento?.notificationId) {
                    await cancelarNotificacion(form.editingEvento.notificationId);
                }
                nuevoNotificationId = await programarNotificacionEvento({
                    titulo: form.titulo,
                    descripcion: form.descripcion,
                    fecha: selectedDate,
                    hora: form.hora,
                    offsetMinutos: form.recordatorioOffset ?? 0,
                });
            } else if (form.editingEvento?.notificationId) {
                await cancelarNotificacion(form.editingEvento.notificationId);
            }

            if (form.editingEvento) {
                await updateDoc(
                    doc(FIREBASE_DB, "eventos", usuario.uid, "usuario_eventos", form.editingEvento.id),
                    { ...dataBase, notificationId: nuevoNotificationId }
                );
            } else {
                await addDoc(ref, {
                    ...dataBase,
                    fechaCreacion: Timestamp.now(),
                    notificationId: nuevoNotificationId,
                });
            }

            Toast.show({
                type: "success",
                text1: form.editingEvento ? " ✅ Evento actualizado correctamente" : " ✅ Evento creado correctamente",
                text2: "Tu evento se guardó correctamente 🎉",
            });

            cerrarModal();
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo guardar el evento");
        }
    };

    const eliminarEvento = async (ev: Evento) => {
        if (!usuario) return;
        if (isGuest) {
            Alert.alert("No permitido", "Los invitados no pueden eliminar eventos. Por favor, inicia sesión.");
            return;
        }

        Alert.alert("Eliminar evento", "¿Estás seguro de que deseas eliminarlo?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteDoc(
                            doc(FIREBASE_DB, "eventos", usuario.uid, "usuario_eventos", ev.id)
                        );
                        await cancelarNotificacion(ev.notificationId);
                        Toast.show({ type: "success", text1: " ✅ Evento eliminado correctamente" });
                    } catch (err) {
                        console.error(err);
                        Toast.show({ type: "error", text1: "Error al eliminar el evento" });
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 8, color: colors.mutedForeground }}>
                    Cargando calendario...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <CalendarioHeader
                currentDate={currentDate}
                colors={colors}
                onPrev={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                onNext={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                onHoy={() => {
                    const hoy = new Date();
                    setCurrentDate(hoy);
                    setSelectedDate(hoy);
                }}
            />

            {isGuest ? (

                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
                    <Ionicons name="lock-closed" size={64} color={colors.mutedForeground} />
                    <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginTop: 16, textAlign: "center" }}>
                        Acceso Limitado
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.mutedForeground, marginTop: 8, textAlign: "center", lineHeight: 20 }}>
                        Para acceder a tus eventos, debes iniciar sesión con tu cuenta.
                    </Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 16 }}
                >
                    <DiasGrid
                        currentDate={currentDate}
                        selectedDate={selectedDate}
                        eventos={eventos}
                        onSelectDate={setSelectedDate}
                    />

                    {selectedDate && (
                        <EventosDia
                            selectedDate={selectedDate}
                            eventosDia={eventosDia}
                            colors={colors}
                            theme={theme}
                            fadeAnim={fadeAnim}
                            slideAnim={slideAnim}
                            onAgregarEvento={abrirModalNuevo}
                            onEditarEvento={abrirModalEditar}
                            onEliminarEvento={eliminarEvento}
                            isGuest={isGuest}
                        />
                    )}
                </ScrollView>
            )}
            {/* <Button title="Probar notificación" onPress={probarNotificacion} /> */}

            <EventoModal
                visible={modalVisible}
                form={form}
                selectedDate={selectedDate} 
                onGuardar={guardarEvento}
                onCerrar={cerrarModal}
                isGuest={isGuest}
            />
        </SafeAreaView>
    );
}

