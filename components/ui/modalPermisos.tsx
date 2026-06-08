import React from "react";
import { Modal, View, Text, TouchableOpacity, Linking } from "react-native";
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/contexts/TemaContext";

type TipoPermiso = "almacenamiento" | "camara" | "notificaciones";

interface Props {
    visible: boolean;
    onClose: () => void;
    onConceder: () => void;
    tipo?: TipoPermiso;
}

const CONFIG: Record<TipoPermiso, {
    badge: string;
    icono: keyof typeof Ionicons.glyphMap;
    titulo: string;
    texto: string;
}> = {
    almacenamiento: {
        badge: "Almacenamiento",
        icono: "folder-outline",
        titulo: "Acceso al almacenamiento",
        texto: "Necesitamos acceso al almacenamiento para mostrar tus archivos y subir documentos.",
    },
    camara: {
        badge: "Cámara",
        icono: "camera-outline",
        titulo: "Acceso a la cámara",
        texto: "Requerimos permiso de cámara para capturar imágenes o documentos.",
    },
    notificaciones: {
        badge: "Notificaciones",
        icono: "notifications-outline",
        titulo: "Activar notificaciones",
        texto: "Activa las notificaciones para recibir recordatorios de tareas y eventos.",
    },
};

export function ModalPermisos({ visible, onClose, onConceder, tipo = "almacenamiento" }: Props) {
    const { colors } = useTheme();
    const { badge, icono, titulo, texto } = CONFIG[tipo];

    return (
        <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
            <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(150)}
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 28,
                    backgroundColor: "rgba(0,0,0,0.55)",
                }}
            >
                <Animated.View
                    entering={SlideInDown.springify().damping(18)}
                    exiting={SlideOutDown.duration(180)}
                    style={{
                        width: "100%",
                        backgroundColor: colors.card,
                        borderRadius: 24,
                        padding: 28,
                        borderWidth: 0.5,
                        borderColor: colors.border,
                    }}
                >
                    {/* Badge */}
                    <View style={{ alignItems: "center", marginBottom: 16 }}>
                        <View style={{
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 20,
                            backgroundColor: colors.primary + "18",
                            marginBottom: 16,
                        }}>
                            <Text style={{
                                fontSize: 11,
                                fontWeight: "600",
                                letterSpacing: 0.6,
                                textTransform: "uppercase",
                                color: colors.primary,
                            }}>
                                {badge}
                            </Text>
                        </View>

                        {/* Ícono */}
                        <View style={{
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            backgroundColor: colors.primary + "15",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 16,
                        }}>
                            <Ionicons name={icono} size={30} color={colors.primary} />
                        </View>

                        <Text style={{
                            fontSize: 17,
                            fontWeight: "600",
                            color: colors.foreground,
                            textAlign: "center",
                            marginBottom: 8,
                            lineHeight: 23,
                        }}>
                            {titulo}
                        </Text>
                        <Text style={{
                            fontSize: 13,
                            color: colors.mutedForeground,
                            textAlign: "center",
                            lineHeight: 20,
                        }}>
                            {texto}
                        </Text>
                    </View>

                    {/* Divisor */}
                    <View style={{
                        height: 0.5,
                        backgroundColor: colors.border,
                        marginVertical: 20,
                    }} />

                    {/* Botón principal */}
                    <TouchableOpacity
                        onPress={onConceder}
                        activeOpacity={0.82}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            backgroundColor: colors.primary,
                            borderRadius: 14,
                            paddingVertical: 14,
                            marginBottom: 10,
                        }}
                    >
                        <Ionicons name="shield-checkmark-outline" size={18} color="#fff" />
                        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
                            Conceder permisos
                        </Text>
                    </TouchableOpacity>

                    {/* Botón secundario */}
                    <TouchableOpacity
                        onPress={() => Linking.openSettings()}
                        activeOpacity={0.7}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            borderRadius: 14,
                            paddingVertical: 13,
                            marginBottom: 14,
                            backgroundColor: colors.background,
                            borderWidth: 0.5,
                            borderColor: colors.border,
                        }}
                    >
                        <Ionicons name="settings-outline" size={16} color={colors.foreground} />
                        <Text style={{ color: colors.foreground, fontSize: 14 }}>
                            Abrir configuración
                        </Text>
                    </TouchableOpacity>

                    {/* Cancelar */}
                    <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
                        <Text style={{
                            textAlign: "center",
                            fontSize: 13,
                            color: colors.mutedForeground,
                        }}>
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}