import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    View,
    FlatList,
    BackHandler,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/TemaContext";
import { ModalPermisos } from "@/components/ui/modalPermisos";
import { FolderListSkeleton } from "@/components/ui/skeleton";

import { ArchivoItem, Carpeta, useCarpeta } from "./hooks/useCarpeta";

import { UploadProgress } from "./components/UploadProgress";
import { FabMenu } from "./components/FabMenu";
import { CarpetaItem } from "./CarpetaItem";
import { S } from "./carpeta.styles";
import { CarpetaHeader } from "./CarpetaHeader";
import { ModalAcciones } from "./ModalAcciones";
import { ModalNombre } from "./ModalNombre";


type PathEntry = { id: string; name: string };
type CombinedItem =
    | (Carpeta & { type: "folder" })
    | (ArchivoItem & { type: "file" });

export default function CarpetaScreen({ padreId, path }: { padreId: string | null; path: PathEntry[] }) {
    const { colors } = useTheme();
    const router = useRouter();

    const {
        carpetas,
        archivos,
        loading,
        cargarContenido,
        crearCarpeta,
        editarCarpeta,
        eliminarCarpeta,
        eliminarArchivo,
        renombrarArchivo,
        handleUploadFile,
        handleCancelUpload,
        uploading,
        progress,
        actionModal,
        setActionModal,
        verificarPermisos,
        pedirPermisosNecesarios,
    } = useCarpeta(padreId);

    // ─── Estado UI local ───────────────────────────────────────────────────────
    const [isFabMenuVisible, setFabMenuVisible] = useState(false);
    const [modalPermisosVisible, setModalPermisosVisible] = useState(false);

    // Modal crear carpeta
    const [modalCrearVisible, setModalCrearVisible] = useState(false);
    const [nombreNuevaCarpeta, setNombreNuevaCarpeta] = useState("");

    // Modal renombrar (carpeta o archivo)
    const [modalRenombrarVisible, setModalRenombrarVisible] = useState(false);
    const [nombreRenombrar, setNombreRenombrar] = useState("");
    const [carpetaSeleccionada, setCarpetaSeleccionada] = useState<Carpeta | null>(null);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<ArchivoItem | null>(null);

    // Modal acciones archivo
    const [modalArchivoVisible, setModalArchivoVisible] = useState(false);
    const [archivoAccion, setArchivoAccion] = useState<ArchivoItem | null>(null);

    // ─── Carga inicial + permisos ──────────────────────────────────────────────
    useEffect(() => {
        cargarContenido();
    }, [cargarContenido]);

    useEffect(() => {
        (async () => {
            const { almacenamiento } = await verificarPermisos();
            if (!almacenamiento) setModalPermisosVisible(true);
        })();
    }, [padreId]);

    // ─── Back handler Android ──────────────────────────────────────────────────
    useFocusEffect(
        useCallback(() => {
            const onBack = () => { handleBack(); return true; };
            BackHandler.addEventListener("hardwareBackPress", onBack);
            return () => BackHandler.removeEventListener("hardwareBackPress", onBack);
        }, [path])
    );

    // ─── Navegación ────────────────────────────────────────────────────────────
    const handleBack = () => {
        if (path && path.length > 1) {
            const newPath = [...path];
            newPath.pop();
            router.replace({
                pathname: "/(tabs)/carpeta",
                params: { padreId: newPath[newPath.length - 1]?.id ?? "", path: JSON.stringify(newPath) },
            });
        } else {
            router.replace("/(tabs)/carpeta");
        }
    };

    // ─── Datos combinados ──────────────────────────────────────────────────────
    const combinedData = useMemo<CombinedItem[]>(() => [
        ...carpetas.map((c) => ({ ...c, type: "folder" as const })),
        ...archivos.map((a) => ({ ...a, type: "file" as const })),
    ], [carpetas, archivos]);

    // ─── Handlers de lista ─────────────────────────────────────────────────────
    const handlePress = (item: CombinedItem) => {
        if (item.type === "folder") {
            router.push({
                pathname: "/carpeta",
                params: {
                    padreId: item.id,
                    path: JSON.stringify([...path, { id: item.id, name: item.nombre }]),
                },
            });
        } else {
            router.push({
                pathname: "/(tabs)/visor",
                params: {
                    url: item.url,
                    nombre: item.nombre,
                    mimeType: item.mimeType,
                    padreId: padreId ?? "",
                    path: JSON.stringify(path ?? []),
                },
            });
        }
    };

    const handleLongPress = (item: CombinedItem) => {
        if (item.type === "folder") {
            setActionModal({ visible: true, carpetaId: item.id, carpetaNombre: item.nombre });
            setCarpetaSeleccionada(item);
            setNombreRenombrar(item.nombre);
        } else {
            setArchivoAccion(item);
            setNombreRenombrar(item.nombre);
            setModalArchivoVisible(true);
        }
    };

    // ─── Handlers modales ──────────────────────────────────────────────────────
    const handleConfirmarCrear = async () => {
        await crearCarpeta(nombreNuevaCarpeta);
        setNombreNuevaCarpeta("");
        setModalCrearVisible(false);
    };

    const handleConfirmarRenombrar = async () => {
        if (carpetaSeleccionada) await editarCarpeta(carpetaSeleccionada.id, nombreRenombrar);
        if (archivoSeleccionado) await renombrarArchivo(archivoSeleccionado.id, nombreRenombrar);
        setModalRenombrarVisible(false);
        setCarpetaSeleccionada(null);
        setArchivoSeleccionado(null);
    };

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <View style={[S.flex1, { backgroundColor: colors.background }]}>

            <CarpetaHeader path={path} onBack={handleBack} />

            {loading ? (
                <FolderListSkeleton count={6} />
            ) : (
                <FlatList
                    data={combinedData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CarpetaItem
                            item={item}
                            onPress={handlePress}
                            onLongPress={handleLongPress}
                        />
                    )}
                    contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 14 }}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Progreso de subida */}
            {uploading && (
                <UploadProgress progress={progress} onCancel={handleCancelUpload} />
            )}

            {/* FAB */}
            <FabMenu
                visible={isFabMenuVisible}
                padreId={padreId}
                onToggle={() => setFabMenuVisible((v) => !v)}
                onCrearCarpeta={() => { setFabMenuVisible(false); setModalCrearVisible(true); }}
                onSubirArchivo={() => { setFabMenuVisible(false); handleUploadFile(); }}
            />

            {/* ── Modales ── */}

            {/* Crear carpeta */}
            <ModalNombre
                visible={modalCrearVisible}
                titulo="Nueva carpeta"
                placeholder="Nombre de la carpeta"
                value={nombreNuevaCarpeta}
                labelConfirmar="Crear"
                onChangeText={setNombreNuevaCarpeta}
                onConfirmar={handleConfirmarCrear}
                onCancelar={() => { setModalCrearVisible(false); setNombreNuevaCarpeta(""); }}
            />

            {/* Renombrar carpeta o archivo */}
            <ModalNombre
                visible={modalRenombrarVisible}
                titulo={archivoSeleccionado ? "Renombrar archivo" : "Renombrar carpeta"}
                placeholder="Nuevo nombre"
                value={nombreRenombrar}
                labelConfirmar="Guardar"
                onChangeText={setNombreRenombrar}
                onConfirmar={handleConfirmarRenombrar}
                onCancelar={() => {
                    setModalRenombrarVisible(false);
                    setCarpetaSeleccionada(null);
                    setArchivoSeleccionado(null);
                }}
            />

            {/* Acciones de carpeta (long press) */}
            <ModalAcciones
                visible={actionModal.visible}
                nombre={actionModal.carpetaNombre}
                tipoLabel="carpeta"
                onRenombrar={() => setModalRenombrarVisible(true)}
                onEliminar={async () => {
                    if (actionModal.carpetaId) await eliminarCarpeta(actionModal.carpetaId);
                }}
                onCerrar={() => setActionModal({ visible: false, carpetaId: null, carpetaNombre: "" })}
            />

            {/* Acciones de archivo (long press) */}
            <ModalAcciones
                visible={modalArchivoVisible}
                nombre={archivoAccion?.nombre ?? ""}
                tipoLabel="archivo"
                onRenombrar={() => {
                    setArchivoSeleccionado(archivoAccion);
                    setModalRenombrarVisible(true);
                }}
                onEliminar={async () => {
                    if (archivoAccion) {
                        await eliminarArchivo(archivoAccion.id, archivoAccion.nombre);
                        await cargarContenido();
                    }
                    setArchivoAccion(null);
                }}
                onCerrar={() => { setModalArchivoVisible(false); setArchivoAccion(null); }}
            />

            {/* Permisos */}
            <ModalPermisos
                visible={modalPermisosVisible}
                tipo="almacenamiento"
                onClose={() => setModalPermisosVisible(false)}
                onConceder={async () => {
                    const ok = await pedirPermisosNecesarios();
                    if (ok) setModalPermisosVisible(false);
                }}
            />
        </View>
    );
}
