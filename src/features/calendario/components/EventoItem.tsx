import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Evento } from "../types";
import { tiposEventos } from "../calendarContants";


interface Props {
    evento: Evento;
    colors: any;
    theme: string;
    onPress: (ev: Evento) => void;
    onDelete: (ev: Evento) => void;
    isGuest: boolean;
}

export const EventoItem = ({ evento, colors, theme, onPress, onDelete, isGuest }: Props) => {
    const info = tiposEventos.find((t) => t.key === evento.tipo);

    return (
        <TouchableOpacity
            onPress={() => !isGuest && onPress(evento)}
            activeOpacity={isGuest ? 1 : 0.8}
            disabled={isGuest}
            style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: theme === "dark" ? colors.secondary : "#eef2ff",
                borderRadius: 16,
                padding: 10,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: isGuest ? 0.7 : 1,
            }}
        >
            <View style={{
                width: 5, height: 40, borderRadius: 4,
                marginRight: 10,
                backgroundColor: info?.color || colors.primary,
            }} />

            <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15 }}>
                    {evento.titulo}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2, gap: 6 }}>
                    {evento.hora && (
                        <View style={{
                            paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999,
                            backgroundColor: theme === "dark" ? "rgba(148,163,184,0.2)" : "#e0f2fe",
                        }}>
                            <Text style={{ fontSize: 11, color: colors.foreground }}>{evento.hora}</Text>
                        </View>
                    )}
                    {info && (
                        <View style={{
                            paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999,
                            backgroundColor: info.color + "33",
                        }}>
                            <Text style={{ fontSize: 11, color: info.color, fontWeight: "500" }}>
                                {info.label}
                            </Text>
                        </View>
                    )}
                    {evento.notificar && (
                        <Ionicons name="notifications-outline" size={16} color={colors.primary} />
                    )}
                </View>

                {evento.descripcion ? (
                    <Text numberOfLines={2} style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 4 }}>
                        {evento.descripcion}
                    </Text>
                ) : null}
            </View>

            <TouchableOpacity 
                onPress={() => onDelete(evento)} 
                activeOpacity={0.7}
                disabled={isGuest}
            >
                <Ionicons 
                    name="trash-outline" 
                    size={18} 
                    color={isGuest ? colors.mutedForeground : colors.destructive} 
                    style={{ opacity: isGuest ? 0.5 : 1 }}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};