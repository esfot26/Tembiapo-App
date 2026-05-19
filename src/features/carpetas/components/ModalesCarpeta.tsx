import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ModalesCarpeta({ modales, setModales, actionModal, setActionModal, elementoSeleccionado, colors, crearCarpeta, editarCarpeta, eliminarCarpeta, eliminarArchivo, renombrarArchivo, cargarContenido }: any) {
    const [inputValue, setInputValue] = useState("");

    // Resetear input cuando se abre un modal
    useEffect(() => {
        if (modales.crear) setInputValue("");
        if (modales.renombrar && elementoSeleccionado) setInputValue(elementoSeleccionado.nombre);
    }, [modales.crear, modales.renombrar, elementoSeleccionado]);

    const cerrarTodos = () => {
        setModales({ crear: false, renombrar: false, accionesArchivo: false });
        setActionModal({ visible: false, carpetaId: null, carpetaNombre: "" });
    };

    const handleGuardar = async () => {
        if (modales.crear) {
            await crearCarpeta(inputValue);
        } else if (modales.renombrar && elementoSeleccionado) {
            if (elementoSeleccionado.type === "folder") await editarCarpeta(elementoSeleccionado.id, inputValue);
            else await renombrarArchivo(elementoSeleccionado.id, inputValue);
        }
        cerrarTodos();
    };

    const handleEliminar = () => {
        const isFolder = elementoSeleccionado?.type === "folder" || actionModal.carpetaId;
        Alert.alert(
            `Eliminar ${isFolder ? "carpeta" : "archivo"}`,
            `¿Seguro que deseas eliminar este elemento?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar", style: "destructive",
                    onPress: async () => {
                        if (isFolder) await eliminarCarpeta(actionModal.carpetaId || elementoSeleccionado.id);
                        else {
                            await eliminarArchivo(elementoSeleccionado.id, elementoSeleccionado.nombre);
                            await cargarContenido();
                        }
                        cerrarTodos();
                    }
                }
            ]
        );
    };

    // Modal de Entrada de Texto (Crear / Renombrar)
    const isInputModalVisible = modales.crear || modales.renombrar;

    return (
        <>
            {/* Modal de Input (Crear o Renombrar) */}
            <Modal visible={isInputModalVisible} transparent animationType="fade" onRequestClose={cerrarTodos}>
                <Pressable className="flex-1 justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onPress={cerrarTodos}>
                    <Pressable className="w-4/5 p-6 rounded-2xl shadow-2xl" style={{ backgroundColor: colors.card }} onPress={(e) => e.stopPropagation()}>
                        <Text className="text-lg font-semibold mb-4 text-center" style={{ color: colors.foreground }}>
                            {modales.crear ? "Nueva carpeta" : "Renombrar"}
                        </Text>
                        <TextInput
                            style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, fontSize: 15, color: colors.foreground, marginBottom: 16 }}
                            placeholder="Escribe el nombre..."
                            placeholderTextColor={colors.mutedForeground}
                            value={inputValue}
                            onChangeText={setInputValue}
                        />
                        <View className="flex-row gap-3">
                            <TouchableOpacity className="flex-1 p-3 rounded-xl flex-row items-center justify-center" style={{ backgroundColor: colors.primary }} onPress={handleGuardar}>
                                <Text style={{ color: colors.primaryForeground, fontWeight: "600" }}>{modales.crear ? "Crear" : "Guardar"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 bg-red-500 p-3 rounded-xl flex-row items-center justify-center" onPress={cerrarTodos}>
                                <Text className="text-white font-semibold">Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Modal de Acciones (Carpeta o Archivo) */}
            <Modal visible={actionModal.visible || modales.accionesArchivo} transparent animationType="fade" onRequestClose={cerrarTodos}>
                <Pressable className="flex-1 justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onPress={cerrarTodos}>
                    <Pressable className="w-4/5 p-6 rounded-2xl shadow-2xl" style={{ backgroundColor: colors.card }}>
                        <Text className="text-lg font-semibold mb-4 text-center" style={{ color: colors.foreground }}>
                            {actionModal.carpetaNombre || elementoSeleccionado?.nombre}
                        </Text>
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                className="flex-1 p-3 rounded-xl flex-row items-center justify-center" style={{ backgroundColor: colors.muted }}
                                onPress={() => {
                                    setModales({ ...modales, renombrar: true, accionesArchivo: false });
                                    setActionModal({ ...actionModal, visible: false });
                                }}
                            >
                                <Ionicons name="create-outline" size={22} color={colors.foreground} />
                                <Text className="ml-2 font-medium" style={{ color: colors.foreground }}>Renombrar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 bg-red-100 p-3 rounded-xl flex-row items-center justify-center" onPress={handleEliminar}>
                                <Ionicons name="trash-outline" size={22} color="#DC2626" />
                                <Text className="ml-2 text-red-700 font-medium">Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}