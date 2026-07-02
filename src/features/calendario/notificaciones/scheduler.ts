import * as Notifications from "expo-notifications";
import { parseHoraToDate, calcularFechaProgramacion } from "./utils";

export const programarNotificacionEvento = async (params: {
    titulo: string;
    descripcion?: string;
    fecha: Date;
    hora?: string;
    offsetMinutos?: number | null;
    modo?: "offset" | "interval";
    intervaloMinutos?: number | null;
}): Promise<string | null> => {
    const { titulo, descripcion, fecha, hora, offsetMinutos, modo = "offset", intervaloMinutos } = params;

    const fechaBase = parseHoraToDate(fecha, hora);
    const minutos = modo === "interval"
        ? Math.max(1, Math.floor(intervaloMinutos ?? 1))
        : (offsetMinutos ?? 0);

    const programacion = calcularFechaProgramacion(fechaBase, minutos);
    if (!programacion) return null;

    return await Notifications.scheduleNotificationAsync({
        content: {
            title: titulo,
            body: descripcion || "Recordatorio de evento",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: programacion,
        },
    });
};

export const cancelarNotificacion = async (notificationId?: string): Promise<void> => {
    if (!notificationId) return;
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (e) {
        console.error("Error al cancelar notificación:", e);
    }
};