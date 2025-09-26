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
    ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../services/FirebaseConfig"
import { collection, onSnapshot, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore"
import { useActiveScreen } from "../../contexts/ActiveScreenContext"
import Toast from "react-native-toast-message"

const { width, height } = Dimensions.get("window")

interface Nota {
    id: string
    titulo: string
    descripcion: string
    categoria: string
    prioridad: string
    fechaVencimiento?: any
    creado: any
    completado: boolean
}

export default function ListaNotas() {
    const [todos, setTodos] = useState<Nota[]>([])
    const [loading, setLoading] = useState(true)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [addModalVisible, setAddModalVisible] = useState(false)
    const [editingTodo, setEditingTodo] = useState<Nota | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editCategoria, setEditCategoria] = useState("personal")
    const [editPrioridad, setEditPrioridad] = useState("media")
    const [newTitle, setNewTitle] = useState("")
    const [newDescription, setNewDescription] = useState("")
    const [newCategoria, setNewCategoria] = useState("personal")
    const [newPrioridad, setNewPrioridad] = useState("media")

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

    // Configuración de categorías
    const CATEGORIAS_CONFIG = {
        privado: { label: "Privado", color: "#ec4899", icon: "person-outline" },
        trabajo: { label: "Trabajo", color: "#3b82f6", icon: "briefcase-outline" },
        estudio: { label: "Estudio", color: "#10b981", icon: "school-outline" },
        otro: { label: "Otro", color: "#8b5cf6", icon: "ellipsis-horizontal-outline" }
    }

    // Configuración de prioridades
    const PRIORIDADES_CONFIG = {
        baja: { label: "Baja", color: "#10b981", icon: "trending-down-outline" },
        media: { label: "Media", color: "#f59e0b", icon: "remove-outline" },
        alta: { label: "Alta", color: "#ef4444", icon: "trending-up-outline" }
    }

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
                const newTodos: Nota[] = []
                snapshot.docs.forEach((doc) => {
                    const data = doc.data()
                    newTodos.push({
                        id: doc.id,
                        titulo: data.titulo || "",
                        descripcion: data.descripcion || "",
                        categoria: data.categoria || "personal",
                        prioridad: data.prioridad || "media",
                        fechaVencimiento: data.fechaVencimiento,
                        creado: data.creado,
                        completado: data.completado || false,
                    })
                })
                // Ordenar por fecha de creación (más recientes primero)
                newTodos.sort((a, b) => {
                    if (a.creado && b.creado) {
                        return b.creado.toDate() - a.creado.toDate()
                    }
                    return 0
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

    const handleEdit = async (id: string, nuevoTitulo: string, nuevoDescripcion: string, nuevaCategoria: string, nuevaPrioridad: string) => {
        try {
            const todoRef = doc(FIREBASE_DB, `todos/${userId}/user_todos`, id)
            await updateDoc(todoRef, {
                titulo: nuevoTitulo,
                descripcion: nuevoDescripcion,
                categoria: nuevaCategoria,
                prioridad: nuevaPrioridad,
            })
            Toast.show({ type: 'success', text1: 'Nota actualizada' })
        } catch (error) {
            console.error("Error al actualizar la nota:", error)
            Toast.show({
                type: "error",
                text1: "Error al actualizar la nota",
            });
        }
    }

    const handleAdd = async () => {
        if (!newTitle.trim() || !userId) return

        try {
            const todosRef = collection(FIREBASE_DB, `todos/${userId}/user_todos`)
            await addDoc(todosRef, {
                titulo: newTitle.trim(),
                descripcion: newDescription.trim(),
                categoria: newCategoria,
                prioridad: newPrioridad,
                completado: false,
                creado: new Date(),
            })
            setAddModalVisible(false)
            setNewTitle("")
            setNewDescription("")
            setNewCategoria("personal")
            setNewPrioridad("media")
        } catch (error) {
            console.error("Error al agregar la nota:", error)
        }
    }

    const openEditModal = (todo: Nota) => {
        setEditingTodo(todo)
        setEditTitle(todo.titulo)
        setEditDescription(todo.descripcion)
        setEditCategoria(todo.categoria)
        setEditPrioridad(todo.prioridad)
        setEditModalVisible(true)
    }

    const saveEdit = async () => {
        if (editingTodo && editTitle.trim()) {
            await handleEdit(editingTodo.id, editTitle.trim(), editDescription.trim(), editCategoria, editPrioridad)
            setEditModalVisible(false)
            setEditingTodo(null)
        }
    }

    const openAddModal = () => {
        setAddModalVisible(true)
    }

    // Formatear fecha
    const formatDate = (timestamp: any) => {
        if (!timestamp) return "Sin fecha"
        try {
            const date = timestamp.toDate()
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
        } catch (error) {
            return "Fecha inválida"
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
            <Ionicons name="document-text-outline" size={80} color="#cbd5e1" />
            <Text style={[styles.emptyTitle, { fontSize: dimensions.headerFontSize - 4 }]}>No hay notas aún</Text>
            <Text style={[styles.emptySubtitle, { fontSize: dimensions.subtitleFontSize }]}>
                Presiona el botón + para crear tu primera nota
            </Text>
        </View>
    )

    const renderTodoItem = ({ item }: { item: Nota }) => {
        const categoriaConfig = CATEGORIAS_CONFIG[item.categoria as keyof typeof CATEGORIAS_CONFIG] || CATEGORIAS_CONFIG.otro
        const prioridadConfig = PRIORIDADES_CONFIG[item.prioridad as keyof typeof PRIORIDADES_CONFIG] || PRIORIDADES_CONFIG.media

        return (
            <View style={[styles.todoItemContainer, { marginBottom: dimensions.spacing }]}>
                <View style={[
                    styles.todoCard,
                    item.completado && styles.completedCard
                ]}>
                    {/* Header con categoría y prioridad */}
                    <View style={styles.todoHeader}>
                        <View style={[styles.categoriaBadge, { backgroundColor: `${categoriaConfig.color}15` }]}>
                            <Ionicons name={categoriaConfig.icon} size={14} color={categoriaConfig.color} />
                            <Text style={[styles.categoriaText, { color: categoriaConfig.color }]}>
                                {categoriaConfig.label}
                            </Text>
                        </View>
                        <View style={[styles.prioridadBadge, { backgroundColor: `${prioridadConfig.color}15` }]}>
                            <Ionicons name={prioridadConfig.icon} size={12} color={prioridadConfig.color} />
                            <Text style={[styles.prioridadText, { color: prioridadConfig.color }]}>
                                {prioridadConfig.label}
                            </Text>
                        </View>
                    </View>

                    {/* Contenido principal */}
                    <View style={styles.todoContent}>
                        <View style={styles.todoTitleRow}>
                            <TouchableOpacity
                                onPress={() => toggleComplete(item.id)}
                                style={styles.checkboxContainer}
                            >
                                <View style={[
                                    styles.checkbox,
                                    item.completado && styles.checkboxCompleted,
                                    { borderColor: item.completado ? prioridadConfig.color : '#cbd5e1' }
                                ]}>
                                    {item.completado && (
                                        <Ionicons name="checkmark" size={14} color="#ffffff" />
                                    )}
                                </View>
                            </TouchableOpacity>
                            <Text style={[
                                styles.todoTitle,
                                { fontSize: dimensions.subtitleFontSize + 2 },
                                item.completado && styles.completedTitle
                            ]} numberOfLines={2}>
                                {item.titulo}
                            </Text>
                        </View>

                        {item.descripcion ? (
                            <Text style={[
                                styles.todoDescription,
                                { fontSize: dimensions.subtitleFontSize },
                                item.completado && styles.completedDescription
                            ]} numberOfLines={3}>
                                {item.descripcion}
                            </Text>
                        ) : null}
                    </View>

                    {/* Footer con fecha y acciones */}
                    <View style={styles.todoFooter}>
                        <View style={styles.dateContainer}>
                            <Ionicons name="calendar-outline" size={12} color="#94a3b8" />
                            <Text style={styles.dateText}>
                                {formatDate(item.creado)}
                            </Text>
                            {item.fechaVencimiento && (
                                <>
                                    <Ionicons name="arrow-forward" size={10} color="#94a3b8" style={styles.dateSeparator} />
                                    <Ionicons name="flag-outline" size={12} color="#f59e0b" />
                                    <Text style={[styles.dateText, styles.dueDateText]}>
                                        {formatDate(item.fechaVencimiento)}
                                    </Text>
                                </>
                            )}
                        </View>

                        <View style={styles.todoActions}>
                            <TouchableOpacity
                                onPress={() => openEditModal(item)}
                                style={[styles.actionButton, styles.editButton]}
                            >
                                <Ionicons name="create-outline" size={16} color="#64748b" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                                style={[styles.actionButton, styles.deleteButton]}
                            >
                                <Ionicons name="trash-outline" size={16} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Estado completado */}
                    {item.completado && (
                        <View style={styles.completedOverlay}>
                            <Ionicons name="checkmark-circle" size={32} color="#10b981" />
                        </View>
                    )}
                </View>
            </View>
        )
    }

    const renderModal = (isEdit: boolean) => {
        const title = isEdit ? "Editar nota" : "Nueva nota"
        const titleValue = isEdit ? editTitle : newTitle
        const descriptionValue = isEdit ? editDescription : newDescription
        const categoria = isEdit ? editCategoria : newCategoria
        const prioridad = isEdit ? editPrioridad : newPrioridad
        const setTitle = isEdit ? setEditTitle : setNewTitle
        const setDescription = isEdit ? setEditDescription : setNewDescription
        const setCategoria = isEdit ? setEditCategoria : setNewCategoria
        const setPrioridad = isEdit ? setEditPrioridad : setNewPrioridad
        const onSave = isEdit ? saveEdit : handleAdd
        const onClose = isEdit ? () => setEditModalVisible(false) : () => setAddModalVisible(false)

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isEdit ? editModalVisible : addModalVisible}
                onRequestClose={onClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { width: width * 0.9, maxHeight: height * 0.8 }]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, { fontSize: dimensions.headerFontSize - 4 }]}>{title}</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color="#64748b" />
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={[styles.modalInput, { fontSize: dimensions.subtitleFontSize }]}
                                placeholder="Título de la nota"
                                value={titleValue}
                                onChangeText={setTitle}
                                maxLength={50}
                                autoFocus={!isEdit}
                            />

                            <TextInput
                                style={[styles.modalTextArea, { fontSize: dimensions.subtitleFontSize }]}
                                placeholder="Descripción (opcional)"
                                value={descriptionValue}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                                maxLength={200}
                            />

                            <View style={styles.selectorContainer}>
                                <Text style={styles.selectorLabel}>Prioridad</Text>
                                <View style={styles.selectorRow}>
                                    {Object.entries(PRIORIDADES_CONFIG).map(([key, config]) => (
                                        <TouchableOpacity
                                            key={key}
                                            style={[
                                                styles.selectorOption,
                                                prioridad === key && styles.selectorOptionActive,
                                                prioridad === key && { borderColor: config.color }
                                            ]}
                                            onPress={() => setPrioridad(key)}
                                        >
                                            <Ionicons
                                                name={config.icon}
                                                size={22}
                                                color={prioridad === key ? config.color : "#64748b"}
                                            />
                                            <Text style={[
                                                styles.selectorOptionText,
                                                prioridad === key && { color: config.color }
                                            ]}>
                                                {config.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.selectorContainer}>
                                <Text style={styles.selectorLabel}>Categoría</Text>
                                <View style={styles.selectorRow}>
                                    {Object.entries(CATEGORIAS_CONFIG).map(([key, config]) => (
                                        <TouchableOpacity
                                            key={key}
                                            style={[
                                                styles.selectorOption,
                                                categoria === key && styles.selectorOptionActive,
                                                categoria === key && { borderColor: config.color }
                                            ]}
                                            onPress={() => setCategoria(key)}
                                        >
                                            <Ionicons
                                                name={config.icon}
                                                size={18}
                                                color={categoria === key ? config.color : "#64748b"}
                                            />
                                            <Text style={[
                                                styles.selectorOptionText,
                                                categoria === key && { color: config.color }
                                            ]}>
                                                {config.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={onClose}
                                >
                                    <Ionicons name="close-circle-outline" size={24} color="#ffffff" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.saveButton, !titleValue.trim() && styles.saveButtonDisabled]}
                                    onPress={onSave}
                                    disabled={!titleValue.trim()}
                                >
                                    <Ionicons
                                        name={isEdit ? "checkmark-done-circle" : "add-circle"}
                                        size={24}
                                        color="#ffffff"
                                    />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <SafeAreaView style={[styles.container, { padding: dimensions.padding }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

            {/* Header minimalista */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.headerTitle, { fontSize: dimensions.headerFontSize }]}>Notas</Text>
                    <Text style={[styles.headerSubtitle, { fontSize: dimensions.subtitleFontSize }]}>
                        {todos.filter(t => !t.completado).length} pendientes
                    </Text>
                </View>
            </View>

            {/* Lista de notas (diseño original) */}
            <FlatList
                data={todos}
                renderItem={renderTodoItem}
                keyExtractor={(item) => item.id}
                style={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={todos.length === 0 ? styles.emptyListContainer : styles.listContent}
            />

            {/* Botón flotante para agregar */}
            <TouchableOpacity style={styles.fab} onPress={openAddModal}>
                <Ionicons name="add" size={24} color="#ffffff" />
            </TouchableOpacity>

            {/* Modales */}
            {renderModal(true)}
            {renderModal(false)}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    header: {
        paddingVertical: 16,
        paddingHorizontal: 4,
        marginBottom: 8,
    },
    headerTitle: {
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: 4,
    },
    headerSubtitle: {
        color: "#6b7280",
        fontWeight: "500",
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyListContainer: {
        flexGrow: 1,
    },
    // Estilos originales de las notas
    todoItemContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
    },
    todoCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#f1f5f9",
        position: "relative",
        overflow: "hidden",
    },
    completedCard: {
        opacity: 0.8,
        backgroundColor: "#f8fafc",
    },
    todoHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    categoriaBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    categoriaText: {
        fontSize: 12,
        fontWeight: "600",
    },
    prioridadBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    prioridadText: {
        fontSize: 11,
        fontWeight: "600",
    },
    todoContent: {
        marginBottom: 12,
    },
    todoTitleRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    checkboxContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxCompleted: {
        backgroundColor: "#10b981",
    },
    todoTitle: {
        fontWeight: "600",
        color: "#1e293b",
        flex: 1,
        lineHeight: 22,
    },
    completedTitle: {
        textDecorationLine: "line-through",
        color: "#94a3b8",
    },
    todoDescription: {
        color: "#64748b",
        lineHeight: 20,
        marginLeft: 32,
    },
    completedDescription: {
        textDecorationLine: "line-through",
        color: "#94a3b8",
    },
    todoFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    dateText: {
        fontSize: 11,
        color: "#94a3b8",
        fontWeight: "500",
    },
    dateSeparator: {
        marginHorizontal: 4,
    },
    dueDateText: {
        color: "#f59e0b",
        fontWeight: "600",
    },
    todoActions: {
        flexDirection: "row",
        gap: 8,
    },
    actionButton: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: "#f8fafc",
    },
    editButton: {
        backgroundColor: "#f1f5f9",
    },
    deleteButton: {
        backgroundColor: "#fef2f2",
    },
    completedOverlay: {
        position: "absolute",
        top: 8,
        right: 8,
        opacity: 0.1,
    },
    // Botón flotante
    fab: {
        position: "absolute",
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#3b82f6",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    // Estados vacíos y loading
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    emptyTitle: {
        fontWeight: "700",
        color: "#374151",
        marginTop: 16,
        textAlign: "center",
    },
    emptySubtitle: {
        color: "#6b7280",
        textAlign: "center",
        marginTop: 8,
        lineHeight: 22,
        fontWeight: "400",
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
        fontWeight: "500",
    },
    // Modales
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
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
        fontWeight: "500",
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
        fontWeight: "400",
    },
    selectorContainer: {
        marginBottom: 20,
    },
    selectorLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    selectorRow: {
        flexDirection: "row",
        gap: 8,
    },
    selectorOption: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#e2e8f0",
        gap: 6,
    },
    selectorOptionActive: {
        backgroundColor: "#f8fafc",
    },
    selectorOptionText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#64748b",
    },
    modalActions: {
        flexDirection: "row",
        gap: 20,
        justifyContent: "center", // Centrado en lugar de flex-end
        alignItems: "center",
        marginTop: 10,
    },
    cancelButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#ef4444", // Rojo para cancelar
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    saveButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#10b981", // Verde para guardar/crear
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    saveButtonDisabled: {
        backgroundColor: "#9ca3af", // Gris cuando está deshabilitado
        shadowOpacity: 0.1,
    },
})