import React from 'react';
import { Modal, Pressable, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionModalProps {
    visible: boolean;
    onClose: () => void;
    itemName: string;
    itemType: 'carpeta' | 'archivo';
    onRename: () => void;
    onDeleteConfirm: () => void;
    colors: {
        background: string;
        foreground: string;
    };
}


export default function ActionModal({
    visible,
    onClose,
    itemName,
    itemType,
    onRename,
    onDeleteConfirm
}: ActionModalProps) {
    const handleDeletePress = () => {
        Alert.alert(
            `Eliminar ${itemType}`,
            `¿Estás seguro de que deseas eliminar est${itemType === 'carpeta' ? 'a' : 'e'} ${itemType}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: onDeleteConfirm },
            ]
        );
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable
                className="flex-1 justify-center items-center"
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                onPress={onClose}
            >
                <Pressable className="w-4/5 p-6 rounded-2xl bg-white shadow-2xl" onPress={(e) => e.stopPropagation()}>
                    <Text className="text-lg font-semibold mb-4 text-center">
                        {itemName}
                    </Text>

                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            className="flex-1 bg-blue-100 p-3 rounded-xl flex-row items-center justify-center"
                            onPress={onRename}
                        >
                            <Ionicons name="create-outline" size={22} color="#2563EB" />
                            <Text className="ml-2 text-blue-700 font-medium">Renombrar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 bg-red-100 p-3 rounded-xl flex-row items-center justify-center"
                            onPress={handleDeletePress}
                        >
                            <Ionicons name="trash-outline" size={22} color="#DC2626" />
                            <Text className="ml-2 text-red-700 font-medium">Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}