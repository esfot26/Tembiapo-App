import { Alert } from "react-native";
import { collection, addDoc, deleteDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "@/src/services/FirebaseConfig";
import { User } from "firebase/auth";
import Toast from "react-native-toast-message";
import { cancelarNotificacion, programarNotificacionEvento } from "../notificaciones";
import { Evento } from "../types";

interface UseEventosParams {
    usuario: User | null;
    selectedDate: Date | null;
    form: Evento;
    isGuest: boolean;
    onSuccess: () => void; // cerrarModal
}

export function useEventosCrud({
    usuario, selectedDate, form, isGuest, onSuccess,
}: UseEventosParams) {

    const guardarEvento = async () => {
        if (isGuest) {
            Alert.alert("No permitido", "Los invitados no pueden crear eventos.");
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
                text1: form.editingEvento ? "✅ Evento actualizado" : "✅ Evento creado",
                text2: "Tu evento se guardó correctamente 🎉",
            });

            onSuccess();
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo guardar el evento");
        }
    };

    const eliminarEvento = async (ev: Evento) => {
        if (!usuario || isGuest) return;

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
                        Toast.show({ type: "success", text1: "✅ Evento eliminado" });
                    } catch (err) {
                        console.error(err);
                        Toast.show({ type: "error", text1: "Error al eliminar el evento" });
                    }
                },
            },
        ]);
    };

    return { guardarEvento, eliminarEvento };
}