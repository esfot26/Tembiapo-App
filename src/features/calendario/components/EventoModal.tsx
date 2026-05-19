import React, { useState } from "react";
import {
    Modal, View, Text, TextInput, TouchableOpacity,
    ScrollView, Switch, KeyboardAvoidingView, Platform, Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@/src/contexts/TemaContext";
import { tiposEventos } from "../calendarContants";
import { UseFormEventoReturn } from "../hooks/useFormEvento";

const { height } = Dimensions.get("window");

interface Props {
    visible: boolean;
    form: UseFormEventoReturn;
    selectedDate: Date | null;
    onGuardar: () => void;
    onCerrar: () => void;
}

const calcularHoraNotificacion = (hora: string, offsetMinutos: number): string => {
    const [h, m] = hora.split(":").map(Number);
    const fecha = new Date();
    fecha.setHours(h, m, 0, 0);
    fecha.setMinutes(fecha.getMinutes() - offsetMinutos);
    const hh = ("0" + fecha.getHours()).slice(-2);
    const mm = ("0" + fecha.getMinutes()).slice(-2);
    if (offsetMinutos === 0) return `Notificación a las ${hh}:${mm} (al momento del evento)`;
    if (offsetMinutos === 1440) return `Notificación el día anterior a las ${hh}:${mm}`;
    return `Notificación a las ${hh}:${mm} (${offsetMinutos} min antes)`;
};

const opcionVencida = (hora: string, offsetMinutos: number, fechaEvento: Date | null): boolean => {
    if (!hora || !fechaEvento) return false;
    const [h, m] = hora.split(":").map(Number);
    const fechaEvt = new Date(fechaEvento);
    fechaEvt.setHours(h, m, 0, 0);
    const fechaNotificacion = new Date(fechaEvt.getTime() - offsetMinutos * 60 * 1000);
    return fechaNotificacion <= new Date();
};

export const EventoModal = ({ visible, form, selectedDate, onGuardar, onCerrar }: Props) => {
    const { colors } = useTheme();
    const [showHoraPicker, setShowHoraPicker] = useState(false);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                >
                    <View style={{
                        width: "90%",
                        maxHeight: height * 0.85,
                        backgroundColor: colors.background,
                        borderRadius: 24,
                        padding: 20,
                        elevation: 5,
                    }}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >
                            {/* Título del modal */}
                            <Text style={{
                                fontSize: 18, fontWeight: "700",
                                color: colors.foreground, marginBottom: 16, textAlign: "center",
                            }}>
                                {form.editingEvento ? "Editar evento" : "Nuevo evento"}
                            </Text>

                            {/* Título */}
                            <TextInput
                                style={{
                                    borderWidth: 1, borderColor: "#d1d5db",
                                    borderRadius: 12, padding: 12, fontSize: 15,
                                    color: colors.foreground, marginBottom: 10,
                                }}
                                placeholder="Título"
                                placeholderTextColor="#9ca3af"
                                value={form.titulo}
                                onChangeText={form.setTitulo}
                            />

                            {/* Descripción */}
                            <TextInput
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                style={{
                                    borderWidth: 1, borderColor: "#d1d5db",
                                    borderRadius: 12, padding: 12, fontSize: 15,
                                    color: colors.foreground, marginBottom: 10, minHeight: 90,
                                }}
                                placeholder="Descripción (opcional)"
                                placeholderTextColor="#9ca3af"
                                value={form.descripcion}
                                onChangeText={form.setDescripcion}
                            />

                            {/* Hora */}
                            <TouchableOpacity
                                onPress={() => setShowHoraPicker(true)}
                                style={{
                                    borderWidth: 1, borderColor: "#d1d5db",
                                    borderRadius: 12, padding: 12, marginBottom: 12,
                                }}
                            >
                                <Text style={{ fontSize: 15, color: colors.foreground }}>
                                    {form.hora ? `Hora: ${form.hora}` : "Seleccionar hora"}
                                </Text>
                            </TouchableOpacity>

                            {showHoraPicker && (
                                <DateTimePicker
                                    mode="time"
                                    display="default"
                                    value={
                                        form.hora
                                            ? new Date(new Date().setHours(
                                                parseInt(form.hora.split(":")[0] || "0", 10),
                                                parseInt(form.hora.split(":")[1] || "0", 10),
                                                0, 0
                                            ))
                                            : new Date()
                                    }
                                    onChange={(_, date) => {
                                        if (date) {
                                            const h = ("0" + date.getHours()).slice(-2);
                                            const m = ("0" + date.getMinutes()).slice(-2);
                                            form.setHora(`${h}:${m}`);
                                        }
                                        setShowHoraPicker(Platform.OS === "ios");
                                    }}
                                />
                            )}

                            {/* Switch recordatorio */}
                            <View style={{
                                flexDirection: "row", alignItems: "center",
                                justifyContent: "space-between", marginBottom: 12, marginTop: 4,
                            }}>
                                <View>
                                    <Text style={{ fontSize: 15, color: colors.foreground }}>
                                        Activar recordatorio
                                    </Text>
                                    {!form.hora && (
                                        <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 2 }}>
                                            Requiere seleccionar una hora
                                        </Text>
                                    )}
                                </View>
                                <Switch
                                    value={form.notificar}
                                    onValueChange={(val) => form.setNotificar(val)}
                                />
                            </View>

                            {/* Opciones de recordatorio */}
                            {form.notificar && (
                                <View style={{
                                    marginBottom: 16,
                                    backgroundColor: colors.card,
                                    borderRadius: 16,
                                    padding: 14,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                }}>
                                    <Text style={{
                                        fontSize: 13, fontWeight: "600",
                                        color: colors.foreground, marginBottom: 10,
                                    }}>
                                        ¿Cuándo notificar?
                                    </Text>

                                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                                        {[
                                            { label: "Al momento", value: 0 },
                                            { label: "5 min antes", value: 5 },
                                            { label: "10 min antes", value: 10 },
                                            { label: "15 min antes", value: 15 },
                                            { label: "30 min antes", value: 30 },
                                            { label: "1 hora antes", value: 60 },
                                            { label: "1 día antes", value: 1440 },
                                        ].map((opt) => {
                                            const active = form.recordatorioOffset === opt.value;
                                            const vencida = opcionVencida(form.hora, opt.value, selectedDate);
                                            return (
                                                <TouchableOpacity
                                                    key={opt.value}
                                                    onPress={() => {
                                                        if (vencida) return;
                                                        form.setRecordatorioOffset(opt.value);
                                                    }}
                                                    style={{
                                                        paddingHorizontal: 12, paddingVertical: 7,
                                                        borderRadius: 999, borderWidth: 1,
                                                        borderColor: vencida ? colors.border : active ? colors.primary : colors.border,
                                                        backgroundColor: vencida ? colors.card : active ? colors.primary : colors.background,
                                                        opacity: vencida ? 0.4 : 1,
                                                    }}
                                                >
                                                    <Text style={{
                                                        fontSize: 13, fontWeight: "500",
                                                        color: vencida ? colors.mutedForeground : active ? "#fff" : colors.foreground,
                                                    }}>
                                                        {opt.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>

                                    {/* Hora calculada */}
                                    {form.hora && form.recordatorioOffset !== null && (
                                        <View style={{
                                            marginTop: 12, padding: 10,
                                            borderWidth: 1,
                                            borderColor: colors.border,
                                            backgroundColor: colors.card,
                                            borderRadius: 10,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 6,
                                        }}>
                                            <Ionicons name="notifications-outline" size={16} color={colors.foreground} />
                                            <Text style={{ fontSize: 13, color: colors.foreground, fontWeight: "500", flex: 1 }}>
                                                {calcularHoraNotificacion(form.hora, form.recordatorioOffset)}
                                            </Text>
                                        </View>
                                    )}

                                    {/* Aviso opción vencida */}
                                    {form.recordatorioOffset !== null &&
                                        opcionVencida(form.hora, form.recordatorioOffset, selectedDate) && (
                                            <View style={{
                                                marginTop: 10, padding: 10,
                                                backgroundColor: "#fef3c7",
                                                borderRadius: 10,
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 6,
                                            }}>
                                                <Ionicons name="warning-outline" size={16} color="#d97706" />
                                                <Text style={{ fontSize: 13, color: "#d97706", fontWeight: "500", flex: 1 }}>
                                                    Esta hora ya pasó. Elegí otra opción o cambiá la hora del evento.
                                                </Text>
                                            </View>
                                        )}
                                </View>
                            )}

                            {/* Tipos de eventos */}
                            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20, marginTop: 4 }}>
                                {tiposEventos.map((t) => {
                                    const active = form.tipo === t.key;
                                    return (
                                        <TouchableOpacity
                                            key={t.key}
                                            onPress={() => form.setTipo(t.key)}
                                            activeOpacity={0.8}
                                            style={{
                                                flexDirection: "row", alignItems: "center",
                                                paddingVertical: 8, paddingHorizontal: 12,
                                                borderRadius: 20, borderWidth: 1,
                                                borderColor: active ? colors.primary : "#d1d5db",
                                                backgroundColor: active ? colors.primary : "#f3f4f6",
                                            }}
                                        >
                                            <Ionicons name={t.icon as any} size={16} color={active ? "#fff" : t.color} />
                                            <Text style={{
                                                marginLeft: 6, fontSize: 13, fontWeight: "500",
                                                color: active ? "#fff" : "#374151",
                                            }}>
                                                {t.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Botones */}
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <TouchableOpacity
                                    onPress={onGuardar}
                                    activeOpacity={0.9}
                                    style={{
                                        flex: 1, backgroundColor: colors.primary,
                                        paddingVertical: 12, borderRadius: 12,
                                        alignItems: "center", justifyContent: "center",
                                        flexDirection: "row", gap: 6,
                                    }}
                                >
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                                        {form.editingEvento ? "Actualizar" : "Crear"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={onCerrar}
                                    activeOpacity={0.9}
                                    style={{
                                        flex: 1, backgroundColor: "#dc2626",
                                        paddingVertical: 12, borderRadius: 12,
                                        alignItems: "center", justifyContent: "center",
                                        flexDirection: "row", gap: 6,
                                    }}
                                >
                                    <Ionicons name="close-circle-outline" size={20} color="#fff" />
                                    <Text style={{ color: "#fff", fontWeight: "600" }}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};