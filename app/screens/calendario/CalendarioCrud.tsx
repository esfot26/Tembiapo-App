"use client"

import React, { useState, useEffect, use } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { useActiveScreen } from "../../contexts/ActiveScreenContext"
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Alert,
    Dimensions,
    ActivityIndicator,
    Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../services/FirebaseConfig"
import { collection, onSnapshot, doc, deleteDoc, updateDoc, addDoc, Timestamp } from "firebase/firestore"
import Toast from "react-native-toast-message"


const { width, height } = Dimensions.get("window")

interface Event {
    id: string
    titulo: string
    description: string
    date: Date
    type: "exam" | "assignment" | "presentation" | "lab" | "other"
    time?: string
}

export default function ImprovedCalendar() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)
    const [eventTitle, setEventTitle] = useState("") // 👈 Cambiado de setEventTitulo a setEventTitle
    const [eventDescription, setEventDescription] = useState("")
    const [eventType, setEventType] = useState<Event["type"]>("other")
    const [eventTime, setEventTime] = useState("")
    const { setActiveScreen } = useActiveScreen()
    const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([])



    const user = FIREBASE_AUTH.currentUser
    const userId = user ? user.uid : null

    const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ]

    const eventTypes = [
        { key: "exam", label: "Examen", color: "#ef4444", icon: "school-outline" },
        { key: "assignment", label: "Tarea", color: "#3b82f6", icon: "document-text-outline" },
        { key: "presentation", label: "Presentación", color: "#10b981", icon: "mic-outline" },
        { key: "lab", label: "Laboratorio", color: "#8b5cf6", icon: "flask-outline" },
        { key: "other", label: "Otro", color: "#64748b", icon: "calendar-outline" },
    ]

    const getResponsiveDimensions = () => {
        const isSmallScreen = width < 350
        const isMediumScreen = width >= 350 && width < 400

        return {
            padding: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
            headerFontSize: isSmallScreen ? 22 : isMediumScreen ? 24 : 28,
            subtituloFontSize: isSmallScreen ? 14 : 16,
            iconSize: isSmallScreen ? 20 : 24,
            spacing: isSmallScreen ? 12 : 16,
            calendarCellSize: isSmallScreen ? 35 : isMediumScreen ? 40 : 45,
        }
    }

    const formatTimeInput = (text: string): string => {
        // Eliminar cualquier cosa que no sea número
        const numbers = text.replace(/\D/g, '').slice(0, 4); // Máximo 4 dígitos
      
        if (numbers.length <= 2) {
          return numbers;
        }
      
        return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
      };

    const dimensions = getResponsiveDimensions()

    useFocusEffect(
        React.useCallback(() => {
            setActiveScreen("Calendario")
        }, [setActiveScreen]),
    )

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const eventsRef = collection(FIREBASE_DB, `events/${userId}/user_events`)

        console.log("🔍 Suscribiéndose a eventos para userId:", userId)

        const unsubscribe = onSnapshot(
            eventsRef,
            (snapshot) => {
                console.log("📦 Snapshots recibidos:", snapshot.docs.length)
                const newEvents: Event[] = []

                snapshot.docs.forEach((doc) => {
                    const data = doc.data()
                    console.log("📄 Documento:", doc.id, "Data:", data)

                    // Asegurarnos de que la fecha se convierte correctamente
                    let eventDate: Date
                    try {
                        if (data.date && typeof data.date.toDate === "function") {
                            eventDate = data.date.toDate()
                        } else if (data.date && data.date.seconds) {
                            eventDate = new Date(data.date.seconds * 1000)
                        } else {
                            console.warn("❌ Fecha inválida, usando fecha actual:", data.date)
                            eventDate = new Date()
                        }
                    } catch (error) {
                        console.error("❌ Error convirtiendo fecha:", error)
                        eventDate = new Date()
                    }

                    newEvents.push({
                        id: doc.id,
                        titulo: data.titulo || "Sin título",
                        description: data.description || "",
                        date: eventDate,
                        type: data.type || "other",
                        time: data.time || "",
                    })
                })

                console.log("✅ Eventos procesados:", newEvents.length)
                setEvents(newEvents)
                setLoading(false)
            },
            (error) => {
                console.error("❌ Error fetching events:", error)
                setLoading(false)
                Alert.alert("Error", "No se pudieron cargar los eventos")
            },
        )

        return () => {
            console.log("🔴 Desuscribiéndose de eventos")
            unsubscribe()
        }
    }, [userId])

    // 👈 Añadir useEffect para debuggear
    useEffect(() => {
        console.log("Eventos cargados:", events.length)
        events.forEach((event) => {
            console.log("Evento:", event.titulo, event.date)
        })
    }, [events])

    const getCurrentMonthEvents = () => {
        const currentMonthEvents = events.filter(
            (event) =>
                event.date.getMonth() === currentDate.getMonth() && event.date.getFullYear() === currentDate.getFullYear(),
        )
        console.log("📅 Eventos del mes actual:", currentMonthEvents.length)
        return currentMonthEvents
    }

    const getEventsForDate = (date: number) => {
        const eventsForDate = getCurrentMonthEvents().filter((event) => {
            const eventDay = event.date.getDate()
            const matches = eventDay === date
            if (matches) {
                console.log("📌 Evento encontrado para día", date, ":", event.titulo)
            }
            return matches
        })
        console.log("🔍 Eventos para día", date, ":", eventsForDate.length)
        return eventsForDate
    }

    const getEventTypeInfo = (type: string) => {
        return eventTypes.find((t) => t.key === type) || eventTypes[4]
    }

    const renderCalendarDays = () => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const firstDayOfMonth = new Date(year, month, 1).getDay()
        const today = new Date()
        const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year

        const days = []

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <View
                    key={`empty-${i}`}
                    style={[styles.calendarDay, { width: dimensions.calendarCellSize, height: dimensions.calendarCellSize }]}
                />,
            )
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = getEventsForDate(day)
            const isToday = isCurrentMonth && today.getDate() === day
            const hasEvents = dayEvents.length > 0

            days.push(
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.calendarDay,
                        { width: dimensions.calendarCellSize, height: dimensions.calendarCellSize },
                        isToday && styles.todayCell,
                    ]}
                    onPress={() => handleDayPress(day)} 
                    activeOpacity={0.7} // 👈 OPCIONAL: para efecto de press
                >
                    <Text style={[styles.dayNumber, { fontSize: dimensions.subtituloFontSize }, isToday && styles.todayText]}>
                        {day}
                    </Text>
                    {hasEvents && (
                        <View style={styles.eventIndicator}>
                            <View style={[styles.eventDot, { backgroundColor: getEventTypeInfo(dayEvents[0].type).color }]} />
                            {dayEvents.length > 1 && <Text style={styles.eventCount}>+{dayEvents.length - 1}</Text>}
                        </View>
                    )}
                </TouchableOpacity>,
            )
        }

        return days
    }

    const navigateMonth = (direction: "prev" | "next") => {
        const newDate = new Date(currentDate)
        if (direction === "prev") {
            newDate.setMonth(newDate.getMonth() - 1)
        } else {
            newDate.setMonth(newDate.getMonth() + 1)
        }
        setCurrentDate(newDate)
    }

    const saveEvent = async () => {
        if (!eventTitle.trim() || !selectedDate || !userId) {
            Alert.alert("Error", "Por favor ingresa un título para el evento")
            return
        }

        try {
            const eventData = {
                titulo: eventTitle.trim(),
                description: eventDescription.trim(),
                date: Timestamp.fromDate(selectedDate),
                type: eventType,
                time: eventTime.trim(),
                updatedAt: Timestamp.now(),
            }

            if (editingEvent) {
                // Actualizar evento existente
                const eventRef = doc(FIREBASE_DB, `events/${userId}/user_events`, editingEvent.id)
                await updateDoc(eventRef, eventData)
                Toast.show({
                    type: "success",
                    text1: "Evento actualizado",
                    text2: "Tu evento se ha actualizado correctamente ✅",
                })
            } else {
                // Crear nuevo evento
                const eventsRef = collection(FIREBASE_DB, `events/${userId}/user_events`)
                await addDoc(eventsRef, {
                    ...eventData,
                    createdAt: Timestamp.now(),
                })
                Toast.show({
                    type: "success",
                    text1: "Evento guardado",
                    text2: "Tu evento se ha guardado correctamente ✅",
                })
            }

            // No cerramos el modal automáticamente, solo reseteamos el formulario
            setModalVisible(false)

            // Recargar eventos del día
            if (selectedDate) {
                const day = selectedDate.getDate()
                const eventsForSelectedDate = getEventsForDate(day)
                setSelectedDayEvents(eventsForSelectedDate)
            }
        } catch (error) {
            console.error("Error saving event:", error)
            Alert.alert("Error", "No se pudo guardar el evento")
        }
    }

    const deleteEvent = async (eventId: string) => {
        Alert.alert("Eliminar evento", "¿Estás seguro de que quieres eliminar este evento?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        const eventRef = doc(FIREBASE_DB, `events/${userId}/user_events`, eventId)
                        await deleteDoc(eventRef)
                        Toast.show({
                            type: "success",
                            text1: "Evento eliminado",
                            text2: "Evento eliminado correctamente ✅",
                        })
                    } catch (error) {
                        console.error("Error deleting event:", error)
                        Toast.show({
                            type: "error",
                            text1: "Evento no eliminado",
                            text2: "No se pudo eliminar el evento ❌",
                        })
                    }
                },
            },
        ])
    }

    const editEvent = (event: Event) => {
        setEditingEvent(event)
        setSelectedDate(event.date)
        setEventTitle(event.titulo) // 👈 Cambiado
        setEventDescription(event.description)
        setEventType(event.type)
        setEventTime(event.time || "")
        setModalVisible(true)
    }

    const resetForm = () => {
        setEditingEvent(null)
        setSelectedDate(null)
        setEventTitle("") // 👈 Cambiado
        setEventDescription("")
        setEventType("other")
        setEventTime("")
    }

    const handleDayPress = (day: number) => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const clickedDate = new Date(year, month, day)

        // Obtener eventos para esta fecha
        const eventsForDate = getEventsForDate(day)

        setSelectedDate(clickedDate)
        setSelectedDayEvents(eventsForDate) // 👈 Asegúrate de tener este estado

        if (eventsForDate.length > 0) {
            // Si hay eventos, pre-cargamos el primero para editar
            const firstEvent = eventsForDate[0]
            setEditingEvent(firstEvent)
            setEventTitle(firstEvent.titulo)
            setEventDescription(firstEvent.description)
            setEventType(firstEvent.type)
            setEventTime(firstEvent.time || "")
        } else {
            // Si no hay eventos, reseteamos el formulario
            setEditingEvent(null)
            setEventTitle("")
            setEventDescription("")
            setEventType("other")
            setEventTime("")
        }

        setModalVisible(true)
    }
    const getUpcomingEvents = () => {
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        const upcoming = events
            .filter((event) => {
                const eventDate = new Date(event.date)
                eventDate.setHours(0, 0, 0, 0)
                const isUpcoming = eventDate >= now
                if (isUpcoming) {
                    console.log("⏰ Evento próximo:", event.titulo, eventDate)
                }
                return isUpcoming
            })
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 5)

        console.log("🚀 Eventos próximos totales:", upcoming.length)
        return upcoming
    }

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { padding: dimensions.padding }]}>
                <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1e40af" />
                    <Text style={[styles.loadingText, { fontSize: dimensions.subtituloFontSize }]}>Cargando calendario...</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={[styles.container, { padding: dimensions.padding }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

            {/* Header */}
            <View style={[styles.header, { marginBottom: dimensions.spacing }]}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={[styles.headerTitle, { fontSize: dimensions.headerFontSize }]}>Calendario</Text>
                        <Text style={[styles.headerSubtitle, { fontSize: dimensions.subtituloFontSize }]}>
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            setSelectedDate(new Date())
                            setModalVisible(true)
                            resetForm()
                        }}
                    >
                        <Ionicons name="add" size={dimensions.iconSize} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {/* Calendar Navigation */}
                <View style={[styles.calendarHeader, { marginBottom: dimensions.spacing }]}>
                    <TouchableOpacity onPress={() => navigateMonth("prev")} style={styles.navButton}>
                        <Ionicons name="chevron-back" size={dimensions.iconSize} color="#64748b" />
                    </TouchableOpacity>
                    <Text style={[styles.monthTitle, { fontSize: dimensions.subtituloFontSize + 2 }]}>
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </Text>
                    <TouchableOpacity onPress={() => navigateMonth("next")} style={styles.navButton}>
                        <Ionicons name="chevron-forward" size={dimensions.iconSize} color="#64748b" />
                    </TouchableOpacity>
                </View>

                {/* Calendar Grid */}
                <View style={[styles.calendarContainer, { marginBottom: dimensions.spacing }]}>
                    {/* Days of week header */}
                    <View style={styles.weekHeader}>
                        {["D", "L", "M", "M", "J", "V", "S"].map((day, index) => (
                            <View key={index} style={[styles.weekDay, { width: dimensions.calendarCellSize }]}>
                                <Text style={[styles.weekDayText, { fontSize: dimensions.subtituloFontSize - 2 }]}>{day}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Calendar days */}
                    <View style={styles.calendarGrid}>{renderCalendarDays()}</View>
                </View>

                {/* Upcoming Events */}
                <View style={styles.eventsSection}>
                    <Text style={[styles.sectionTitle, { fontSize: dimensions.subtituloFontSize + 4 }]}>Próximos Eventos</Text>
                    {getUpcomingEvents().length === 0 ? (
                        <View style={styles.emptyEvents}>
                            <Ionicons name="calendar-outline" size={48} color="#94a3b8" />
                            <Text style={[styles.emptyEventsText, { fontSize: dimensions.subtituloFontSize }]}>
                                No tienes eventos próximos
                            </Text>
                        </View>
                    ) : (
                        getUpcomingEvents().map((event) => {
                            const typeInfo = getEventTypeInfo(event.type)
                            return (
                                <TouchableOpacity key={event.id} style={styles.eventCard} onPress={() => editEvent(event)}>
                                    <View style={styles.eventCardContent}>
                                        <View style={[styles.eventTypeIndicator, { backgroundColor: typeInfo.color }]} />
                                        <View style={styles.eventInfo}>
                                            <Text style={[styles.eventTitle, { fontSize: dimensions.subtituloFontSize + 1 }]}>
                                                {event.titulo}
                                            </Text>
                                            <Text style={[styles.eventDate, { fontSize: dimensions.subtituloFontSize - 1 }]}>
                                                {event.date.getDate()} de {monthNames[event.date.getMonth()]}
                                                {event.time && ` • ${event.time}`}
                                            </Text>
                                            {event.description && (
                                                <Text style={[styles.eventDescription, { fontSize: dimensions.subtituloFontSize - 1 }]}>
                                                    {event.description}
                                                </Text>
                                            )}
                                        </View>
                                        <TouchableOpacity onPress={() => deleteEvent(event.id)} style={styles.deleteButton}>
                                            <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    )}
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { width: width * 0.9, maxHeight: height * 0.85 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { fontSize: dimensions.headerFontSize - 4 }]}>
                                {selectedDate
                                    ? `Eventos del ${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]}`
                                    : "Eventos"}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} >
                            {/* Lista de eventos existentes */}
                            {selectedDayEvents.length > 0 && (
                                <View style={styles.eventsContainer}>
                                    <Text style={[styles.sectionLabel, { fontSize: dimensions.subtituloFontSize }]}>
                                        Eventos existentes ({selectedDayEvents.length})
                                    </Text>

                                    {selectedDayEvents.length === 0 ? (
                                        <View style={styles.emptyState}>
                                            <Ionicons name="calendar-outline" size={40} color="#ccc" />
                                            <Text style={styles.emptyStateText}>No hay eventos para este día</Text>
                                        </View>
                                    ) : (
                                        selectedDayEvents.map((event, index) => (
                                            <View key={event.id} style={styles.eventCard}>
                                                <View style={styles.eventHeader}>
                                                    <View style={styles.eventTypeContainer}>
                                                        <Ionicons
                                                            name={getEventTypeInfo(event.type).icon as any}
                                                            size={16}
                                                            color={getEventTypeInfo(event.type).color}
                                                            style={styles.eventIcon}
                                                        />
                                                        <Text style={[styles.eventTypeText, { color: getEventTypeInfo(event.type).color }]}>
                                                            {getEventTypeInfo(event.type).label}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.eventActions}>
                                                        <TouchableOpacity
                                                            onPress={() => editEvent(event)}
                                                            style={styles.actionButton}
                                                        >
                                                            <Ionicons name="create-outline" size={18} color="#3b82f6" />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => deleteEvent(event.id)}
                                                            style={[styles.actionButton, styles.deleteButton]}
                                                        >
                                                            <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                                <View style={styles.eventContent}>
                                                    <Text style={[styles.eventTitle, { fontSize: dimensions.subtituloFontSize }]}>
                                                        {event.titulo}
                                                    </Text>

                                                    {event.description && (
                                                        <Text style={[styles.eventDescription, { fontSize: dimensions.subtituloFontSize - 1 }]}>
                                                            {event.description}
                                                        </Text>
                                                    )}

                                                    {event.time && (
                                                        <View style={styles.eventTime}>
                                                            <Ionicons name="time-outline" size={14} color="#666" />
                                                            <Text style={[styles.eventTimeText, { fontSize: dimensions.subtituloFontSize - 1 }]}>
                                                                {event.time}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>

                                                {index < selectedDayEvents.length - 1 && <View style={styles.eventSeparator} />}
                                            </View>
                                        ))
                                    )}
                                </View>
                            )}

                            {/* Formulario para nuevo evento */}
                            <View style={styles.eventsSection}>
                                <Text style={[styles.sectionLabel, { fontSize: dimensions.subtituloFontSize }]}>
                                    {selectedDayEvents.length > 0 ? "Agregar otro evento" : "Nuevo evento"}
                                </Text>

                                <TextInput
                                    style={[styles.modalInput, { fontSize: dimensions.subtituloFontSize }]}
                                    placeholder="Título del evento"
                                    value={eventTitle}
                                    onChangeText={setEventTitle}
                                    maxLength={50}
                                />

                                <TextInput
                                    style={[styles.modalTextArea, { fontSize: dimensions.subtituloFontSize }]}
                                    placeholder="Descripción (opcional)"
                                    value={eventDescription}
                                    onChangeText={setEventDescription}
                                    multiline
                                    numberOfLines={3}
                                    maxLength={200}
                                />

                                <TextInput
                                    style={[
                                        styles.modalInput,
                                        { fontSize: dimensions.subtituloFontSize },
                                    ]}
                                    placeholder="Hora (ej: 14:30)"
                                    value={eventTime}
                                    keyboardType="numeric"
                                    onChangeText={(text) => {
                                        const formatted = formatTimeInput(text);
                                        setEventTime(formatted);
                                    }}
                                    maxLength={5} 
                                />
                                <Text style={[styles.sectionLabel, { fontSize: dimensions.subtituloFontSize }]}>Tipo de evento</Text>
                                <View style={styles.eventTypeGrid}>
                                    {eventTypes.map((type) => (
                                        <TouchableOpacity
                                            key={type.key}
                                            style={[
                                                styles.eventTypeOption,
                                                eventType === type.key && styles.selectedEventType,
                                                { backgroundColor: eventType === type.key ? type.color : "#f1f5f9" },
                                            ]}
                                            onPress={() => setEventType(type.key as Event["type"])}
                                        >
                                            <Ionicons
                                                name={type.icon as any}
                                                size={20}
                                                color={eventType === type.key ? "#ffffff" : type.color}
                                            />
                                            <Text
                                                style={[
                                                    styles.eventTypeText,
                                                    { fontSize: dimensions.subtituloFontSize - 2 },
                                                    eventType === type.key && styles.selectedEventTypeText,
                                                ]}
                                            >
                                                {type.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {selectedDate && (
                                    <View style={styles.selectedDateContainer}>
                                        <Text style={[styles.selectedDateText, { fontSize: dimensions.subtituloFontSize }]}>
                                            Fecha: {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]} de{" "}
                                            {selectedDate.getFullYear()}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={[styles.cancelButtonText, { fontSize: dimensions.subtituloFontSize }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, !eventTitle.trim() && styles.disabledButton]}
                                onPress={saveEvent}
                                disabled={!eventTitle.trim()}
                            >
                                <Text style={[styles.saveButtonText, { fontSize: dimensions.subtituloFontSize }]}>
                                    {editingEvent ? "Actualizar" : "Guardar"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        margin: 20,
        padding: 40,
    },
    loadingText: {
        marginTop: 16,
        color: "#64748b",
        textAlign: "center",
    },
    header: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontWeight: "700",
        color: "#1e293b",
    },
    headerSubtitle: {
        color: "#64748b",
        marginTop: 4,
    },
    addButton: {
        backgroundColor: "#1e40af",
        borderRadius: 12,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    calendarHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    navButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#f1f5f9",
    },
    monthTitle: {
        fontWeight: "600",
        color: "#1e293b",
    },
    calendarContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    weekHeader: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 12,
    },
    weekDay: {
        alignItems: "center",
        justifyContent: "center",
        height: 30,
    },
    weekDayText: {
        fontWeight: "600",
        color: "#64748b",
    },
    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
    },
    calendarDay: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        borderRadius: 8,
        position: "relative",
    },
    todayCell: {
        backgroundColor: "#1e40af",
    },
    dayNumber: {
        fontWeight: "500",
        color: "#1e293b",
    },
    todayText: {
        color: "#ffffff",
        fontWeight: "700",
    },
    eventIndicator: {
        position: "absolute",
        bottom: 2,
        flexDirection: "row",
        alignItems: "center",
    },
    eventDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    eventCount: {
        fontSize: 10,
        color: "#64748b",
        marginLeft: 2,
        fontWeight: "500",
    },
    eventsSection: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontWeight: "700",
        color: "#1e293b",
        marginBottom: 16,
    },
    emptyEvents: {
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyEventsText: {
        color: "#64748b",
        marginTop: 12,
        textAlign: "center",
    },

    eventCardContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    eventTypeIndicator: {
        width: 4,
        height: 40,
        borderRadius: 2,
        marginRight: 12,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitle: {
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 4,
    },
    eventDate: {
        color: "#64748b",
        marginBottom: 4,
    },
    eventDescription: {
        color: "#64748b",
        lineHeight: 18,
    },
    deleteButton: {
        padding: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 24,
        maxHeight: height * 0.8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontWeight: "700",
        color: "#1e293b",
    },
    modalInput: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        backgroundColor: "#f8fafc",
        color: "#1e293b",
    },
    modalTextArea: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        backgroundColor: "#f8fafc",
        color: "#1e293b",
        textAlignVertical: "top",
        minHeight: 80,
    },
    eventTypeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 20,
    },
    eventTypeOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    selectedEventType: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },

    selectedEventTypeText: {
        color: "#ffffff",
    },
    selectedDateContainer: {
        backgroundColor: "#f1f5f9",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    selectedDateText: {
        color: "#1e293b",
        fontWeight: "500",
        textAlign: "center",
    },
    modalActions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#f1f5f9",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#64748b",
        fontWeight: "600",
    },
    saveButton: {
        flex: 1,
        backgroundColor: "#1e40af",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#94a3b8",
    },
    saveButtonText: {
        color: "#ffffff",
        fontWeight: "600",
    },
    eventsContainer: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    sectionLabel: {
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    eventCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    eventTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventIcon: {
        marginRight: 6,
    },
    eventTypeText: {
        fontWeight: '600',
        fontSize: 14,
    },
    eventActions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 6,
        marginLeft: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },

    eventContent: {
        // Contenido del evento
    },


    eventTime: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventTimeText: {
        marginLeft: 6,
        color: '#666',
    },
    eventSeparator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyStateText: {
        marginTop: 12,
        color: '#999',
        fontSize: 16,
    },

})
