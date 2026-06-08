/** Modal Crear Carpeta */
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";
import { BaseModal } from "./BaseModal";


export function CreateFolderModal({
    visible,
    colors,
    onClose,
    onCreate,
}: {
    visible: boolean;
    colors: any;
    onClose: () => void;
    onCreate: (name: string) => void;
}) {
    const [name, setName] = useState("");

    return (
        <BaseModal visible={visible} onClose={onClose}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>Nueva carpeta</Text>

                <TextInput
                    style={[styles.textInput, { color: colors.foreground }]}
                    placeholder="Nombre de la carpeta"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={setName}
                />

                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        onPress={() => {
                            onCreate(name);
                            setName("");
                            onClose();
                        }}
                        activeOpacity={0.9}
                        style={[styles.modalBtn, styles.btnBlue]}
                    >
                        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                        <Text style={styles.btnWhiteText}> Crear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        activeOpacity={0.9}
                        style={[styles.modalBtn, styles.btnRed]}
                    >
                        <Ionicons name="close-circle-outline" size={22} color="white" />
                        <Text style={styles.btnWhiteText}> Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        padding: 24,
        borderRadius: 16,
        shadowOpacity: 0.25,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,
        backgroundColor: "#fff",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 16,
    },
    modalTitleDark: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 16,
        color: "#111827",
    },
    modalButtons: {
        flexDirection: "row",
        gap: 12,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        marginBottom: 16,
    },
    textInputDark: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
        color: "#111827",
        fontSize: 15,
    },
    btnBlue: {
        backgroundColor: "#2563EB",
    },
    btnBlueLight: {
        backgroundColor: "#dbeafe",
    },
    btnRed: {
        backgroundColor: "#DC2626",
    },
    btnRedLight: {
        backgroundColor: "#fee2e2",
    },
    btnWhiteText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
});