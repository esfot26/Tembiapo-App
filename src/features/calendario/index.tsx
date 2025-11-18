import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Animated,
    Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    collection,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIREBASE_DB } from "@/src/services/FirebaseConfig";
import { nombreMeses, diasSemana, tiposEventos } from "./calendarContants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/contexts/TemaContext";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";

interface Evento {
    id: string;
    titulo: string;
    descripcion: string;
    fecha: Date;
    tipo: string;
    hora?: string;
    notificar?: boolean;
    recordatorioOffsetMinutos?: number | null;
    recordatorioModo?: "offset" | "interval";
    recordatorioIntervaloMinutos?: number | null;
    notificationId?: string;
}

// 🔔 Handler para mostrar notificaciones
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// 🔧 Helper: combinar fecha + hora "HH:mm"
const parseHoraToDate = (baseDate: Date, horaStr?: string) => {
    if (!horaStr) return baseDate;
    const [h, m] = horaStr.split(":").map((p) => parseInt(p || "0", 10));
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    return d;
};

// 🔔 Programar notificación y devolver su ID (para poder cancelarla luego)
const programarNotificacionEvento = async (params: {
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
            trigger: { date: programacion },
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
        trigger: { type: "date", date: programacion },
    });

    return id;
};


const cancelarNotificacion = async (notificationId?: string) => {
    if (!notificationId) return;
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        console.log("🗑️ Notificación cancelada:", notificationId);
    } catch (e) {
        console.log("Error al cancelar notificación:", e);
    }
};

export default function CalendarioScreen() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [eventosDia, setEventosDia] = useState<Evento[]>([]);

    // Campos del formulario
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [hora, setHora] = useState("");
    const [tipo, setTipo] = useState<string>("otro");
    const [notificar, setNotificar] = useState(false);
    const [recordatorioOffset, setRecordatorioOffset] = useState<number | null>(
        null
    );

    const [showHoraPicker, setShowHoraPicker] = useState(false);
    const [editingEvento, setEditingEvento] = useState<Evento | null>(null);

    const { height, width } = Dimensions.get("window");
    const CELDA_ANCHO = width / 7 - 6;

    const auth = getAuth();
    const usuario = auth.currentUser;

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const { colors, theme } = useTheme();

    // Animación card de eventos del día
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, [selectedDate]);

    // 🔔 Permisos y canal de notificaciones (una sola vez)
    useEffect(() => {
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

    // 🔁 Escuchar Firestore
    useEffect(() => {
        if (!usuario) return;

        const ref = collection(
            FIREBASE_DB,
            "eventos",
            usuario.uid,
            "usuario_eventos"
        );

        const unsub = onSnapshot(ref, (snapshot) => {
            const lista = snapshot.docs.map((d) => {
                const data = d.data() as any;
                return {
                    id: d.id,
                    titulo: data.titulo || "Sin título",
                    descripcion: data.descripcion || "",
                    fecha: data.fecha?.toDate?.() || new Date(),
                    tipo: data.tipo || "otro",
                    hora: data.hora || "",
                    notificar: data.notificar ?? false,
                    recordatorioOffsetMinutos:
                        data.recordatorioOffsetMinutos ?? null,
                    notificationId: data.notificationId,
                } as Evento;
            });
            setEventos(lista);
            setLoading(false);
        });

        return () => unsub();
    }, [usuario]);

    // 📌 Eventos del día seleccionado
    useEffect(() => {
        if (!selectedDate) {
            setEventosDia([]);
            return;
        }

        const filtrados = eventos.filter(
            (ev) =>
                ev.fecha.getDate() === selectedDate.getDate() &&
                ev.fecha.getMonth() === selectedDate.getMonth() &&
                ev.fecha.getFullYear() === selectedDate.getFullYear()
        );

        setEventosDia(filtrados);
    }, [selectedDate, eventos]);

    // 📅 Render de días del mes
    const renderDias = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const diasEnMes = new Date(year, month + 1, 0).getDate();
        const primerDia = new Date(year, month, 1).getDay();
        const hoy = new Date();
        const celdas = [];

        // Celdas vacías antes del día 1
        for (let i = 0; i < primerDia; i++) {
            celdas.push(
                <View
                    key={`empty-${i}`}
                    style={{
                        width: CELDA_ANCHO,
                        height: CELDA_ANCHO,
                        margin: 2,
                    }}
                />
            );
        }

        // Días del mes
        for (let day = 1; day <= diasEnMes; day++) {
            const fecha = new Date(year, month, day);
            const eventosDelDia = eventos.filter(
                (ev) =>
                    ev.fecha.getDate() === day &&
                    ev.fecha.getMonth() === month &&
                    ev.fecha.getFullYear() === year
            );

            const tieneEvento = eventosDelDia.length > 0;
            const esHoy =
                fecha.getDate() === hoy.getDate() &&
                fecha.getMonth() === hoy.getMonth() &&
                fecha.getFullYear() === hoy.getFullYear();

            const esSeleccionado =
                selectedDate &&
                fecha.getDate() === selectedDate.getDate() &&
                fecha.getMonth() === selectedDate.getMonth() &&
                fecha.getFullYear() === selectedDate.getFullYear();

            celdas.push(
                <TouchableOpacity
                    key={day}
                    onPress={() => setSelectedDate(fecha)}
                    style={{
                        width: CELDA_ANCHO,
                        height: CELDA_ANCHO,
                        margin: 2,
                        borderRadius: 12,
                        borderWidth: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: esSeleccionado
                            ? colors.primary
                            : esHoy
                                ? (theme === "dark" ? colors.card : "#e0f2fe")
                                : theme === "dark"
                                    ? colors.card
                                    : "#f9fafb",
                        borderColor: esSeleccionado
                            ? colors.primary
                            : tieneEvento
                                ? colors.primary
                                : colors.border,
                        shadowColor: "#000",
                        shadowOpacity: 0.08,
                        shadowRadius: 3,
                        elevation: 2,
                    }}
                >
                    <Text
                        style={{
                            color: esSeleccionado
                                ? "#fff"
                                : theme === "dark"
                                    ? colors.primaryForeground
                                    : "#111827",
                            fontWeight: esSeleccionado ? "700" : "500",
                        }}
                    >
                        {day}
                    </Text>

                    {tieneEvento && !esSeleccionado && (
                        <View
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: colors.primary,
                                marginTop: 3,
                            }}
                        />
                    )}
                </TouchableOpacity>
            );
        }

        return celdas;
    };

    const abrirModalNuevoEvento = () => {
        if (!selectedDate) {
            Alert.alert("Selecciona un día", "Primero elige una fecha en el calendario.");
            return;
        }
        setEditingEvento(null);
        setTitulo("");
        setDescripcion("");
        setHora("");
        setTipo("otro");
        setNotificar(false);
        setRecordatorioOffset(null);
        setModalVisible(true);
    };

    const abrirModalEditarEvento = (ev: Evento) => {
        setSelectedDate(ev.fecha);
        setEditingEvento(ev);
        setTitulo(ev.titulo);
        setDescripcion(ev.descripcion || "");
        setHora(ev.hora || "");
        setTipo(ev.tipo || "otro");
        setNotificar(!!ev.notificar);
        setRecordatorioOffset(ev.recordatorioOffsetMinutos ?? null);
        setModalVisible(true);
    };

    // ➕ Crear / Actualizar evento
    const guardarEvento = async () => {
        if (!usuario || !selectedDate || !titulo.trim()) {
            Alert.alert("Error", "Completa el título y la fecha.");
            return;
        }

        try {
            const ref = collection(
                FIREBASE_DB,
                "eventos",
                usuario.uid,
                "usuario_eventos"
            );

            const dataBase = {
                titulo,
                descripcion,
                tipo,
                hora,
                fecha: Timestamp.fromDate(selectedDate),
                notificar,
                recordatorioOffsetMinutos: notificar ? recordatorioOffset : null,
                fechaActualizacion: Timestamp.now(),
            };

            let nuevoNotificationId: string | null = null;

            if (notificar) {
                if (!hora) {
                    Alert.alert("Selecciona una hora", "Para activar recordatorio, elige una hora del evento.");
                    return;
                }
                // Si estamos editando, cancelar anterior
                if (editingEvento?.notificationId) {
                    await cancelarNotificacion(editingEvento.notificationId);
                }

                nuevoNotificationId = await programarNotificacionEvento({
                    titulo,
                    descripcion,
                    fecha: selectedDate,
                    hora,
                    offsetMinutos: recordatorioOffset ?? 0,
                });
            } else if (editingEvento?.notificationId) {
                // Si desactivó el recordatorio al editar
                await cancelarNotificacion(editingEvento.notificationId);
            }

            if (editingEvento) {
                // Actualizar
                const docRef = doc(
                    FIREBASE_DB,
                    "eventos",
                    usuario.uid,
                    "usuario_eventos",
                    editingEvento.id
                );

                await updateDoc(docRef, {
                    ...dataBase,
                    notificationId: nuevoNotificationId,
                });
            } else {
                // Crear
                await addDoc(ref, {
                    ...dataBase,
                    fechaCreacion: Timestamp.now(),
                    notificationId: nuevoNotificationId,
                });
            }

            Toast.show({
                type: "success",
                text1: editingEvento ? "Evento actualizado" : "Evento creado",
                text2: "Tu evento se ha guardado correctamente 🎉",
            });

            setModalVisible(false);
            setEditingEvento(null);
            setTitulo("");
            setDescripcion("");
            setHora("");
            setTipo("otro");
            setNotificar(false);
            setRecordatorioOffset(null);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo guardar el evento");
        }
    };

    const eliminarEvento = async (ev: Evento) => {
        if (!usuario) return;

        Alert.alert(
            "Eliminar evento",
            "¿Estás seguro de que deseas eliminar este evento?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const ref = doc(
                                FIREBASE_DB,
                                "eventos",
                                usuario.uid,
                                "usuario_eventos",
                                ev.id
                            );
                            await deleteDoc(ref);
                            await cancelarNotificacion(ev.notificationId);

                            Toast.show({
                                type: "success",
                                text1: "Evento eliminado",
                                text2: "El evento ha sido eliminado correctamente.",
                            });
                        } catch (err) {
                            console.error("Error al eliminar evento:", err);
                            Toast.show({
                                type: "error",
                                text1: "Error",
                                text2: "Ocurrió un error al eliminar el evento.",
                            });
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={{ marginTop: 8, color: "#6b7280" }}>
                    Cargando calendario...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: colors.background }}
        >
            {/* HEADER */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    backgroundColor: colors.card,
                    shadowColor: "#000",
                    shadowOpacity: 0.06,
                    shadowRadius: 4,
                    elevation: 2,
                }}
            >
                <TouchableOpacity
                    onPress={() =>
                        setCurrentDate(
                            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
                        )
                    }
                >
                    <Ionicons
                        name="chevron-back"
                        size={26}
                        color={colors.foreground}
                    />
                </TouchableOpacity>

                <View style={{ alignItems: "center" }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: colors.foreground,
                        }}
                    >
                        {nombreMeses[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </Text>
                    <TouchableOpacity onPress={() => {
                        const hoy = new Date();
                        setCurrentDate(hoy);
                        setSelectedDate(hoy);
                    }}>
                        <Text
                            style={{
                                fontSize: 16,
                                color: colors.foreground,
                                marginTop: 2,
                            }}
                        >
                            Hoy
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() =>
                        setCurrentDate(
                            new Date(
                                currentDate.getFullYear(),
                                currentDate.getMonth() + 1,
                                1
                            )
                        )
                    }
                >
                    <Ionicons
                        name="chevron-forward"
                        size={26}
                        color={colors.foreground}
                    />
                </TouchableOpacity>
            </View>

            {/* DÍAS DE LA SEMANA */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                    marginHorizontal: 4,
                    paddingHorizontal: 6,
                    paddingVertical: 8,
                }}
            >
                {diasSemana.map((dia, i) => (
                    <View
                        key={i}
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: "600",
                                color:
                                    theme === "dark"
                                        ? colors.foreground || "#cbd5e1"
                                        : colors.foreground || "#374151",
                            }}
                        >
                            {dia}
                        </Text>
                    </View>
                ))}
            </View>

            {/* CUERPO */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 4,
                    paddingBottom: 16,
                }}
            >
                {/* Calendario */}
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                    }}
                >
                    {renderDias()}
                </View>

                {/* Eventos del día */}
                {selectedDate && (
                    <Animated.View
                        style={{
                            marginTop: 20,
                            marginHorizontal: 8,
                            backgroundColor: colors.card,
                            borderRadius: 24,
                            borderWidth: 1,
                            borderColor: colors.border,
                            padding: 16,
                            shadowColor: "#000",
                            shadowOpacity: theme === "dark" ? 0.25 : 0.08,
                            shadowOffset: { width: 0, height: 2 },
                            shadowRadius: 6,
                            elevation: 3,
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        {/* Encabezado del día */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 10,
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "700",
                                        color: colors.foreground,
                                    }}
                                >
                                    {selectedDate.getDate()} de{" "}
                                    {nombreMeses[selectedDate.getMonth()]}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: colors.mutedForeground,
                                    }}
                                >
                                    {eventosDia.length} evento(s)
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={abrirModalNuevoEvento}
                                activeOpacity={0.8}
                                style={{
                                    backgroundColor: colors.primary,
                                    borderRadius: 40,
                                    padding: 6,
                                    shadowColor: colors.primary,
                                    shadowOpacity: 0.3,
                                    shadowRadius: 6,
                                    elevation: 3,
                                }}
                            >
                                <Ionicons name="add" size={22} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Lista de eventos */}
                        {eventosDia.length === 0 ? (
                            <View style={{ alignItems: "center", paddingVertical: 14 }}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={32}
                                    color={colors.mutedForeground}
                                />
                                <Text
                                    style={{
                                        color: colors.mutedForeground,
                                        marginTop: 6,
                                        fontSize: 14,
                                    }}
                                >
                                    Sin eventos para este día
                                </Text>
                            </View>
                        ) : (
                            eventosDia.map((ev) => {
                                const info = tiposEventos.find((t) => t.key === ev.tipo);
                                return (
                                    <TouchableOpacity
                                        key={ev.id}
                                        onPress={() => abrirModalEditarEvento(ev)}
                                        activeOpacity={0.8}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            backgroundColor:
                                                theme === "dark"
                                                    ? colors.secondary
                                                    : "#eef2ff",
                                            borderRadius: 16,
                                            padding: 10,
                                            marginBottom: 8,
                                            borderWidth: 1,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 5,
                                                height: 40,
                                                borderRadius: 4,
                                                marginRight: 10,
                                                backgroundColor:
                                                    info?.color || colors.chart2 || colors.primary,
                                            }}
                                        />
                                        <View style={{ flex: 1 }}>
                                            <Text
                                                style={{
                                                    fontWeight: "600",
                                                    color: colors.foreground,
                                                    fontSize: 15,
                                                }}
                                            >
                                                {ev.titulo}
                                            </Text>

                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    marginTop: 2,
                                                    gap: 6,
                                                }}
                                            >
                                                {ev.hora && (
                                                    <View
                                                        style={{
                                                            paddingHorizontal: 8,
                                                            paddingVertical: 2,
                                                            borderRadius: 999,
                                                            backgroundColor:
                                                                theme === "dark"
                                                                    ? "rgba(148,163,184,0.2)"
                                                                    : "#e0f2fe",
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 11,
                                                                color: colors.foreground,
                                                            }}
                                                        >
                                                            {ev.hora}
                                                        </Text>
                                                    </View>
                                                )}

                                                {info && (
                                                    <View
                                                        style={{
                                                            paddingHorizontal: 8,
                                                            paddingVertical: 2,
                                                            borderRadius: 999,
                                                            backgroundColor: info.color + "33",
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 11,
                                                                color: info.color,
                                                                fontWeight: "500",
                                                            }}
                                                        >
                                                            {info.label}
                                                        </Text>
                                                    </View>
                                                )}

                                                {ev.notificar && (
                                                    <Ionicons
                                                        name="notifications-outline"
                                                        size={16}
                                                        color={colors.primary}
                                                    />
                                                )}
                                            </View>

                                            {ev.descripcion ? (
                                                <Text
                                                    numberOfLines={2}
                                                    style={{
                                                        color: colors.mutedForeground,
                                                        fontSize: 13,
                                                        marginTop: 4,
                                                    }}
                                                >
                                                    {ev.descripcion}
                                                </Text>
                                            ) : null}
                                        </View>

                                        <TouchableOpacity
                                            onPress={() => eliminarEvento(ev)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name="trash-outline"
                                                size={18}
                                                color={colors.destructive}
                                            />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </Animated.View>
                )}
            </ScrollView>

            {/* MODAL NUEVO / EDITAR EVENTO */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                    >
                        <View
                            style={{
                                width: "90%",
                                maxHeight: height * 0.85,
                                backgroundColor: colors.background,
                                borderRadius: 24,
                                padding: 20,
                                shadowColor: "#000",
                                shadowOpacity: 0.25,
                                shadowOffset: { width: 0, height: 2 },
                                shadowRadius: 8,
                                elevation: 5,
                            }}
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "700",
                                        color: colors.foreground,
                                        marginBottom: 16,
                                        textAlign: "center",
                                    }}
                                >
                                    {editingEvento ? "Editar evento" : "Nuevo evento"}
                                </Text>

                                {/* Título */}
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#d1d5db",
                                        borderRadius: 12,
                                        padding: 12,
                                        fontSize: 15,
                                        color: colors.foreground,
                                        marginBottom: 10,
                                    }}
                                    placeholder="Título"
                                    placeholderTextColor="#9ca3af"
                                    value={titulo}
                                    onChangeText={setTitulo}
                                />

                                {/* Descripción */}
                                <TextInput
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#d1d5db",
                                        borderRadius: 12,
                                        padding: 12,
                                        fontSize: 15,
                                        color: colors.foreground,
                                        marginBottom: 10,
                                        minHeight: 90,
                                    }}
                                    placeholder="Descripción (opcional)"
                                    placeholderTextColor="#9ca3af"
                                    value={descripcion}
                                    onChangeText={setDescripcion}
                                />

                                {/* Hora */}
                                <TouchableOpacity
                                    onPress={() => setShowHoraPicker(true)}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#d1d5db",
                                        borderRadius: 12,
                                        padding: 12,
                                        marginBottom: 12,
                                    }}
                                >
                                    <Text style={{ fontSize: 15, color: colors.foreground }}>
                                        {hora ? `Hora: ${hora}` : "Seleccionar hora"}
                                    </Text>
                                </TouchableOpacity>

                                {showHoraPicker && (
                                    <DateTimePicker
                                        mode="time"
                                        display="default"
                                        value={
                                            hora
                                                ? new Date(
                                                    new Date().setHours(
                                                        parseInt(hora.split(":")[0] || "0", 10),
                                                        parseInt(hora.split(":")[1] || "0", 10),
                                                        0,
                                                        0
                                                    )
                                                )
                                                : new Date()
                                        }
                                        onChange={(event, date) => {
                                            if (date) {
                                                const h = ("0" + date.getHours()).slice(-2);
                                                const m = ("0" + date.getMinutes()).slice(-2);
                                                setHora(`${h}:${m}`);
                                            }
                                            setShowHoraPicker(Platform.OS === "ios");
                                        }}
                                    />
                                )}

                                {/* Recordatorio */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginBottom: 12,
                                        marginTop: 4,
                                    }}
                                >
                                    <Text
                                        style={{ fontSize: 15, color: colors.foreground }}
                                    >
                                        Activar recordatorio
                                    </Text>
                                    <Switch
                                        value={notificar}
                                        onValueChange={setNotificar}
                                    />
                                </View>

                                {notificar && (
                                    <View style={{ marginBottom: 16 }}>
                                        <Text style={{ fontSize: 13, color: colors.mutedForeground, marginBottom: 6 }}>
                                            ¿Cuánto antes o después? (opcional)
                                        </Text>
                                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                                            {[
                                                { label: "3 min después", value: -3 },
                                                { label: "5 min después", value: -5 },
                                                { label: "15 min después", value: -15 },
                                                { label: "10 min antes", value: 10 },
                                                { label: "1 hora antes", value: 60 },
                                                { label: "1 día antes", value: 1440 },
                                            ].map((opt) => {
                                                const active = recordatorioOffset === opt.value;
                                                return (
                                                    <TouchableOpacity
                                                        key={`${opt.label}-${opt.value}`}
                                                        onPress={() => setRecordatorioOffset(opt.value)}
                                                        style={{
                                                            paddingHorizontal: 10,
                                                            paddingVertical: 6,
                                                            borderRadius: 999,
                                                            borderWidth: 1,
                                                            borderColor: active ? colors.primary : "#d1d5db",
                                                            backgroundColor: active ? colors.primary : "#f3f4f6",
                                                        }}
                                                    >
                                                        <Text style={{ fontSize: 12, fontWeight: "500", color: active ? "#fff" : "#111827" }}>
                                                            {opt.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>
                                    )}

                                {/* Tipos de eventos */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        gap: 8,
                                        marginBottom: 20,
                                        marginTop: 4,
                                    }}
                                >
                                    {tiposEventos.map((t) => {
                                        const active = tipo === t.key;
                                        return (
                                            <TouchableOpacity
                                                key={t.key}
                                                onPress={() => setTipo(t.key)}
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    paddingVertical: 8,
                                                    paddingHorizontal: 12,
                                                    borderRadius: 20,
                                                    borderWidth: 1,
                                                    borderColor: active ? colors.primary : "#d1d5db",
                                                    backgroundColor: active
                                                        ? colors.primary
                                                        : "#f3f4f6",
                                                }}
                                                activeOpacity={0.8}
                                            >
                                                <Ionicons
                                                    name={t.icon as any}
                                                    size={16}
                                                    color={active ? "#fff" : t.color}
                                                />
                                                <Text
                                                    style={{
                                                        marginLeft: 6,
                                                        fontSize: 13,
                                                        fontWeight: "500",
                                                        color: active ? "#fff" : "#374151",
                                                    }}
                                                >
                                                    {t.label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                {/* Botones */}
                                <View style={{ flexDirection: "row", gap: 10 }}>
                                    <TouchableOpacity
                                        onPress={guardarEvento}
                                        activeOpacity={0.9}
                                        style={{
                                            flex: 1,
                                            backgroundColor: colors.primary,
                                            paddingVertical: 12,
                                            borderRadius: 12,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexDirection: "row",
                                            gap: 6,
                                        }}
                                    >
                                        <Ionicons
                                            name="checkmark-circle-outline"
                                            size={20}
                                            color="#fff"
                                        />
                                        <Text
                                            style={{ color: "#fff", fontWeight: "600" }}
                                        >
                                            {editingEvento ? "Actualizar" : "Crear"}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            setModalVisible(false);
                                            setEditingEvento(null);
                                        }}
                                        activeOpacity={0.9}
                                        style={{
                                            flex: 1,
                                            backgroundColor: "#dc2626",
                                            paddingVertical: 12,
                                            borderRadius: 12,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexDirection: "row",
                                            gap: 6,
                                        }}
                                    >
                                        <Ionicons
                                            name="close-circle-outline"
                                            size={20}
                                            color="#fff"
                                        />
                                        <Text
                                            style={{ color: "#fff", fontWeight: "600" }}
                                        >
                                            Cancelar
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
