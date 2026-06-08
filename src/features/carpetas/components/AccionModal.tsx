import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BaseModal } from "./BaseModal";
import { Ionicons } from "@expo/vector-icons";


/** Modal acciones carpeta */
export function FolderActionModal({
    visible,
    carpetaNombre,
    onClose,
    onRename,
    onDelete,
}: {
    visible: boolean;
    carpetaNombre: string;
    onClose: () => void;
    onRename: () => void;
    onDelete: () => void;
}) {
    return (
        <BaseModal visible={visible} onClose={onClose}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitleDark}>{carpetaNombre}</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        onPress={onRename}
                        activeOpacity={0.9}
                        style={[styles.modalBtn, styles.btnBlueLight]}
                    >
                        <Ionicons name="create-outline" size={22} color="#2563EB" />
                        <Text style={styles.btnBlueText}> Renombrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onDelete}
                        activeOpacity={0.9}
                        style={[styles.modalBtn, styles.btnRedLight]}
                    >
                        <Ionicons name="trash-outline" size={22} color="#DC2626" />
                        <Text style={styles.btnRedText}> Eliminar</Text>
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
});