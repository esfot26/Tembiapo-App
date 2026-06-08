import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { BaseModal } from "./BaseModal";
import { Ionicons } from "@expo/vector-icons";

export function FileActionModal({
    visible,
    fileName,
    onClose,
    onRename,
    onDelete,
}: {
    visible: boolean;
    fileName: string;
    onClose: () => void;
    onRename: () => void;
    onDelete: () => void;
}) {
    const handleRename = () => {
        onClose();
        setTimeout(onRename, 100);
    };

    const handleDelete = () => {
        onClose();
        setTimeout(onDelete, 100);
    };

    return (
        <BaseModal visible={visible} onClose={onClose}>
            <View style={styles.modalContent}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="middle"
                    style={styles.modalTitle}
                >
                    {fileName}
                </Text>

                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        onPress={handleRename}
                        activeOpacity={0.75}
                        style={[styles.modalBtn, styles.btnBlueLight]}
                    >
                        <Ionicons name="create-outline" size={20} color="#2563EB" />
                        <Text style={styles.btnBlueText}>Renombrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleDelete}
                        activeOpacity={0.75}
                        style={[styles.modalBtn, styles.btnRedLight]}
                    >
                        <Ionicons name="trash-outline" size={20} color="#DC2626" />
                        <Text style={styles.btnRedText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        padding: 20,
        borderRadius: 20,
        backgroundColor: "#fff",
        elevation: 10,
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
    },
    modalTitle: {
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 16,
        color: "#111827",
    },
    modalButtons: {
        flexDirection: "row",
        gap: 10,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    btnBlueLight: { backgroundColor: "#dbeafe" },
    btnRedLight: { backgroundColor: "#fee2e2" },
    btnBlueText: { color: "#1d4ed8", fontWeight: "600", fontSize: 14 },
    btnRedText: { color: "#b91c1c", fontWeight: "600", fontSize: 14 },
});