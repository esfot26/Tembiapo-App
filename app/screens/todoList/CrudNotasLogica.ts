// src/features/notas/hooks/useTodo.ts
import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";

interface Todo {
    id: string;
    titulo: string;
    descripcion: string;
    completado: boolean;
    categoria: string;
    prioridad: 'baja' | 'media' | 'alta';
    fechaCreacion: Date;
}

interface UseTodoArgs {
    todo: Todo;
    toggleComplete: (id: string) => void;
    handleDelete: (id: string) => void;
    handleEdit: (id: string, nuevoTitulo: string, nuevoDescripcion: string) => void;
}

export const CrudNotasLogica = ({ todo, toggleComplete, handleDelete, handleEdit }: UseTodoArgs) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevoTitulo, setNuevoTitulo] = useState(todo.titulo);
    const [nuevaDescripcion, setNuevaDescripcion] = useState(todo.descripcion);

    // Sincronizar estados con el todo actual al cambiar
    useEffect(() => {
        setNuevoTitulo(todo.titulo);
        setNuevaDescripcion(todo.descripcion);
    }, [todo]);

    // Función para confirmar eliminación
    const confirmarEliminacion = () => {
        Toast.show({
            type: "info",
            text1: "¿Eliminar tarea?",
            text2: "¿Estás seguro de que quieres eliminar esta tarea?",
            visibilityTime: 5000,
        });
    };

    // Función para guardar cambios en la tarea
    const manejarGuardarEdicion = () => {
        if (!nuevoTitulo.trim()) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "El título no puede estar vacío ❌",
            });
            return;
        }
        handleEdit(todo.id, nuevoTitulo.trim(), nuevaDescripcion.trim());
        setModalVisible(false);
        Toast.show({
            type: "success",
            text1: "Éxito",
            text2: "Tarea actualizada correctamente ✅",
        });
    };

    // Función para obtener color de prioridad
    const obtenerColorPrioridad = (prioridad: 'baja' | 'media' | 'alta') => {
        switch (prioridad) {
            case 'alta': return '#ef4444';
            case 'media': return '#f59e0b';
            case 'baja': return '#10b981';
            default: return '#6b7280';
        }
    };

    return {
        modalVisible,
        setModalVisible,
        nuevoTitulo,
        setNuevoTitulo,
        nuevaDescripcion,
        setNuevaDescripcion,
        toggleComplete,
        confirmarEliminacion,
        manejarGuardarEdicion,
        obtenerColorPrioridad,
    };
};