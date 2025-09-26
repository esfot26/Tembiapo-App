import { useState, useEffect } from "react"
import {
    View,
    TextInput,
    TouchableOpacity,
    Modal,
    Text,

} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Ionicons } from "@expo/vector-icons"
import Toast from "react-native-toast-message"
import { styles, screenWidth } from "./CrudNotas.styles"
import { CrudNotasLogica } from "./CrudNotasLogica"


interface Todo {
    id: string
    titulo: string
    descripcion: string
    completado: boolean
    categoria: string
    prioridad: 'baja' | 'media' | 'alta'
    fechaCreacion: Date
}

interface TodoProps {
    todo: Todo
    toggleComplete: (id: string) => void
    handleDelete: (id: string) => void
    handleEdit: (id: string, nuevoTitulo: string, nuevoDescripcion: string) => void
}

type EstadoFiltro = "todos" | "completados" | "pendientes"
type CategoriaFiltro = "todas" | string

export default function Todo({ todo, toggleComplete, handleDelete, handleEdit }: TodoProps) {
    const {
        modalVisible,
        setModalVisible,
        nuevoTitulo,
        setNuevoTitulo,
        nuevaDescripcion,
        setNuevaDescripcion,
        confirmarEliminacion,
        manejarGuardarEdicion,
        obtenerColorPrioridad,
    } = CrudNotasLogica({ todo, toggleComplete, handleDelete, handleEdit });

    const [busqueda, setBusqueda] = useState("")
    const [filtroEstado, setFiltroEstado] = useState<EstadoFiltro>("todos")
    const [filtroCategoria, setFiltroCategoria] = useState<CategoriaFiltro>("todas")
    const [orden, setOrden] = useState<"fecha" | "titulo">("fecha")
    const [categoriasUnicas, setCategoriasUnicas] = useState<string[]>([])



    // Función para obtener color de prioridad


    return (
        <View style={[styles.card, todo.completado && styles.completedCard]}>
            {/* Botón para marcar como completado */}
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

            {/* Contenido de la tarjeta */}
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, todo.completado && styles.completedText]} numberOfLines={2}>
                    {todo.titulo}
                </Text>
                <Text style={[styles.cardDescription, todo.completado && styles.completedText]} numberOfLines={3}>
                    {todo.descripcion}
                </Text>
                {/* Indicador de prioridad */}
                <View style={[styles.priorityBadge, { backgroundColor: obtenerColorPrioridad(todo.prioridad) }]} />
            </View>

            {/* Botones de acción */}
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.actionButton, styles.editButton]}>
                    <MaterialCommunityIcons name="pencil-outline" size={screenWidth * 0.055} color="#1e40af" />
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmarEliminacion} style={[styles.actionButton, styles.deleteButton]}>
                    <MaterialCommunityIcons name="trash-can-outline" size={screenWidth * 0.055} color="#dc2626" />
                </TouchableOpacity>
            </View>

            {/* Modal de edición */}
            <Modal animationType="slide" transparent visible={modalVisible}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { width: screenWidth * 0.9 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar Tarea</Text>
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
                                placeholder="Ingresa el título de la tarea"
                                placeholderTextColor="#9ca3af"
                            />

                            <Text style={styles.inputLabel}>Descripción</Text>
                            <TextInput
                                style={[styles.modalInput, styles.modalTextarea]}
                                placeholder="Ingresa la descripción de la tarea"
                                placeholderTextColor="#9ca3af"
                                value={nuevaDescripcion}
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
                            <TouchableOpacity onPress={manejarGuardarEdicion} style={[styles.modalButton, styles.saveButton]}>
                                <Text style={styles.saveText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

