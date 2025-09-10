import { useState, useEffect } from "react"
import { View, TextInput, TouchableOpacity, Modal, Text, StyleSheet, Dimensions, Alert } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Ionicons } from "@expo/vector-icons"

const { width: screenWidth } = Dimensions.get("window")

interface Todo {
    id: string
    titulo: string
    descripcion: string
    completado: boolean
}

interface TodoProps {
    todo: Todo
    toggleComplete: (id: string) => void
    handleDelete: (id: string) => void
    handleEdit: (id: string, nuevoTitulo: string, nuevoDescripcion: string) => void
}

export default function Todo({ todo, toggleComplete, handleDelete, handleEdit }: TodoProps) {
    const [modalVisible, setModalVisible] = useState(false)
    const [nuevoTitulo, setNuevoTitulo] = useState(todo.titulo)
    const [nuevoDescripcion, setNuevaDescripcion] = useState(todo.descripcion)

    useEffect(() => {
        setNuevoTitulo(todo.titulo)
        setNuevaDescripcion(todo.descripcion)
    }, [todo])

    const confirmDelete = () => {
        Alert.alert("Eliminar Nota", "¿Estás seguro de que quieres eliminar esta nota?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Eliminar", style: "destructive", onPress: () => handleDelete(todo.id) },
        ])
    }

    const handleEditSave = () => {
        if (!nuevoTitulo.trim()) {
            Alert.alert("Error", "El título no puede estar vacío")
            return
        }
        handleEdit(todo.id, nuevoTitulo.trim(), nuevoDescripcion.trim())
        setModalVisible(false)
    }

    return (
        <View style={[styles.card, todo.completado && styles.completedCard]}>
            <TouchableOpacity
                onPress={() => toggleComplete(todo.id)}
                style={[styles.checkButton, todo.completado && styles.checkButtonCompleted]}
            >
                <Ionicons
                    name={todo.completado ? "checkmark-circle" : "checkmark-circle-outline"}
                    size={screenWidth * 0.07}
                    color={todo.completado ? "#10b981" : "#6b7280"}
                />
            </TouchableOpacity>

            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, todo.completado && styles.completedText]} numberOfLines={2}>
                    {todo.titulo}
                </Text>
                <Text style={[styles.cardDescription, todo.completado && styles.completedText]} numberOfLines={3}>
                    {todo.descripcion}
                </Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.actionButton, styles.editButton]}>
                    <MaterialCommunityIcons name="pencil-outline" size={screenWidth * 0.055} color="#1e40af" />
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmDelete} style={[styles.actionButton, styles.deleteButton]}>
                    <MaterialCommunityIcons name="trash-can-outline" size={screenWidth * 0.055} color="#dc2626" />
                </TouchableOpacity>
            </View>

            <Modal animationType="slide" transparent visible={modalVisible}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { width: screenWidth * 0.9 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar Nota</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalContent}>
                            <Text style={styles.inputLabel}>Título</Text>
                            <TextInput
                                style={styles.modalInput}
                                value={nuevoTitulo}
                                onChangeText={setNuevoTitulo}
                                placeholder="Ingresa el título de la nota"
                                placeholderTextColor="#9ca3af"
                            />

                            <Text style={styles.inputLabel}>Descripción</Text>
                            <TextInput
                                style={[styles.modalInput, styles.modalTextarea]}
                                placeholder="Ingresa la descripción de la nota"
                                placeholderTextColor="#9ca3af"
                                value={nuevoDescripcion}
                                onChangeText={setNuevaDescripcion}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={[styles.modalButton, styles.cancelButton]}
                            >
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleEditSave} style={[styles.modalButton, styles.saveButton]}>
                                <Text style={styles.saveText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "flex-start",
        padding: screenWidth * 0.04,
        backgroundColor: "white",
        borderRadius: 16,
        marginBottom: screenWidth * 0.03,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderLeftWidth: 4,
        borderLeftColor: "#1e40af",
    },
    completedCard: {
        backgroundColor: "#f9fafb",
        borderLeftColor: "#10b981",
    },
    checkButton: {
        marginRight: screenWidth * 0.03,
        marginTop: 2,
        padding: 4,
    },
    checkButtonCompleted: {
        backgroundColor: "#ecfdf5",
        borderRadius: 20,
    },
    cardContent: {
        flex: 1,
        paddingRight: screenWidth * 0.02,
    },
    cardTitle: {
        fontSize: screenWidth * 0.042,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 6,
        lineHeight: screenWidth * 0.055,
    },
    cardDescription: {
        fontSize: screenWidth * 0.035,
        color: "#6b7280",
        lineHeight: screenWidth * 0.045,
    },
    completedText: {
        textDecorationLine: "line-through",
        color: "#9ca3af",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionButton: {
        marginLeft: screenWidth * 0.02,
        padding: screenWidth * 0.02,
        borderRadius: 8,
    },
    editButton: {
        backgroundColor: "#eff6ff",
    },
    deleteButton: {
        backgroundColor: "#fef2f2",
    },

    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 0,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        maxHeight: "80%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    modalTitle: {
        fontSize: screenWidth * 0.048,
        fontWeight: "700",
        color: "#111827",
    },
    closeButton: {
        padding: 4,
    },
    modalContent: {
        padding: 24,
    },
    inputLabel: {
        fontSize: screenWidth * 0.038,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    modalInput: {
        borderWidth: 1.5,
        borderColor: "#d1d5db",
        borderRadius: 12,
        padding: 16,
        fontSize: screenWidth * 0.04,
        marginBottom: 20,
        backgroundColor: "#f9fafb",
        color: "#111827",
    },
    modalTextarea: {
        height: screenWidth * 0.3,
        textAlignVertical: "top",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 24,
        paddingBottom: 24,
        gap: 12,
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        minWidth: screenWidth * 0.2,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#f3f4f6",
        borderWidth: 1,
        borderColor: "#d1d5db",
    },
    saveButton: {
        backgroundColor: "#1e40af",
    },
    cancelText: {
        color: "#374151",
        fontSize: screenWidth * 0.038,
        fontWeight: "600",
    },
    saveText: {
        color: "#ffffff",
        fontSize: screenWidth * 0.038,
        fontWeight: "600",
    },
})
