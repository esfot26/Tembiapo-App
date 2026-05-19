import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Linking,
} from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/contexts/TemaContext";

export function ModalPermisos({
    visible , 
    onClose,
    onConceder,
    tipo = "almacenamiento",
}) {
    const { colors } = useTheme();

    const titulos = {
        almacenamiento: "Permiso de almacenamiento requerido",
        camara: "Permiso de cámara requerido",
        notificaciones: "Permiso de notificaciones requerido",
    };

    const textos = {
        almacenamiento:
            "Necesitamos acceso al almacenamiento para mostrar tus archivos y subir documentos.",
        camara: "Requerimos permiso de cámara para capturar imágenes o documentos.",
        notificaciones:
            "Activa las notificaciones para recibir recordatorios de tareas y eventos.",
    };

    const iconos = {
        almacenamiento: "folder-outline",
        camara: "camera-outline",
        notificaciones: "notifications-outline",
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View
                className="flex-1 justify-center items-center px-8"
                style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            >
                <Animated.View
                    entering={FadeInUp.springify()}
                    exiting={FadeOutDown}
                    className="w-full p-6 rounded-2xl"
                    style={{ backgroundColor: colors.card }}
                >
                    <View className="items-center mb-3">
                        <Ionicons
                            name={iconos[tipo]}
                            size={52}
                            color={colors.primary}
                            style={{ marginBottom: 14 }}
                        />
                        <Text
                            className="text-xl font-semibold text-center"
                            style={{ color: colors.foreground }}
                        >
                            {titulos[tipo]}
                        </Text>
                    </View>

                    <Text
                        className="text-center text-base mb-6"
                        style={{ color: colors.mutedForeground }}
                    >
                        {textos[tipo]}
                    </Text>

                    <TouchableOpacity
                        onPress={onConceder}
                        className="w-full py-3 rounded-xl mb-3"
                        style={{ backgroundColor: colors.primary }}
                    >
                        <Text
                            className="text-center text-white font-semibold"
                            style={{ fontSize: 16 }}
                        >
                            Conceder permisos
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => Linking.openSettings()}
                        className="w-full py-3 rounded-xl mb-3 border"
                        style={{ borderColor: colors.border }}
                    >
                        <Text
                            className="text-center font-semibold"
                            style={{ color: colors.foreground }}
                        >
                            Abrir Configuración del dispositivo
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose}>
                        <Text
                            className="text-center text-sm"
                            style={{ color: colors.mutedForeground }}
                        >
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}
