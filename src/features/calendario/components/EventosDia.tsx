import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Evento } from "../types";
import { EventoItem } from "./EventoItem";
import { nombreMeses } from "../calendarContants";

interface Props {
    selectedDate: Date;
    eventosDia: Evento[];
    colors: any;
    theme: string;
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
    onAgregarEvento: () => void;
    onEditarEvento: (ev: Evento) => void;
    onEliminarEvento: (ev: Evento) => void;
    isGuest: boolean;
}

export const EventosDia = ({
    selectedDate, eventosDia, colors, theme,
    fadeAnim, slideAnim,
    onAgregarEvento, onEditarEvento, onEliminarEvento, isGuest,
}: Props) => (
    <Animated.View style={{
        marginTop: 20, marginHorizontal: 8,
        backgroundColor: colors.card,
        borderRadius: 24, borderWidth: 1, borderColor: colors.border,
        padding: 16, elevation: 3,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
    }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <View>
                <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>
                    {selectedDate.getDate()} de {nombreMeses[selectedDate.getMonth()]}
                </Text>
                <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                    {eventosDia.length} evento(s)
                </Text>
            </View>
            <TouchableOpacity 
                onPress={onAgregarEvento} 
                activeOpacity={0.8} 
                disabled={isGuest}
                style={{
                    backgroundColor: isGuest ? colors.mutedForeground : colors.primary, 
                    borderRadius: 40, 
                    padding: 6, 
                    elevation: 3,
                    opacity: isGuest ? 0.5 : 1,
                }}
            >
                <Ionicons name="add" size={22} color="#fff" />
            </TouchableOpacity>
        </View>

        {eventosDia.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 14 }}>
                <Ionicons name="calendar-outline" size={32} color={colors.mutedForeground} />
                <Text style={{ color: colors.mutedForeground, marginTop: 6, fontSize: 14 }}>
                    Sin eventos para este día
                </Text>
            </View>
        ) : (
            eventosDia.map((ev) => (
                <EventoItem
                    key={ev.id}
                    evento={ev}
                    colors={colors}
                    theme={theme}
                    onPress={onEditarEvento}
                    onDelete={onEliminarEvento}
                    isGuest={isGuest}
                />
            ))
        )}
    </Animated.View>
);