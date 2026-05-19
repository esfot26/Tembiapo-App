import * as Notifications from "expo-notifications";
import { Button } from "react-native";

export const probarNotificacion = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🔔 Prueba de notificación",
            body: "Si ves esto, las notificaciones funcionan correctamente",
        },
        trigger: {
            type: "timeInterval",
            seconds: 5,
            repeats: false,
        } as any,
    });
    console.log("Notificación programada para 5 segundos");
};