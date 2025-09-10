import { getAuth } from "firebase/auth"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { useState } from "react"
import {
    Alert,
    StyleSheet,
    TextInput,
    View,
    Modal,
    TouchableOpacity,
    Text,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native"
import { FIREBASE_DB } from "../../../services/FirebaseConfig"
import Toast from "react-native-toast-message"
import { Ionicons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")

export default function ImprovedAgregarNota() {
    const [modalVisible, setModalVisible] = useState(false)
    const [titulo, setTitulo] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [loading, setLoading] = useState(false)

    const crearNota = async () => {
        if (titulo.trim() === "") {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Por favor, ingresa un título.",
            })
            return
        }

        if (descripcion.trim() === "") {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Por favor, ingresa una descripción.",
            })
            return
        }

        setLoading(true)
        const auth = getAuth()
        const user = auth.currentUser

        if (!user) {
            Alert.alert("Error", "No se encontró un usuario autenticado.")
            setLoading(false)
            return
        }

        try {
            const userTodosRef = collection(FIREBASE_DB, `todos/${user.uid}/user_todos`)

            await addDoc(userTodosRef, {
                titulo,
                descripcion,
                completado: false,
                creado: serverTimestamp(),
            })

            setTitulo("")
            setDescripcion("")
            setModalVisible(false)

            Toast.show({
                type: "success",
                text1: "Nota guardada",
                text2: "Tu nota se agregó correctamente ✅",
            })
        } catch (error) {
            console.error("Error al agregar la nota:", error)
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo guardar la nota",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
                <Ionicons name="add" size={20} color="#ffffff" />
                <Text style={styles.addButtonText}>Agregar nota</Text>
            </TouchableOpacity>

            {/* Modal permanece igual */}
            <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View style={styles.modalContainer}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Nueva Nota</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color="#6b7280" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputContainer}>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="document-text-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.titleInput}
                                        placeholder="Título de la nota"
                                        placeholderTextColor="#9ca3af"
                                        value={titulo}
                                        onChangeText={setTitulo}
                                        editable={!loading}
                                    />
                                </View>

                                <View style={styles.inputWrapper}>
                                    <Ionicons name="create-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.descriptionInput}
                                        placeholder="Descripción de la nota..."
                                        placeholderTextColor="#9ca3af"
                                        value={descripcion}
                                        onChangeText={setDescripcion}
                                        editable={!loading}
                                        multiline
                                        numberOfLines={6}
                                        textAlignVertical="top"
                                    />
                                </View>
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    style={styles.cancelButton}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={crearNota}
                                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                                    disabled={loading}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.saveButtonContent}>
                                        {loading && (
                                            <Ionicons name="hourglass-outline" size={16} color="#ffffff" style={styles.loadingIcon} />
                                        )}
                                        <Text style={styles.saveButtonText}>{loading ? "Guardando..." : "Guardar Nota"}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: width * 0.04,
        marginVertical: width * 0.02,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e40af",
        borderRadius: width * 0.03,
        paddingVertical: width * 0.035,
        paddingHorizontal: width * 0.05,
        shadowColor: "#1e40af",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    addButtonText: {
        fontSize: width * 0.04,
        fontWeight: "600",
        color: "#ffffff",
        marginLeft: width * 0.02,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: width * 0.04,
    },
    modalContainer: {
        width: "100%",
        maxWidth: width * 0.9,
        backgroundColor: "#ffffff",
        borderRadius: width * 0.04,
        maxHeight: height * 0.8,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: width * 0.05,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    modalTitle: {
        fontSize: width * 0.05,
        fontWeight: "700",
        color: "#1f2937",
    },
    closeButton: {
        padding: width * 0.02,
        borderRadius: width * 0.02,
        backgroundColor: "#f3f4f6",
    },
    inputContainer: {
        padding: width * 0.05,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#f9fafb",
        borderRadius: width * 0.03,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: width * 0.04,
        paddingHorizontal: width * 0.04,
        paddingVertical: width * 0.03,
    },
    inputIcon: {
        marginRight: width * 0.03,
        marginTop: width * 0.005,
    },
    titleInput: {
        flex: 1,
        fontSize: width * 0.04,
        color: "#1f2937",
        padding: 0,
    },
    descriptionInput: {
        flex: 1,
        fontSize: width * 0.038,
        color: "#1f2937",
        minHeight: height * 0.12,
        padding: 0,
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: width * 0.05,
        paddingBottom: width * 0.05,
        gap: width * 0.03,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        borderRadius: width * 0.03,
        paddingVertical: width * 0.035,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#d1d5db",
    },
    cancelButtonText: {
        fontSize: width * 0.04,
        fontWeight: "600",
        color: "#4b5563",
    },
    saveButton: {
        flex: 1,
        backgroundColor: "#1e40af",
        borderRadius: width * 0.03,
        paddingVertical: width * 0.035,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#1e40af",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    saveButtonDisabled: {
        backgroundColor: "#9ca3af",
        shadowOpacity: 0,
        elevation: 0,
    },
    saveButtonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    loadingIcon: {
        marginRight: width * 0.02,
    },
    saveButtonText: {
        fontSize: width * 0.04,
        fontWeight: "600",
        color: "#ffffff",
    },
})
