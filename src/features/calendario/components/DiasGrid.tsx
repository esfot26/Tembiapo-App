import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useTheme } from "@/src/contexts/TemaContext";

import { Evento } from "../types";
import { diasSemana } from "../calendarContants";

const { width } = Dimensions.get("window");
const CELDA_ANCHO = width / 7 - 6;

interface Props {
    currentDate: Date;
    selectedDate: Date | null;
    eventos: Evento[];
    onSelectDate: (fecha: Date) => void;
}

export const DiasGrid = ({ currentDate, selectedDate, eventos, onSelectDate }: Props) => {
    const { colors, theme } = useTheme();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const diasEnMes = new Date(year, month + 1, 0).getDate();
    const primerDia = new Date(year, month, 1).getDay();
    const hoy = new Date();
    const celdas = [];

    // Celdas vacías antes del día 1
    for (let i = 0; i < primerDia; i++) {
        celdas.push(
            <View key={`empty-${i}`} style={{ width: CELDA_ANCHO, height: CELDA_ANCHO, margin: 2 }} />
        );
    }

    // Días del mes
    for (let day = 1; day <= diasEnMes; day++) {
        const fecha = new Date(year, month, day);

        const tieneEvento = eventos.some(
            (ev) =>
                ev.fecha.getDate() === day &&
                ev.fecha.getMonth() === month &&
                ev.fecha.getFullYear() === year
        );

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
                onPress={() => onSelectDate(fecha)}
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
                            ? theme === "dark" ? colors.card : "#e0f2fe"
                            : theme === "dark" ? colors.card : "#f9fafb",
                    borderColor: esSeleccionado
                        ? colors.primary
                        : tieneEvento
                            ? colors.primary
                            : colors.border,
                    elevation: 2,
                }}
            >
                <Text style={{
                    color: esSeleccionado
                        ? "#fff"
                        : theme === "dark" ? colors.primaryForeground : "#111827",
                    fontWeight: esSeleccionado ? "700" : "500",
                }}>
                    {day}
                </Text>

                {tieneEvento && !esSeleccionado && (
                    <View style={{
                        width: 6, height: 6, borderRadius: 3,
                        backgroundColor: colors.primary,
                        marginTop: 3,
                    }} />
                )}
            </TouchableOpacity>
        );
    }

    // ✅ El componente retorna JSX
    return (
        <>
            {/* Días de la semana */}
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
                marginHorizontal: 4,
                paddingHorizontal: 6,
                paddingVertical: 8,
            }}>
                {diasSemana.map((dia: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, i: React.Key | null | undefined) => (
                    <View key={i} style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{
                            fontSize: 13,
                            fontWeight: "600",
                            color: colors.foreground,
                        }}>
                            {dia}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Grid de días */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" }}>
                {celdas}
            </View>
        </>
    );
};