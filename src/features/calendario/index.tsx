import React, { useState } from "react";
import { ScrollView, Platform, ActivityIndicator, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { getAuth } from "firebase/auth";
import { useTheme } from "@/src/contexts/TemaContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { useEventos } from "./hooks/useEventos";
import { useFormEvento } from "./hooks/useFormEvento";
import { useCalendarioAnimacion } from "./hooks/useCalendarioAnimacion";
import { useGuestGuard } from "./hooks/useGuestGuard";
import { inicializarNotificaciones } from "./notificaciones";
import { CalendarioHeader } from "./components/CalendarioHeader";
import { DiasGrid } from "./components/DiasGrid";
import { EventosDia } from "./components/EventosDia";
import { EventoModal } from "./components/EventoModal";
import { Evento } from "./types";
import { useEffect } from "react";
import { useEventosCrud } from "./hooks/useEventosCrud";
import { VistaInvitados } from "./components/VistaInvitado";
export default function CalendarioScreen() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false);

    const { colors, theme } = useTheme();
    const { isGuest } = useAuth();
    const usuario = getAuth().currentUser;

    const { eventos, loading, eventosDeDia } = useEventos(usuario, selectedDate, setSelectedDate, usuario?.uid);
    const form = useFormEvento();
    const { fadeAnim, slideAnim } = useCalendarioAnimacion(selectedDate);
    const { guardAction } = useGuestGuard(isGuest);

    const cerrarModal = () => { setModalVisible(false); form.resetForm(); };
    const onSuccess = () => cerrarModal();

    const { guardarEvento, eliminarEvento } = useEventosCrud({
        usuario,
        selectedDate,
        form: form as unknown as Evento,
        isGuest,
        onSuccess,
    });

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

    const abrirModalNuevo = () =>
        guardAction("Los invitados no pueden crear eventos.", () => {
            if (!selectedDate) { Alert.alert("Selecciona un día", "Primero elige una fecha."); return; }
            form.resetForm();
            setModalVisible(true);
        });

    const abrirModalEditar = (ev: Evento) =>
        guardAction("Los invitados no pueden editar eventos.", () => {
            setSelectedDate(ev.fecha);
            form.cargarEvento(ev);
            setModalVisible(true);
        });

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 8, color: colors.mutedForeground }}>Cargando calendario...</Text>
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
                onHoy={() => { const h = new Date(); setCurrentDate(h); setSelectedDate(h); }}
            />

            {isGuest ? <VistaInvitados colors={colors} /> : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 16 }}>
                    <DiasGrid currentDate={currentDate} selectedDate={selectedDate} eventos={eventos} onSelectDate={setSelectedDate} />
                    {selectedDate && (
                        <EventosDia
                            selectedDate={selectedDate}
                            eventosDia={eventosDeDia(selectedDate)}
                            colors={colors} theme={theme}
                            fadeAnim={fadeAnim} slideAnim={slideAnim}
                            onAgregarEvento={abrirModalNuevo}
                            onEditarEvento={abrirModalEditar}
                            onEliminarEvento={eliminarEvento}
                            isGuest={isGuest}
                        />
                    )}
                </ScrollView>
            )}
            <EventoModal
                visible={modalVisible} form={form} selectedDate={selectedDate}
                onGuardar={guardarEvento} onCerrar={cerrarModal} isGuest={isGuest}
            />
        </SafeAreaView>
    );
}