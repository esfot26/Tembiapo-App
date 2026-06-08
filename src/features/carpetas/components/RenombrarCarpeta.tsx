import { useEffect, useState } from "react";
import { BaseModal } from "./BaseModal";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";


export function RenameModal({
    visible,
    isFile,
    initialName,
    onClose,
    onSave,
}: {
    visible: boolean;
    isFile: boolean;
    initialName: string;
    onClose: () => void;
    onSave: (name: string) => void;
}) {
    const [name, setName] = useState(initialName);

    useEffect(() => {
        if (visible) {
            setName(initialName);
        }
    }, [initialName, visible]);

    return (
        <BaseModal visible={visible} onClose={onClose}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitleDark}>
                    {isFile ? "Renombrar Archivo" : "Renombrar Carpeta"}
                </Text>

                <TextInput
                    placeholder="Nuevo nombre"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#9CA3AF"
                    style={styles.textInputDark}
                />

                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        onPress={() => onSave(name)}
                        activeOpacity={0.9}
                        style={[styles.modalBtn, styles.btnBlueLight]}
                    >
                        <Ionicons name="create-outline" size={22} color="#2563EB" />
                        <Text style={styles.btnBlueText}> Guardar</Text>
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
    btnRed: {
        backgroundColor: "#DC2626",
    },

    btnBlueLight: {
        backgroundColor: "#dbeafe",
    },
    btnRedLight: {
        backgroundColor: "#fee2e2",
    },
    btnBlueText: {
        color: "#1d4ed8",
        fontWeight: "600",
        fontSize: 14,
    },
    btnRedText: {
        color: "#b91c1c",
        fontWeight: "600",
        fontSize: 14,
    },
    btnWhiteText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
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

});