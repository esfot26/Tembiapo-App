import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Pressable,
    Alert,
    Linking,
    BackHandler,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { useTheme } from "@/src/contexts/TemaContext";
import { useCarpeta, Carpeta, ArchivoItem } from "./carpeta.hook";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ModalPermisos } from "@/components/ui/modalPermisos";
import { FolderListSkeleton } from "@/components/ui/skeleton";


export default function CarpetaScreen({ padreId, path }: any) {
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
    const [newFolder, setNewFolder] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [isRenameVisible, setRenameVisible] = useState(false);
    const [renameName, setRenameName] = useState("");
    const [renameFolder, setRenameFolder] = useState<Carpeta | null>(null);
    const [renameFile, setRenameFile] = useState<ArchivoItem | null>(null);
    const [fileActionVisible, setFileActionVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState<ArchivoItem | null>(null);
    const [isFabMenuVisible, setFabMenuVisible] = useState(false);

    const [modalPermisosVisible, setModalPermisosVisible] = useState(false);

    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        cargarContenido();
    }, [cargarContenido]);

    useEffect(() => {
        async function verificar() {
            const { almacenamiento } = await verificarPermisos();

            if (!almacenamiento) {
                setModalPermisosVisible(true);
            }
        }

        verificar();
    }, [padreId]);



    const combinedData = useMemo(() => {
        const c = carpetas.map((f) => ({ ...f, type: "folder" }));
        const a = archivos.map((f) => ({ ...f, type: "file" }));
        return [...c, ...a];
    }, [carpetas, archivos]);




    // 🔙 Función para volver a la carpeta anterior o raíz
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

            // path ya se actualiza vía router.replace, no hace falta setPath
        } else {
            // 🏠 Si ya estamos en la raíz
            router.replace("/(tabs)/carpeta");
            // path ya se actualiza vía router.replace, no hace falta setPath([]);
        }
    };

    // 🔁 Manejar el botón físico de "atrás" en Android
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                handleBack();
                return true; // evita salir de la app
            };

            // ✅ Agregar listener
            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            // 🧹 Remover correctamente al salir del foco
            return () => {
                BackHandler.addEventListener("hardwareBackPress", onBackPress);
            };
        }, [path])
    );


    /** Renderizado de ítems */
    const renderItem = ({ item }: any) => {
        const isFolder = item.type === "folder";

        return (
            <Animated.View entering={FadeInUp.delay(50)} exiting={FadeOutDown} className="px-4">
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        if (isFolder) {
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
                        if (isFolder) {
                            setActionModal({ visible: true, carpetaId: item.id, carpetaNombre: item.nombre });
                            setRenameFolder(item);
                            setRenameName(item.nombre);
                        } else {
                            setSelectedFile(item);
                            setRenameName(item.nombre);
                            setFileActionVisible(true);
                        }
                    }}
                    delayLongPress={200}
                    className="bg-white rounded-2xl p-4 my-2 flex-row items-center shadow-sm border border-gray-100"
                    style={{
                        backgroundColor: colors.background,
                        borderColor: colors.foreground,
                    }}
                >
                    <View
                        className={`w-12 h-12 rounded-xl items-center justify-center ${isFolder ? "bg-blue-100" : "bg-gray-100"
                            }`}
                        style={{ backgroundColor: colors.muted }}
                    >
                        <Ionicons
                            name={isFolder ? "folder-outline" : "document-text-outline"}
                            size={28}
                            color={isFolder ? "#2563EB" : "#6B7280"}
                        />
                    </View>

                    <View className="flex-1 ml-4" style={{ marginRight: 10 }}>
                        <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                            {item.nombre}
                        </Text>
                        <Text className="text-xs mt-1" style={{ color: colors.foreground }}>
                            {isFolder ? "Carpeta" : "Archivo"}
                        </Text>
                    </View>

                    {isFolder && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
                </TouchableOpacity>
            </Animated.View>
        );
    };


    return (
        <View className="flex-1" style={{ backgroundColor: colors.background }}>
            <View
                className="flex-row items-center justify-between px-4 py-3 border-b shadow-sm"
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >

                {path.length > 0 && (
                    <TouchableOpacity
                        onPress={handleBack}
                        className="flex-row  gap-x-2 mt-4"
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={22} color={colors.foreground} />
                        <Text
                            className="text-base font-semibold"
                            style={{ color: colors.foreground }}
                        >
                            Atrás
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Título centrado */}
                <View className="flex-1 p-2 gap-20 mt-4 " >
                    <Text
                        numberOfLines={1}
                        className="text-xl font-bold"
                        style={{ color: colors.foreground }}
                    >
                        {path.length === 0 ? "Mis carpetas" : path[path.length - 1].name}
                    </Text>
                </View>

                {/* Espaciador para centrar el título cuando no hay botón atrás */}
                {path.length === 0 && <View style={{ width: 50 }} />}
            </View>

            {/* Contenido principal */}
            {loading ? (
                <FolderListSkeleton count={6} />
            ) : (
                <FlatList
                    data={combinedData}
                    keyExtractor={(i) => i.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 12 }}
                />
            )}


            {uploading && (
                <Animated.View
                    entering={FadeInUp.springify()}
                    exiting={FadeOutDown}
                    style={{ position: "absolute", bottom: 110, left: 16, right: 16, zIndex: 200, alignSelf: "center" }}
                >
                    <Card className="border shadow-lg rounded-3xl" style={{ backgroundColor: colors.card }}>
                        <CardHeader className="pb-1">
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ color: colors.foreground, fontWeight: "700" }}>
                                    Subiendo archivo
                                </Text>
                                <Text style={{ color: colors.mutedForeground, fontWeight: "600" }}>{Math.round(progress)}%</Text>
                            </View>
                        </CardHeader>
                        <CardContent>
                            <Progress value={progress} className="h-2 rounded-full" />
                            <View style={{ marginTop: 8, flexDirection: "row", justifyContent: "flex-end" }}>
                                <TouchableOpacity onPress={handleCancelUpload} activeOpacity={0.8} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}>
                                    <Text style={{ color: colors.foreground, fontWeight: "600", fontSize: 12 }}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </CardContent>
                    </Card>
                </Animated.View>
            )}

            {/* FAB */}
            <View className="items-center" style={{ position: "absolute", right: 16, bottom: insets.bottom + Math.max(88, Math.floor(Dimensions.get('window').height * 0.08)) }} >
                {/* Menú expandido */}
                {isFabMenuVisible && (
                    <Animated.View
                        entering={FadeInUp.springify()}
                        exiting={FadeOutDown}
                        className="mb-4 space-y-3"
                    >
                        {/* 📁 Crear carpeta */}
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            className="bg-white w-14 h-14 rounded-full justify-center items-center shadow-lg border border-gray-200"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="folder-open-outline" size={26} color="#4B5563" />
                        </TouchableOpacity>

                        {/* ☁️ Subir archivo (solo si estamos dentro de una carpeta) */}
                        {padreId && (
                            <TouchableOpacity
                                onPress={handleUploadFile}
                                className="bg-white w-14 h-14 rounded-full justify-center items-center shadow-lg border border-gray-200"
                                activeOpacity={0.8}
                            >
                                <Ionicons name="cloud-upload-outline" size={26} color="#2563EB" />
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                )}

                {/* ➕ Botón principal */}
                <TouchableOpacity
                    onPress={() => setFabMenuVisible(!isFabMenuVisible)}
                    className="w-16 h-16 rounded-full justify-center items-center shadow-3xl"
                    style={{
                        backgroundColor: colors.primary,
                        shadowColor: "#000",
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 6,
                    }}
                    activeOpacity={0.9}
                >
                    <Ionicons
                        name={isFabMenuVisible ? "close" : "add"}
                        size={32}
                        color={colors.primaryForeground}
                    />
                </TouchableOpacity>
            </View>

            {/* Modal Crear Carpeta */}
            <Modal visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
                style={{
                    justifyContent: 'center', alignItems: 'center',
                    backgroundColor: colors.background,
                }}
            >
                <Pressable
                    className="flex-1 justify-center items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                    onPress={() => setModalVisible(false)} // Cierra al tocar fuera
                >
                    <Pressable
                        className="w-4/5 p-6 rounded-2xl shadow-2xl"
                        style={{ backgroundColor: colors.background, }}
                        onPress={(e) => e.stopPropagation()} // 🔹 evita cerrar al tocar dentro
                    >
                        <Text className="text-lg font-semibold mb-4 text-center"
                            style={{ color: colors.foreground, }}
                        >

                            Nueva carpeta
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: "#d1d5db",
                                borderRadius: 12,
                                padding: 12,
                                fontSize: 15,
                                color: colors.foreground,
                                marginBottom: 10,
                            }}
                            placeholder="Nombre de la carpeta"
                            placeholderTextColor="#9ca3af"
                            value={newFolder}
                            onChangeText={setNewFolder}
                        />

                        <View className="flex-row justify-between gap-3">
                            <TouchableOpacity
                                className="flex-1 bg-blue-600 p-3 rounded-xl flex-row items-center justify-center"
                                onPress={async () => {
                                    await crearCarpeta(newFolder);
                                    setNewFolder("");
                                    setModalVisible(false);
                                }}
                                activeOpacity={0.9}

                            >
                                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                                <Text className="text-white font-semibold">Crear</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                activeOpacity={0.9}
                                className="flex-1 bg-red-600 p-3 rounded-xl flex-row items-center justify-center"
                            >
                                <Ionicons name="close-circle-outline" size={22} color="white" />
                                <Text className="ml-2 text-white font-semibold">Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Modal Renombrar Carpeta */}
            <Modal
                visible={isRenameVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setRenameVisible(false)} // 🔹 soporte para Android “back”
            >
                {/* Fondo oscuro */}
                <Pressable
                    className="flex-1 justify-center items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                    onPress={() => setRenameVisible(false)} // 🔹 Toca fuera para cerrar
                >
                    {/* Contenedor del modal */}
                    <Pressable
                        className="w-4/5 p-6 rounded-2xl shadow-2xl"
                        style={{ backgroundColor: "white" }}
                        onPress={(e) => e.stopPropagation()} // 🔹 evita cerrar al tocar dentro
                    >
                        <Text className="text-lg font-semibold mb-4 text-center text-gray-800">
                            {renameFile ? "Renombrar Archivo" : "Renombrar Carpeta"}
                        </Text>

                        <TextInput
                            placeholder="Nuevo nombre"
                            value={renameName}
                            onChangeText={setRenameName}
                            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-800"
                            placeholderTextColor="#9CA3AF"
                        />

                        {/* Botones de acción */}
                        <View className="flex-row justify-between gap-3">
                            {/* Guardar */}
                            <TouchableOpacity
                                className="flex-1 bg-blue-100 p-3 rounded-xl flex-row items-center justify-center"
                                onPress={async () => {
                                    if (renameFolder) await editarCarpeta(renameFolder.id, renameName);
                                    if (renameFile) await renombrarArchivo(renameFile.id, renameName);
                                    setRenameVisible(false);
                                    setRenameFolder(null);
                                    setRenameFile(null);
                                }}
                                activeOpacity={0.9}
                            >
                                <Ionicons name="create-outline" size={22} color="#2563EB" />
                                <Text className="ml-2 text-blue-700 font-medium">Guardar</Text>
                            </TouchableOpacity>

                            {/* Cancelar */}
                            <TouchableOpacity
                                onPress={() => setRenameVisible(false)}
                                activeOpacity={0.9}
                                className="flex-1 bg-red-500 p-3 rounded-xl flex-row items-center justify-center"
                            >
                                <Ionicons name="close-circle-outline" size={22} color="white" />
                                <Text className="ml-2 text-white font-semibold">Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>


            {/* Modal de acciones */}
            <Modal visible={actionModal.visible} transparent animationType="fade">
                <Pressable
                    className="flex-1 justify-center items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                    onPress={() =>
                        setActionModal({ visible: false, carpetaId: null, carpetaNombre: "" })
                    }
                >
                    <Pressable className="w-4/5 p-6 rounded-2xl bg-white shadow-2xl">
                        <Text className="text-lg font-semibold mb-4 text-center">
                            {actionModal.carpetaNombre}
                        </Text>
                        <View className="flex-row gap-3">

                            {/* Botón Renombrar */}
                            <TouchableOpacity

                                className="flex-1 bg-blue-100 p-3 rounded-xl flex-row items-center justify-center"
                                onPress={() => {
                                    setRenameVisible(true);
                                    setActionModal({ visible: false, carpetaId: null, carpetaNombre: "" });
                                }}
                            >
                                <Ionicons name="create-outline" size={22} color="#2563EB" />
                                <Text className="ml-2 text-blue-700 font-medium">Renombrar</Text>
                            </TouchableOpacity>

                            {/* Botón Eliminar */}
                            <TouchableOpacity
                                className="flex-1 bg-red-100 p-3 rounded-xl flex-row items-center justify-center"
                                onPress={() => {
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
                            >
                                <Ionicons name="trash-outline" size={22} color="#DC2626" />
                                <Text className="ml-2 text-red-700 font-medium">Eliminar</Text>
                            </TouchableOpacity>

                        </View>


                    </Pressable>
                </Pressable>
            </Modal>

            {/* Modal de acciones (Archivo) */}
            <Modal visible={fileActionVisible} transparent animationType="fade">
                <Pressable
                    className="flex-1 justify-center items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                    onPress={() => {
                        setFileActionVisible(false);
                        setSelectedFile(null);
                    }}
                >
                    <Pressable className="w-4/5 p-6 rounded-2xl bg-white shadow-2xl">
                        <Text className="text-lg font-semibold mb-4 text-center">
                            {selectedFile?.nombre}
                        </Text>
                        <View className="flex-row gap-3">

                            {/* Botón Renombrar */}
                            <TouchableOpacity
                                className="flex-1 bg-blue-100 p-3 rounded-xl flex-row items-center justify-center"
                                onPress={() => {
                                    setRenameFile(selectedFile);
                                    setRenameName(selectedFile?.nombre || "");
                                    setRenameVisible(true);
                                    setFileActionVisible(false);
                                }}
                            >
                                <Ionicons name="create-outline" size={22} color="#2563EB" />
                                <Text className="ml-2 text-blue-700 font-medium">Renombrar</Text>
                            </TouchableOpacity>

                            {/* Botón Eliminar */}
                            <TouchableOpacity
                                className="flex-1 bg-red-100 p-3 rounded-xl flex-row items-center justify-center"
                                onPress={() => {
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
                            >
                                <Ionicons name="trash-outline" size={22} color="#DC2626" />
                                <Text className="ml-2 text-red-700 font-medium">Eliminar</Text>
                            </TouchableOpacity>

                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
            <ModalPermisos
                visible={modalPermisosVisible}
                tipo="almacenamiento"
                onClose={() => setModalPermisosVisible(false)}
                onConceder={async () => {
                    const ok = await pedirPermisosNecesarios();
                    if (ok) setModalPermisosVisible(false);
                }}
            />
        </View >
    );
}
