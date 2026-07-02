import * as Notifications from 'expo-notifications';


export const parseHoraToDate = (baseDate: Date, horaStr?: string) => {
    if (!horaStr) return baseDate;
    const [h, m] = horaStr.split(":").map((p) => parseInt(p || "0", 10));
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    return d;
};
// 🔔 Handler para mostrar notificaciones
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});


// 🔔 Programar notificación y devolver su ID (para poder cancelarla luego)
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

    if (modo === "interval") {
        const mins = Math.max(1, Math.floor((intervaloMinutos ?? 1)));
        const fechaBase = parseHoraToDate(fecha, hora);
        const fechaRecordatorio = new Date(fechaBase.getTime() - mins * 60 * 1000);
        const ahora = new Date();
        if (fechaBase <= ahora) {
            return null;
        }
        const programacion = fechaRecordatorio <= ahora ? fechaBase : fechaRecordatorio;
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: titulo,
                body: descripcion || "Recordatorio de evento",
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: programacion,
            },
        });
        return id;
    }

    const fechaBase = parseHoraToDate(fecha, hora);
    const offset = offsetMinutos ?? 0;
    const fechaRecordatorio = new Date(fechaBase.getTime() - offset * 60 * 1000);

    const ahora = new Date();
    let programacion = fechaRecordatorio;
    if (programacion <= ahora) {
        if (fechaBase > ahora) {
            programacion = fechaBase;
        } else {
            return null;
        }
    }
    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: titulo,
            body: descripcion || "Recordatorio de evento",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: programacion,
        },
    });

    return id;
};


export const cancelarNotificacion = async (notificationId?: string) => {
    if (!notificationId) return;
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        console.log("🗑️ Notificación cancelada:", notificationId);
    } catch (e) {
        console.log("Error al cancelar notificación:", e);
    }
};