import React from 'react';
import { Modal, Pressable, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CreateFolderModalProps {
    visible: boolean;
    onClose: () => void;
    newFolder: string;
    setNewFolder: (value: string) => void;
    onCreate: () => void;
    colors: {
        background: string;
        foreground: string;
    };
}

export default function CreateFolderModal({
    visible,
    onClose,
    newFolder,
    setNewFolder,
    onCreate,
    colors
}: CreateFolderModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable
                className="flex-1 justify-center items-center"
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                onPress={onClose}
            >
                <Pressable
                    className="w-4/5 p-6 rounded-2xl shadow-2xl"
                    style={{ backgroundColor: colors.background }}
                    onPress={(e) => e.stopPropagation()}
                >
                    <Text className="text-lg font-semibold mb-4 text-center" style={{ color: colors.foreground }}>
                        Nueva carpeta
                    </Text>

                    <TextInput
                        style={{
                            borderWidth: 1, borderColor: "#d1d5db", borderRadius: 12,
                            padding: 12, fontSize: 15, color: colors.foreground, marginBottom: 10,
                        }}
                        placeholder="Nombre de la carpeta"
                        placeholderTextColor="#9ca3af"
                        value={newFolder}
                        onChangeText={setNewFolder}
                    />

                    <View className="flex-row justify-between gap-3">
                        <TouchableOpacity
                            className="flex-1 bg-blue-600 p-3 rounded-xl flex-row items-center justify-center"
                            activeOpacity={0.9}
                            onPress={onCreate}
                        >
                            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                            <Text className="text-white font-semibold ml-2">Crear</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onClose}
                            activeOpacity={0.9}
                            className="flex-1 bg-red-600 p-3 rounded-xl flex-row items-center justify-center"
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