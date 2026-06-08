import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Nota } from "@/src/services/NotasServices";
import { AccionesNota } from "./botonesAccion";
import { categoriaIcon, prioridadIcon } from "../constants/notasContants";
import { useTheme } from "@/src/contexts/TemaContext";
import { getStyles } from "../styles/notas.styles"; // Ajusta la ruta

interface NotaItemProps {
    item: Nota;
    onToggleCompleted: (nota: Nota) => void;
    onDelete: (notaId: string) => void;
}

const NotaItemComponent = ({ item, onToggleCompleted, onDelete }: NotaItemProps) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    return (
        <Animated.View
            entering={FadeInUp.duration(200)}
            exiting={FadeOutDown.duration(200)}
            style={styles.containerPrincipal} 
        >
            <View style={{ flex: 1, paddingRight: 12 }}>
                {/* Cabecera: Checkbox y Título */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() => onToggleCompleted(item)}
                        activeOpacity={0.8}
                        style={{ marginRight: 8 }}
                    >
                        <Ionicons
                            name={item.completado ? "checkmark-circle" : "checkmark-circle-outline"}
                            size={22}
                            color={item.completado ? colors.primary : colors.mutedForeground}
                        />
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.texto, // Mueve el estilo inline de tu texto aquí
                            item.completado && { color: colors.mutedForeground, textDecorationLine: "line-through" }
                        ]}
                    >
                        {item.titulo}
                    </Text>
                </View>

                {/* Descripción */}
                <Text
                    style={[
                        styles.texto, // Mueve el estilo inline de tu descripción aquí
                        item.completado && { textDecorationLine: "line-through" }
                    ]}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                >
                    {item.descripcion}
                </Text>

                {/* Badges (Categoría, Prioridad, Fecha) */}
                <View style={styles.categoriaContainer}>
                    <View style={styles.badgeContainer}>
                        <Ionicons name={categoriaIcon[item.categoria] || "pricetag-outline"} size={16} color={colors.primary} />
                        <Text style={styles.texto}>{item.categoria}</Text>
                    </View>
                    <View style={styles.badgeContainer}>
                        <Ionicons name={prioridadIcon[item.prioridad] || "options-outline"} size={16} color={colors.primary} />
                        <Text style={styles.texto}>{item.prioridad}</Text>
                    </View>
                    <View style={styles.badgeContainer}>
                        <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                        <Text style={styles.texto}>{item.fechaCreacion.toDate().toLocaleDateString()}</Text>
                    </View>
                </View>
            </View>

            {/* Botones de acción */}
            <AccionesNota item={item} onDelete={onDelete} />
        </Animated.View>
    );
};

// Usamos memo para evitar re-renderizados innecesarios en la lista
export const NotaItem = memo(NotaItemComponent);