import { useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { Timestamp } from "firebase/firestore";
import * as Notifications from "expo-notifications";
import { CalendarioServices } from "@/src/services/CalendarioServices";
import Toast from "react-native-toast-message";
import { tiposEventos } from "../calendarContants";

export interface Event {
    id: string;
    titulo: string;
    descripcion: string;
    fecha: Date;
    tipo: "examen" | "tarea" | "presentacion" | "laboratorio" | "otro";
    tiempo?: string;
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});


const parseHoraToDate = (baseDate: Date, horaStr: string) => {
    const parts = (horaStr || "").split(":");
    const h = parseInt(parts[0] || "0", 10);
    const m = parseInt(parts[1] || "0", 10);
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    return d;
};

const programarNotificacionEvento = async (params: {
    titulo: string;
    descripcion: string;
    fecha: Date;
    hora?: string;
}) => {
    const { titulo, descripcion, fecha, hora } = params;

    // Si hay hora, se mezcla con la fecha
    const fechaNotificacion = hora
        ? parseHoraToDate(fecha, hora)
        : new Date(fecha);

    const ahora = new Date();
    if (fechaNotificacion <= ahora) {
        // No programamos notis en el pasado
        return;
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: titulo,
            body: descripcion || "Evento programado",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: Math.max(0, Math.floor((fechaNotificacion.getTime() - Date.now()) / 1000)),
        },
    });
};

export const useCalendarioLogic = () => {
    const [eventos, setEventos] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editandoEvento, setEditandoEvento] = useState<Event | null>(null);
    const [eventoTitulo, setEventoTitulo] = useState("");
    const [eventoDescripcion, setEventoDescripcion] = useState("");
    const [eventoTipo, setEventoTipo] = useState<Event["tipo"]>("otro");
    const [eventoTiempo, setEventoTiempo] = useState("");
    const [selectedDayeventos, setSelectedDayeventos] = useState<Event[]>([]);

    // 🔔 Pedir permisos de notificación y configurar canal (solo una vez)
    useEffect(() => {
        const configurarNotificaciones = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Notificaciones desactivadas",
                    "Si quieres recibir recordatorios de tus eventos, habilita las notificaciones en la configuración del dispositivo."
                );
            }

            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("calendar", {
                    name: "Calendar",
                    importance: Notifications.AndroidImportance.HIGH,
                });
            }
        };

        configurarNotificaciones();
    }, []);

    const cargarEventos = async () => {
        try {
            setLoading(true);
            const snapshot = await CalendarioServices.verEventos();
            const loaded: Event[] = snapshot.map((data: any) => ({
                id: data.id,
                titulo: data.titulo || "Sin título",
                descripcion: data.descripcion || "",
                fecha:
                    data.fecha?.toDate?.() ||
                    new Date(data.fecha?.seconds * 1000) ||
                    new Date(),
                // ojo: en Firestore guardas "otro", no "other"
                tipo: (data.tipo as Event["tipo"]) || "otro",
                tiempo: data.hora || data.tiempo || "",
            }));
            setEventos(loaded);
        } catch (error) {
            console.error("Error al cargar eventos:", error);
            Alert.alert("Error", "No se pudieron cargar los eventos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEventos();
    }, []);

    const guardarEventos = async () => {
        if (!eventoTitulo.trim() || !selectedDate) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Por favor completa el título y la fecha.",
            });
            return;
        }

        const eventData = {
            titulo: eventoTitulo.trim(),
            descripcion: eventoDescripcion.trim(),
            fecha: Timestamp.fromDate(selectedDate),
            tipo: eventoTipo,
            hora: eventoTiempo.trim(),
        };

        try {
            if (editandoEvento) {
                // 📝 Actualizar
                await CalendarioServices.actualizarEvento(editandoEvento.id, eventData);
            } else {
                // 🆕 Crear
                await CalendarioServices.agregarEvento(eventData);
            }

            Toast.show({
                type: "success",
                text1: " ✅ Evento guardado correctamente",
                text2: "Tu evento se ha guardado correctamente 🎉",
            });

            // 🔔 Programar notificación local SOLO para el evento principal
            await programarNotificacionEvento({
                titulo: eventoTitulo.trim(),
                descripcion: eventoDescripcion.trim(),
                fecha: selectedDate,
                hora: eventoTiempo.trim(),
            });

            // ❌ Eliminado: ya no creamos un segundo evento "Recordatorio" en Firestore,
            // para evitar duplicados en el calendario.

            resetearFormulario();
            await cargarEventos();
        } catch (error) {
            console.error("Error guardando evento:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo guardar el evento",
            });
        }
    };

    const eliminarEventos = async (id: string) => {
        Alert.alert("Eliminar evento", "¿Seguro que deseas eliminarlo?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await CalendarioServices.eliminarEvento(id);
                        Toast.show({
                            type: "success",
                            text1: " ✅ Evento eliminado correctamente",
                            text2: "Tu evento ha sido eliminado correctamente 🗑️",
                        });
                        await cargarEventos();
                    } catch (error) {
                        console.error("Error eliminando evento:", error);
                        Toast.show({
                            type: "error",
                            text1: "Error",
                            text2: "No se pudo eliminar el evento",
                        });
                    }
                },
            },
        ]);
    };

    const getCurrentMontheventos = () =>
        eventos.filter(
            (event) =>
                event.fecha.getMonth() === currentDate.getMonth() &&
                event.fecha.getFullYear() === currentDate.getFullYear()
        );

    const geteventosForDate = (date: number) =>
        getCurrentMontheventos().filter(
            (event) => event.fecha.getDate() === date
        );

    const getEventTypeInfo = (type: string) =>
        tiposEventos.find((t) => t.key === type) || tiposEventos[4];

    const resetearFormulario = () => {
        setEditandoEvento(null);
        setEventoTitulo("");
        setEventoDescripcion("");
        setEventoTipo("otro");
        setEventoTiempo("");
    };

    return {
        eventos,
        loading,
        currentDate,
        setCurrentDate,
        selectedDate,
        setSelectedDate,
        modalVisible,
        setModalVisible,
        eventoTitulo,
        setEventoTitulo,
        eventoDescripcion,
        setEventoDescripcion,
        eventoTipo,
        setEventoTipo,
        eventoTiempo,
        setEventoTiempo,
        editandoEvento,
        setEditandoEvento,
        selectedDayeventos,
        setSelectedDayeventos,
        getCurrentMontheventos,
        geteventosForDate,
        getEventTypeInfo,
        guardarEventos,
        eliminarEventos,
    };
};
