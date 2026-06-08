import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { useTheme } from "@/src/contexts/TemaContext";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ModalPermisos } from "@/components/ui/modalPermisos";
import { FolderListSkeleton } from "@/components/ui/skeleton";
import { ArchivoItem, Carpeta, useCarpeta } from "./hooks/carpeta.hook";
import { Header } from "./components/Header";
import { CreateFolderModal } from "./components/CrearCarpeta";
import { RenameModal } from "./components/RenombrarCarpeta";
import { FileActionModal } from "./components/ArchivoModal";
import { FolderActionModal } from "./components/CarpetaModal";
import { FabMenu } from "./components/FabMenu";
import { UploadProgress } from "./components/UploadProgress";
import { styles } from "./styles/carpeta.styles";
import { FileItem } from "./components/ArchivoItem";
import { useAuth } from "@/src/contexts/AuthContext";


export default function CarpetaScreen({ padreId, path: pathProp }: any) {
    const {
        carpetas,
        archivos,
        loading,
        crearCarpeta,
        editarCarpeta,
        eliminarCarpeta,
        handleUploadFile,
        handleCancelUpload,
        cargarContenido,
        eliminarArchivo,
        renombrarArchivo,
        uploading,
        progress,
        actionModal,
        setActionModal,
        verificarPermisos,
        pedirPermisosNecesarios,
    } = useCarpeta(padreId);

    const router = useRouter();
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const { isGuest } = useAuth();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isRenameVisible, setRenameVisible] = useState(false);
    const [renameName, setRenameName] = useState("");
    const [renameFolder, setRenameFolder] = useState<Carpeta | null>(null);
    const [renameFile, setRenameFile] = useState<ArchivoItem | null>(null);
    const [fileActionVisible, setFileActionVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState<ArchivoItem | null>(null);
    const [isFabMenuVisible, setFabMenuVisible] = useState(false);
    const [modalPermisosVisible, setModalPermisosVisible] = useState(false);

    useEffect(() => {
        cargarContenido();
    }, [cargarContenido]);

    useEffect(() => {
        async function verificar() {
            const { almacenamiento } = await verificarPermisos();
            if (!almacenamiento) setModalPermisosVisible(true);
        }
        verificar();
    }, [padreId]);

    const combinedData = useMemo(() => {
        const c = carpetas.map((f) => ({ ...f, type: "folder" }));
        const a = archivos.map((f) => ({ ...f, type: "file" }));
        return [...c, ...a];
    }, [carpetas, archivos]);

    const path = useMemo(() => {
        if (!pathProp) return [];
        if (Array.isArray(pathProp)) return pathProp;
        try {
            return JSON.parse(pathProp);
        } catch {
            return [];
        }
    }, [pathProp]);

    const handleBack = () => {
        if (path && path.length > 1) {
            const newPath = [...path];
            newPath.pop();
            const previousFolder = newPath[newPath.length - 1];
            router.replace({
                pathname: "/(tabs)/carpeta",
                params: {
                    padreId: previousFolder?.id ?? "",
                    path: JSON.stringify(newPath),
                },
            });
        } else {
            router.replace("/(tabs)/carpeta");
        }
    };

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                handleBack();
                return true;
            };
            const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () => {
                subscription.remove();
            };
        }, [path])
    );

    const renderItem = ({ item }: any) => (
        <FileItem
            item={item}
            colors={colors}
            onPress={() => {
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
            }}
            onLongPress={() => {
                if (item.type === "folder") {
                    setActionModal({ visible: true, carpetaId: item.id, carpetaNombre: item.nombre });
                    setRenameFolder(item);
                    setRenameName(item.nombre);
                } else {
                    setSelectedFile(item);
                    setRenameName(item.nombre);
                    setFileActionVisible(true);
                }
            }}
        />
    );

    return (
        <View style={[styles.screen, { backgroundColor: colors.background }]}>
            <Header path={path} colors={colors} insets={insets} onBack={handleBack} />

            {loading ? (
                <FolderListSkeleton count={6} />
            ) : (
                <FlatList
                    data={combinedData}
                    keyExtractor={(i) => i.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}

            {uploading && (
                <UploadProgress
                    progress={progress}
                    colors={colors}
                    onCancel={handleCancelUpload}
                />
            )}

            <FabMenu
                visible={isFabMenuVisible}
                padreId={padreId}
                colors={colors}
                insets={insets}
                onToggle={() => setFabMenuVisible(!isFabMenuVisible)}
                onCreateFolder={() => {
                    if (isGuest) {
                        Alert.alert("No permitido", "Los invitados no pueden crear carpetas. Por favor, inicia sesión.");
                        return;
                    }
                    setModalVisible(true);
                    setFabMenuVisible(false);
                }}
                onUpload={() => {
                    if (isGuest) {
                        Alert.alert("No permitido", "Los invitados no pueden subir archivos. Por favor, inicia sesión.");
                        return;
                    }
                    handleUploadFile();
                    setFabMenuVisible(false);
                }}
            />

            {/* ── Modales ── */}
            <CreateFolderModal
                visible={isModalVisible}
                colors={colors}
                onClose={() => setModalVisible(false)}
                onCreate={async (name) => {
                    await crearCarpeta(name);
                }}
            />

            <RenameModal
                visible={isRenameVisible}
                isFile={!!renameFile}
                initialName={renameName}
                onClose={() => {
                    setRenameVisible(false);
                    setRenameFolder(null);
                    setRenameFile(null);
                }}
                onSave={async (name) => {
                    if (renameFolder) await editarCarpeta(renameFolder.id, name);
                    if (renameFile) await renombrarArchivo(renameFile.id, name);
                    setRenameVisible(false);
                    setRenameFolder(null);
                    setRenameFile(null);
                }}
            />

            <FolderActionModal
                visible={actionModal.visible}
                carpetaNombre={actionModal.carpetaNombre}
                onClose={() => setActionModal({ visible: false, carpetaId: null, carpetaNombre: "" })}
                onRename={() => {
                    setRenameVisible(true);
                    setActionModal({ visible: false, carpetaId: null, carpetaNombre: "" });
                }}
                onDelete={() => {
                    Alert.alert(
                        "Eliminar carpeta",
                        "¿Estás seguro de que deseas eliminar esta carpeta?",
                        [
                            { text: "Cancelar", style: "cancel" },
                            {
                                text: "Eliminar",
                                style: "destructive",
                                onPress: async () => {
                                    if (actionModal.carpetaId) await eliminarCarpeta(actionModal.carpetaId);
                                    setActionModal({ visible: false, carpetaId: null, carpetaNombre: "" });
                                },
                            },
                        ]
                    );
                }}
            />

            <FileActionModal
                visible={fileActionVisible}
                fileName={selectedFile?.nombre ?? ""}
                onClose={() => {
                    setFileActionVisible(false);
                    setSelectedFile(null);
                }}
                onRename={() => {
                    setRenameFile(selectedFile);
                    setRenameName(selectedFile?.nombre ?? "");
                    setRenameVisible(true);
                    setFileActionVisible(false);
                }}
                onDelete={() => {
                    Alert.alert(
                        "Eliminar archivo",
                        "¿Estás seguro de que deseas eliminar este archivo?",
                        [
                            { text: "Cancelar", style: "cancel" },
                            {
                                text: "Eliminar",
                                style: "destructive",
                                onPress: async () => {
                                    if (selectedFile) {
                                        await eliminarArchivo(selectedFile.id, selectedFile.nombre);
                                        await cargarContenido();
                                    }
                                    setFileActionVisible(false);
                                    setSelectedFile(null);
                                },
                            },
                        ]
                    );
                }}
            />

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

