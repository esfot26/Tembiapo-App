import { useState, useEffect } from "react"
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../services/FirebaseConfig"
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore"
import AgregarNota from "./AgregarNota"
import { useActiveScreen } from "../../contexts/ActiveScreenContext"



const { width, height } = Dimensions.get("window")

interface Note {
    id: string
    titulo: string
    descripcion: string
    completado: boolean
}

export default function ListaNotas() {
    const [todos, setTodos] = useState<Note[]>([])
    const [loading, setLoading] = useState(true)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [editingTodo, setEditingTodo] = useState<Note | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")

    const user = FIREBASE_AUTH.currentUser
    const userId = user ? user.uid : null

    const getResponsiveDimensions = () => {
        const isSmallScreen = width < 350
        const isMediumScreen = width >= 350 && width < 400

        return {
            padding: isSmallScreen ? 12 : isMediumScreen ? 16 : 18,
            headerFontSize: isSmallScreen ? 22 : isMediumScreen ? 24 : 28,
            subtitleFontSize: isSmallScreen ? 14 : 16,
            iconSize: isSmallScreen ? 20 : 24,
            spacing: isSmallScreen ? 12 : 16,
        }
    }

    const dimensions = getResponsiveDimensions()
    const { setActiveScreen } = useActiveScreen()


    useEffect(() => {
        setActiveScreen("ListaNotas")
    }, [])

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const todosRef = collection(FIREBASE_DB, `todos/${userId}/user_todos`)

        const unsubscribe = onSnapshot(
            todosRef,
            (snapshot) => {
                const newTodos: Note[] = []
                snapshot.docs.forEach((doc) => {
                    const data = doc.data()
                    newTodos.push({
                        id: doc.id,
                        titulo: data.titulo,
                        descripcion: data.descripcion,
                        completado: data.completado,
                    })
                })
                setTodos(newTodos)
                setLoading(false)
            },
            (error) => {
                console.error("Error fetching todos:", error)
                setLoading(false)
            },
        )

        return () => unsubscribe()
    }, [userId])

    const toggleComplete = async (id: string) => {
        const todoRef = doc(FIREBASE_DB, `todos/${userId}/user_todos`, id)
        const todo = todos.find((t) => t.id === id)
        if (todo) {
            await updateDoc(todoRef, { completado: !todo.completado })
        }
    }

    const handleDelete = async (id: string) => {
        Alert.alert("Eliminar nota", "¿Estás seguro de que quieres eliminar esta nota?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    const todoRef = doc(FIREBASE_DB, `todos/${userId}/user_todos`, id)
                    await deleteDoc(todoRef)
                },
            },
        ])
    }

    const handleEdit = async (id: string, nuevoTitulo: string, nuevoDescripcion: string) => {
        try {
            const todoRef = doc(FIREBASE_DB, `todos/${userId}/user_todos`, id)
            await updateDoc(todoRef, {
                titulo: nuevoTitulo,
                descripcion: nuevoDescripcion,
            })
        } catch (error) {
            console.error("Error al actualizar la nota:", error)
        }
    }

    const openEditModal = (todo: Note) => {
        setEditingTodo(todo)
        setEditTitle(todo.titulo)
        setEditDescription(todo.descripcion)
        setEditModalVisible(true)
    }

    const saveEdit = async () => {
        if (editingTodo && editTitle.trim()) {
            await handleEdit(editingTodo.id, editTitle.trim(), editDescription.trim())
            setEditModalVisible(false)
            setEditingTodo(null)
            setEditTitle("")
            setEditDescription("")
        }
    }

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { padding: dimensions.padding }]}>
                <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1e40af" />
                    <Text style={[styles.loadingText, { fontSize: dimensions.subtitleFontSize }]}>Cargando tus notas...</Text>
                </View>
            </SafeAreaView>
        )
    }

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#94a3b8" />
            <Text style={[styles.emptyTitle, { fontSize: dimensions.headerFontSize - 4 }]}>No tienes notas aún</Text>
            <Text style={[styles.emptySubtitle, { fontSize: dimensions.subtitleFontSize }]}>
                Crea tu primera nota para comenzar a organizar tus ideas
            </Text>
        </View>
    )

    return (
        <SafeAreaView style={[styles.container, { padding: dimensions.padding }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

            <View style={[styles.header, { marginBottom: dimensions.spacing }]}>
                <View style={styles.headerContent}>
                    <Text style={[styles.headerTitle, { fontSize: dimensions.headerFontSize }]}>Mis Notas</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { fontSize: dimensions.subtitleFontSize + 2 }]}>{todos.length}</Text>
                            <Text style={[styles.statLabel, { fontSize: dimensions.subtitleFontSize - 2 }]}>Total</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { fontSize: dimensions.subtitleFontSize + 2 }]}>
                                {todos.filter((t) => t.completado).length}
                            </Text>
                            <Text style={[styles.statLabel, { fontSize: dimensions.subtitleFontSize - 2 }]}>Completadas</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={[styles.addNoteContainer, { marginBottom: dimensions.spacing }]}>
                <AgregarNota />
            </View>

            <FlatList
                data={todos}
                extraData={todos}
                renderItem={({ item }) => (
                    <View style={[styles.todoItemContainer, { marginBottom: dimensions.spacing }]}>
                        <View style={styles.todoCard}>
                            <View style={styles.todoHeader}>
                                <View style={styles.todoTitleContainer}>
                                    <TouchableOpacity onPress={() => toggleComplete(item.id)}>
                                        <Ionicons
                                            name={item.completado ? "checkmark-circle" : "ellipse-outline"}
                                            size={dimensions.iconSize}
                                            color={item.completado ? "#10b981" : "#94a3b8"}
                                        />
                                    </TouchableOpacity>
                                    <Text
                                        style={[
                                            styles.todoTitle,
                                            { fontSize: dimensions.subtitleFontSize + 2 },
                                            item.completado && styles.completedTitle,
                                        ]}
                                    >
                                        {item.titulo}
                                    </Text>
                                </View>
                                <View style={styles.todoActions}>
                                    <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                                        <Ionicons name="create-outline" size={dimensions.iconSize - 2} color="#64748b" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                                        <Ionicons name="trash-outline" size={dimensions.iconSize - 2} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text
                                style={[
                                    styles.todoDescription,
                                    { fontSize: dimensions.subtitleFontSize },
                                    item.completado && styles.completedDescription,
                                ]}
                            >
                                {item.descripcion}
                            </Text>

                            <View style={styles.todoFooter}>
                                <View style={[styles.statusBadge, item.completado ? styles.completedBadge : styles.pendingBadge]}>
                                    <Text
                                        style={[
                                            styles.statusText,
                                            { fontSize: dimensions.subtitleFontSize - 2 },
                                            item.completado ? styles.completedStatusText : styles.pendingStatusText,
                                        ]}
                                    >
                                        {item.completado ? "Completado" : "Pendiente"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={todos.length === 0 ? styles.emptyListContainer : undefined}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { width: width * 0.9 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { fontSize: dimensions.headerFontSize - 4 }]}>Editar Nota</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={[styles.modalInput, { fontSize: dimensions.subtitleFontSize }]}
                            placeholder="Título de la nota"
                            value={editTitle}
                            onChangeText={setEditTitle}
                            maxLength={50}
                        />

                        <TextInput
                            style={[styles.modalTextArea, { fontSize: dimensions.subtitleFontSize }]}
                            placeholder="Descripción (opcional)"
                            value={editDescription}
                            onChangeText={setEditDescription}
                            multiline
                            numberOfLines={4}
                            maxLength={200}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                                <Text style={[styles.cancelButtonText, { fontSize: dimensions.subtitleFontSize }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={saveEdit} disabled={!editTitle.trim()}>
                                <Text style={[styles.saveButtonText, { fontSize: dimensions.subtitleFontSize }]}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",

    },
    header: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginTop:35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontWeight: "700",
        color: "#1e293b",
        flex: 1,
    },
    statsContainer: {
        flexDirection: "row",
        gap: 16,
    },
    statItem: {
        alignItems: "center",
        backgroundColor: "#f1f5f9",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        minWidth: 60,

    },
    statNumber: {
        fontWeight: "700",
        color: "#1e40af",
    },
    statLabel: {
        color: "#64748b",
        marginTop: 2,
    },
    addNoteContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    list: {
        flex: 1,
    },
    todoItemContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#f1f5f9",
    },
    todoCard: {
        padding: 14,
    },
    todoHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    todoTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginRight: 12,
    },
    todoTitle: {
        fontWeight: "600",
        color: "#1e293b",
        marginLeft: 12,
        flex: 1,
    },
    completedTitle: {
        textDecorationLine: "line-through",
        color: "#64748b",
    },
    todoActions: {
        flexDirection: "row",
        gap: 12,
    },
    actionButton: {
        padding: 4,
    },
    todoDescription: {
        color: "#64748b",
        lineHeight: 20,
        marginBottom: 12,
        marginLeft: 36,
    },
    completedDescription: {
        textDecorationLine: "line-through",
        color: "#94a3b8",
    },
    todoFooter: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    completedBadge: {
        backgroundColor: "#dcfce7",
    },
    pendingBadge: {
        backgroundColor: "#fef3c7",
    },
    statusText: {
        fontWeight: "500",
    },
    completedStatusText: {
        color: "#166534",
    },
    pendingStatusText: {
        color: "#92400e",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        margin: 20,
        padding: 40,
    },
    loadingText: {
        marginTop: 16,
        color: "#64748b",
        textAlign: "center",
    },
    emptyListContainer: {
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    emptyTitle: {
        fontWeight: "600",
        color: "#374151",
        marginTop: 16,
        textAlign: "center",
    },
    emptySubtitle: {
        color: "#6b7280",
        textAlign: "center",
        marginTop: 8,
        lineHeight: 22,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontWeight: "700",
        color: "#1e293b",
    },
    modalInput: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        backgroundColor: "#f8fafc",
        color: "#1e293b",
    },
    modalTextArea: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        backgroundColor: "#f8fafc",
        color: "#1e293b",
        textAlignVertical: "top",
        minHeight: 100,
    },
    modalActions: {
        flexDirection: "row",
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#f1f5f9",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#64748b",
        fontWeight: "600",
    },
    saveButton: {
        flex: 1,
        backgroundColor: "#1e40af",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#ffffff",
        fontWeight: "600",
    },
})
function setActiveScreen(arg0: string) {
    throw new Error("Function not implemented.")
}

