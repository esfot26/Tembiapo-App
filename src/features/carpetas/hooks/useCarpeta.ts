import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import { ArchivoItem, Carpeta } from "../types";
import { usePermisos } from "@/src/hooks/usePermisos";
import { useArchivos } from "./useArchivos";
import { useCarpetas } from "./useCarpetas";
import { useContenido } from "./useContenido";
import { useSubida } from "./useSubida";

export function useCarpeta(parentId: string | null) {
    const { pedirPermisosNecesarios, verificarPermisos, estadoPermisos } = usePermisos();

    const [isModalVisible, setModalVisible] = useState(false);
    const [newFolder, setNewFolder] = useState("");
    const [isFabMenuVisible, setFabMenuVisible] = useState(false);

    // Contenido (fetch + estado compartido)
    const { carpetas, setCarpetas, archivos, setArchivos, loading, cargarContenido } =
        useContenido(parentId);

    // CRUD carpetas
    const { crearCarpeta, editarCarpeta, eliminarCarpeta, actionModal, setActionModal } =
        useCarpetas(parentId, carpetas, setCarpetas);

    // CRUD archivos
    const { eliminarArchivo, renombrarArchivo } = useArchivos(archivos, setArchivos);

    // Subida
    const { progress, uploading, subirArchivo, handleUploadFile, handleCancelUpload } =
        useSubida(parentId, cargarContenido, pedirPermisosNecesarios);

    // Pedir permisos al montar / cambiar carpeta
    useEffect(() => {
        async function checkPerms() {
            const ok = await pedirPermisosNecesarios();
            if (!ok) {
                Toast.show({ type: "error", text1: "Permisos requeridos", text2: "La app necesita acceso al almacenamiento." });
            }
        }
        checkPerms();
    }, [parentId]);

    return {
        // Estado
        carpetas,
        archivos,
        loading,

        // Contenido
        cargarContenido,

        // Carpetas
        crearCarpeta,
        editarCarpeta,
        eliminarCarpeta,

        // Archivos
        eliminarArchivo,
        renombrarArchivo,

        // Subida
        subirArchivo,
        handleUploadFile,
        handleCancelUpload,
        progress,
        uploading,

        // UI state
        isModalVisible,
        setModalVisible,
        newFolder,
        setNewFolder,
        isFabMenuVisible,
        setFabMenuVisible,
        actionModal,
        setActionModal,

        // Permisos
        verificarPermisos,
        pedirPermisosNecesarios,
    };
}

export type { Carpeta, ArchivoItem };
