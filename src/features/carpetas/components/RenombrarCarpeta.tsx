import React from 'react';
import { Modal, Pressable, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RenameModalProps {
    visible: boolean;
    onClose: () => void;
    renameName: string;
    setRenameName: (value: string) => void;
    onSave: () => void;
    isRenameFile: boolean;
}

export default function RenameModal({
    visible,
    onClose,
    renameName,
    setRenameName,
    onSave,
    isRenameFile
}: RenameModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable
                className="flex-1 justify-center items-center"
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                onPress={onClose}
            >
                <Pressable
                    className="w-4/5 p-6 rounded-2xl shadow-2xl bg-white"
                    onPress={(e) => e.stopPropagation()}
                >
                    <Text className="text-lg font-semibold mb-4 text-center text-gray-800">
                        {isRenameFile ? "Renombrar Archivo" : "Renombrar Carpeta"}
                    </Text>

                    <TextInput
                        placeholder="Nuevo nombre"
                        value={renameName}
                        onChangeText={setRenameName}
                        className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-800"
                        placeholderTextColor="#9CA3AF"
                    />

                    <View className="flex-row justify-between gap-3">
                        <TouchableOpacity
                            className="flex-1 bg-blue-100 p-3 rounded-xl flex-row items-center justify-center"
                            activeOpacity={0.9}
                            onPress={onSave}
                        >
                            <Ionicons name="create-outline" size={22} color="#2563EB" />
                            <Text className="ml-2 text-blue-700 font-medium">Guardar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onClose}
                            activeOpacity={0.9}
                            className="flex-1 bg-red-500 p-3 rounded-xl flex-row items-center justify-center"
                        >
                            <Ionicons name="close-circle-outline" size={22} color="white" />
                            <Text className="ml-2 text-white font-semibold">Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}