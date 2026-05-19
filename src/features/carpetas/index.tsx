// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     FlatList,
//     TouchableOpacity,
//     ActivityIndicator,
//     Modal,
//     Pressable,
//     Alert,
//     Linking,
//     BackHandler,
//     Dimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
// import { useTheme } from "@/src/contexts/TemaContext";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { ModalPermisos } from "@/components/ui/modalPermisos";
// import { FolderListSkeleton } from "@/components/ui/skeleton";
// import { ArchivoItem, Carpeta, useCarpeta } from "./hooks/carpeta.hook";


// export default function CarpetaScreen({ padreId, path }: any) {
//     const {
//         carpetas,
//         archivos,
//         loading,
//         crearCarpeta,
//         editarCarpeta,
//         eliminarCarpeta,
//         handleUploadFile,
//         handleCancelUpload,
//         cargarContenido,
//         eliminarArchivo,
//         renombrarArchivo,
//         uploading,
//         progress,
//         actionModal,
//         setActionModal,
//         verificarPermisos,
//         pedirPermisosNecesarios,
//     } = useCarpeta(padreId);



//     const router = useRouter();

//     const { colors } = useTheme();
//     const [newFolder, setNewFolder] = useState("");
//     const [isModalVisible, setModalVisible] = useState(false);
//     const [isRenameVisible, setRenameVisible] = useState(false);
//     const [renameName, setRenameName] = useState("");
//     const [renameFolder, setRenameFolder] = useState<Carpeta | null>(null);
//     const [renameFile, setRenameFile] = useState<ArchivoItem | null>(null);
//     const [fileActionVisible, setFileActionVisible] = useState(false);
//     const [selectedFile, setSelectedFile] = useState<ArchivoItem | null>(null);
//     const [isFabMenuVisible, setFabMenuVisible] = useState(false);

//     const [modalPermisosVisible, setModalPermisosVisible] = useState(false);

//     const params = useLocalSearchParams();
//     const insets = useSafeAreaInsets();

//     useEffect(() => {
//         cargarContenido();
//     }, [cargarContenido]);

//     useEffect(() => {
//         async function verificar() {
//             const { almacenamiento } = await verificarPermisos();

//             if (!almacenamiento) {
//                 setModalPermisosVisible(true);
//             }
//         }

//         verificar();
//     }, [padreId]);



//     const combinedData = useMemo(() => {
//         const c = carpetas.map((f) => ({ ...f, type: "folder" }));
//         const a = archivos.map((f) => ({ ...f, type: "file" }));
//         return [...c, ...a];
//     }, [carpetas, archivos]);




//     // 🔙 Función para volver a la carpeta anterior o raíz
//     const handleBack = () => {
//         if (path && path.length > 1) {
//             const newPath = [...path];
//             newPath.pop();

//             const previousFolder = newPath[newPath.length - 1];

//             router.replace({
//                 pathname: "/(tabs)/carpeta",
//                 params: {
//                     padreId: previousFolder?.id ?? "",
//                     path: JSON.stringify(newPath),
//                 },
//             });

//             // path ya se actualiza vía router.replace, no hace falta setPath
//         } else {
//             // 🏠 Si ya estamos en la raíz
//             router.replace("/(tabs)/carpeta");
//             // path ya se actualiza vía router.replace, no hace falta setPath([]);
//         }
//     };

//     // 🔁 Manejar el botón físico de "atrás" en Android
//     useFocusEffect(
//         useCallback(() => {
//             const onBackPress = () => {
//                 handleBack();
//                 return true; // evita salir de la app
//             };

//             // ✅ Agregar listener
//             BackHandler.addEventListener("hardwareBackPress", onBackPress);

//             // 🧹 Remover correctamente al salir del foco
//             return () => {
//                 BackHandler.addEventListener("hardwareBackPress", onBackPress);
//             };
//         }, [path])
//     );


//     /** Renderizado de ítems */
//     const renderItem = ({ item }: any) => {
//         const isFolder = item.type === "folder";

//         return (
//             <Animated.View entering={FadeInUp.delay(50)} exiting={FadeOutDown} className="px-4">
//                 <TouchableOpacity
//                     activeOpacity={0.9}
//                     onPress={() => {
//                         if (isFolder) {
//                             router.push({
//                                 pathname: "/carpeta",
//                                 params: {
//                                     padreId: item.id,
//                                     path: JSON.stringify([...path, { id: item.id, name: item.nombre }]),
//                                 },
//                             });
//                         } else {
//                             router.push({
//                                 pathname: "/(tabs)/visor",
//                                 params: {
//                                     url: item.url,
//                                     nombre: item.nombre,
//                                     mimeType: item.mimeType,
//                                     padreId: padreId ?? "",
//                                     path: JSON.stringify(path ?? []),
//                                 },
//                             });
//                         }
//                     }}
//                     onLongPress={() => {
//                         if (isFolder) {
//                             setActionModal({ visible: true, carpetaId: item.id, carpetaNombre: item.nombre });
//                             setRenameFolder(item);
//                             setRenameName(item.nombre);
//                         } else {
//                             setSelectedFile(item);
//                             setRenameName(item.nombre);
//                             setFileActionVisible(true);
//                         }
//                     }}
//                     delayLongPress={200}
//                     className="bg-white rounded-2xl p-4 my-2 flex-row items-center shadow-sm border border-gray-100"
//                     style={{
//                         backgroundColor: colors.background,
//                         borderColor: colors.foreground,
//                     }}
//                 >
//                     <View
//                         className={`w-12 h-12 rounded-xl items-center justify-center ${isFolder ? "bg-blue-100" : "bg-gray-100"
//                             }`}
//                         style={{ backgroundColor: colors.muted }}
//                     >
//                         <Ionicons
//                             name={isFolder ? "folder-outline" : "document-text-outline"}
//                             size={28}
//                             color={isFolder ? "#2563EB" : "#6B7280"}
//                         />
//                     </View>

//                     <View className="flex-1 ml-4" style={{ marginRight: 10 }}>
//                         <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
//                             {item.nombre}
//                         </Text>
//                         <Text className="text-xs mt-1" style={{ color: colors.foreground }}>
//                             {isFolder ? "Carpeta" : "Archivo"}
//                         </Text>
//                     </View>

//                     {isFolder && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
//                 </TouchableOpacity>
//             </Animated.View>
//         );
//     };


//     return (
//         <View className="flex-1" style={{ backgroundColor: colors.primary }}>
//             <View
//                 className="flex-row items-center justify-between px-4 py-3 border-b shadow-sm"
//                 style={{
//                     backgroundColor: colors.card,
//                     borderColor: colors.border,
//                     paddingTop: insets.top + 4,
//                 }}
//             >

//                 <View style={{ width: 64 }}>
//                     {path.length > 0 && (
//                         <TouchableOpacity
//                             onPress={handleBack}
//                             activeOpacity={0.7}
//                             style={{
//                                 width: 36,
//                                 height: 36,
//                                 borderRadius: 18,
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 backgroundColor: colors.primary,
//                                 borderWidth: 1,
//                                 borderColor: colors.border,
//                                 shadowOpacity: 0.12,
//                                 shadowRadius: 4,
//                                 shadowOffset: { width: 0, height: 2 },
//                                 elevation: 2,
//                             }}
//                         >
//                             <Ionicons name="arrow-back" size={20} color={colors.primary} />
//                         </TouchableOpacity>
//                     )}
//                 </View>

//                 {/* Título centrado */}
//                 <View style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}>
//                     <Text
//                         numberOfLines={1}
//                         ellipsizeMode="tail"
//                         className="text-xl font-bold"
//                         style={{ color: colors.primary, textAlign: "center" }}
//                     >
//                         {path.length === 0 ? "Mis carpetas" : path[path.length - 1].name}
//                     </Text>
//                 </View>

//                 {/* Espaciador derecho para centrar el título */}
//                 <View style={{ width: 64 }} />
//             </View>

//             {/* Contenido principal */}
//             {loading ? (
//                 <FolderListSkeleton count={6} />
//             ) : (
//                 <FlatList
//                     data={combinedData}
//                     keyExtractor={(i) => i.id}
//                     renderItem={renderItem}
//                     contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 12 }}
//                 />
//             )}


//             {uploading && (
//                 <Animated.View
//                     entering={FadeInUp.springify()}
//                     exiting={FadeOutDown}
//                     style={{ position: "absolute", bottom: 110, left: 16, right: 16, zIndex: 200, alignSelf: "center" }}
//                 >
//                     <Card className="border shadow-lg rounded-3xl" style={{ backgroundColor: colors.card }}>
//                         <CardHeader className="pb-1">
//                             <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
//                                 <Text style={{ color: colors.foreground, fontWeight: "700" }}>
//                                     Subiendo archivo
//                                 </Text>
//                                 <Text style={{ color: colors.mutedForeground, fontWeight: "600" }}>{Math.round(progress)}%</Text>
//                             </View>
//                         </CardHeader>
//                         <CardContent>
//                             <Progress value={progress} className="h-2 rounded-full" />
//                             <View style={{ marginTop: 8, flexDirection: "row", justifyContent: "flex-end" }}>
//                                 <TouchableOpacity onPress={handleCancelUpload} activeOpacity={0.8} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}>
//                                     <Text style={{ color: colors.foreground, fontWeight: "600", fontSize: 12 }}>Cancelar</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </CardContent>
//                     </Card>
//                 </Animated.View>
//             )}

//             {/* FAB */}
//             <View className="items-center" style={{ position: "absolute", right: 16, bottom: insets.bottom + Math.max(88, Math.floor(Dimensions.get('window').height * 0.08)) }} >
//                 {/* Menú expandido */}
//                 {isFabMenuVisible && (
//                     <Animated.View
//                         entering={FadeInUp.springify()}
//                         exiting={FadeOutDown}
//                         className="mb-4 space-y-3"
//                     >
//                         {/* 📁 Crear carpeta */}
//                         <TouchableOpacity
//                             onPress={() => setModalVisible(true)}
//                             //className="bg-white w-14 h-14 rounded-full justify-center items-center shadow-lg border border-gray-200"
//                             activeOpacity={0.8}
//                         >
//                             <Ionicons name="folder-open-outline" size={26} color="#4B5563" />
//                         </TouchableOpacity>

//                         {/* ☁️ Subir archivo (solo si estamos dentro de una carpeta) */}
//                         {padreId && (
//                             <TouchableOpacity
//                                 onPress={handleUploadFile}
//                                 //className="bg-white w-14 h-14 rounded-full justify-center items-center shadow-lg border border-gray-200"
//                                 activeOpacity={0.8}
//                             >
//                                 <Ionicons name="cloud-upload-outline" size={26} color="#2563EB" />
//                             </TouchableOpacity>
//                         )}
//                     </Animated.View>
//                 )}

//                 {/* ➕ Botón principal */}
//                 <TouchableOpacity
//                     onPress={() => setFabMenuVisible(!isFabMenuVisible)}
//                     //className="w-16 h-16 rounded-full justify-center items-center shadow-3xl"
//                     style={{
//                         backgroundColor: colors.primary,
//                         shadowColor: "#000",
//                         shadowOpacity: 0.25,
//                         shadowRadius: 8,
//                         shadowOffset: { width: 0, height: 4 },
//                         elevation: 6,
//                     }}
//                     activeOpacity={0.9}
//                 >
//                     <Ionicons
//                         name={isFabMenuVisible ? "close" : "add"}
//                         size={32}
//                         color={colors.primaryForeground}
//                     />
//                 </TouchableOpacity>
//             </View>

//             {/* Modal Crear Carpeta */}
//             <Modal visible={isModalVisible}
//                 transparent
//                 animationType="fade"
//                 onRequestClose={() => setModalVisible(false)}
//                 style={{
//                     justifyContent: 'center', alignItems: 'center',
//                     backgroundColor: colors.background,
//                 }}
//             >
//                 <Pressable
//                    // className="flex-1 justify-center items-center"
//                     style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
//                     onPress={() => setModalVisible(false)} // Cierra al tocar fuera
//                 >
//                     <Pressable
//                       //  className="w-4/5 p-6 rounded-2xl shadow-2xl"
//                         style={{ backgroundColor: colors.background, }}
//                         onPress={(e) => e.stopPropagation()} // 🔹 evita cerrar al tocar dentro
//                     >
//                         <Text className="text-lg font-semibold mb-4 text-center"
//                             style={{ color: colors.foreground, }}
//                         >

//                             Nueva carpeta
//                         </Text>
//                         <TextInput
//                             style={{
//                                 borderWidth: 1,
//                                 borderColor: "#d1d5db",
//                                 borderRadius: 12,
//                                 padding: 12,
//                                 fontSize: 15,
//                                 color: colors.foreground,
//                                 marginBottom: 10,
//                             }}
//                             placeholder="Nombre de la carpeta"
//                             placeholderTextColor="#9ca3af"
//                             value={newFolder}
//                             onChangeText={setNewFolder}
//                         />

//                         <View className="flex-row justify-between gap-3">
//                             <TouchableOpacity
//                              //   className="flex-1 bg-blue-600 p-3 rounded-xl flex-row items-center justify-center"
//                                 onPress={async () => {
//                                     await crearCarpeta(newFolder);
//                                     setNewFolder("");
//                                     setModalVisible(false);
//                                 }}
//                                 activeOpacity={0.9}

//                             >
//                                 <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
//                                 <Text className="text-white font-semibold">Crear</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 onPress={() => setModalVisible(false)}
//                                 activeOpacity={0.9}
//                                 className="flex-1 bg-red-600 p-3 rounded-xl flex-row items-center justify-center"
//                             >
//                                 <Ionicons name="close-circle-outline" size={22} color="white" />
//                                 <Text className="ml-2 text-white font-semibold">Cancelar</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </Pressable>
//                 </Pressable>
//             </Modal>

//             {/* Modal Renombrar Carpeta */}
//             <Modal
//                 visible={isRenameVisible}
//                 transparent
//                 animationType="fade"
//                 onRequestClose={() => setRenameVisible(false)} // 🔹 soporte para Android “back”
//             >
//                 {/* Fondo oscuro */}
//                 <Pressable
//                     className="flex-1 justify-center items-center"
//                     style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
//                     onPress={() => setRenameVisible(false)} // 🔹 Toca fuera para cerrar
//                 >
//                     {/* Contenedor del modal */}
//                     <Pressable
//                         className="w-4/5 p-6 rounded-2xl shadow-2xl"
//                         style={{ backgroundColor: "white" }}
//                         onPress={(e) => e.stopPropagation()} // 🔹 evita cerrar al tocar dentro
//                     >
//                         <Text className="text-lg font-semibold mb-4 text-center text-gray-800">
//                             {renameFile ? "Renombrar Archivo" : "Renombrar Carpeta"}
//                         </Text>

//                         <TextInput
//                             placeholder="Nuevo nombre"
//                             value={renameName}
//                             onChangeText={setRenameName}
//                             className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-800"
//                             placeholderTextColor="#9CA3AF"
//                         />

//                         {/* Botones de acción */}
//                         <View className="flex-row justify-between gap-3">
//                             {/* Guardar */}
//                             <TouchableOpacity
//                                 className="flex-1 bg-blue-100 p-3 rounded-xl flex-row items-center justify-center"
//                                 onPress={async () => {
//                                     if (renameFolder) await editarCarpeta(renameFolder.id, renameName);
//                                     if (renameFile) await renombrarArchivo(renameFile.id, renameName);
//                                     setRenameVisible(false);
//                                     setRenameFolder(null);
//                                     setRenameFile(null);
//                                 }}
//                                 activeOpacity={0.9}
//                             >
//                                 <Ionicons name="create-outline" size={22} color="#2563EB" />
//                                 <Text className="ml-2 text-blue-700 font-medium">Guardar</Text>
//                             </TouchableOpacity>

//                             {/* Cancelar */}
//                             <TouchableOpacity
//                                 onPress={() => setRenameVisible(false)}
//                                 activeOpacity={0.9}
//                                 className="flex-1 bg-red-500 p-3 rounded-xl flex-row items-center justify-center"
//                             >
//                                 <Ionicons name="close-circle-outline" size={22} color="white" />
//                                 <Text className="ml-2 text-white font-semibold">Cancelar</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </Pressable>
//                 </Pressable>
//             </Modal>


//             {/* Modal de acciones */}
//             <Modal visible={actionModal.visible} transparent animationType="fade">
//                 <Pressable
//                     className="flex-1 justify-center items-center"
//                     style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
//                     onPress={() =>
//                         setActionModal({ visible: false, carpetaId: null, carpetaNombre: "" })
//                     }
//                 >
//                     <Pressable className="w-4/5 p-6 rounded-2xl bg-white shadow-2xl">
//                         <Text className="text-lg font-semibold mb-4 text-center">
//                             {actionModal.carpetaNombre}
//                         </Text>
//                         <View className="flex-row gap-3">

//                             {/* Botón Renombrar */}
//                             <TouchableOpacity

//                                 className="flex-1 bg-blue-100 p-3 rounded-xl flex-row items-center justify-center"
//                                 onPress={() => {
//                                     setRenameVisible(true);
//                                     setActionModal({ visible: false, carpetaId: null, carpetaNombre: "" });
//                                 }}
//                             >
//                                 <Ionicons name="create-outline" size={22} color="#2563EB" />
//                                 <Text className="ml-2 text-blue-700 font-medium">Renombrar</Text>
//                             </TouchableOpacity>

//                             {/* Botón Eliminar */}
//                             <TouchableOpacity
//                                 className="flex-1 bg-red-100 p-3 rounded-xl flex-row items-center justify-center"
//                                 onPress={() => {
//                                     Alert.alert(
//                                         "Eliminar carpeta",
//                                         "¿Estás seguro de que deseas eliminar esta carpeta?",
//                                         [
//                                             { text: "Cancelar", style: "cancel" },
//                                             {
//                                                 text: "Eliminar",
//                                                 style: "destructive",
//                                                 onPress: async () => {
//                                                     if (actionModal.carpetaId) await eliminarCarpeta(actionModal.carpetaId);
//                                                     setActionModal({ visible: false, carpetaId: null, carpetaNombre: "" });
//                                                 },
//                                             },
//                                         ]
//                                     );
//                                 }}
//                             >
//                                 <Ionicons name="trash-outline" size={22} color="#DC2626" />
//                                 <Text className="ml-2 text-red-700 font-medium">Eliminar</Text>
//                             </TouchableOpacity>

//                         </View>


//                     </Pressable>
//                 </Pressable>
//             </Modal>

//             {/* Modal de acciones (Archivo) */}
//             <Modal visible={fileActionVisible} transparent animationType="fade">
//                 <Pressable
//                     className="flex-1 justify-center items-center"
//                     style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
//                     onPress={() => {
//                         setFileActionVisible(false);
//                         setSelectedFile(null);
//                     }}
//                 >
//                     <Pressable className="w-4/5 p-6 rounded-2xl bg-white shadow-2xl">
//                         <Text className="text-lg font-semibold mb-4 text-center">
//                             {selectedFile?.nombre}
//                         </Text>
//                         <View className="flex-row gap-3">

//                             {/* Botón Renombrar */}
//                             <TouchableOpacity
//                                 className="flex-1 bg-blue-100 p-3 rounded-xl flex-row items-center justify-center"
//                                 onPress={() => {
//                                     setRenameFile(selectedFile);
//                                     setRenameName(selectedFile?.nombre || "");
//                                     setRenameVisible(true);
//                                     setFileActionVisible(false);
//                                 }}
//                             >
//                                 <Ionicons name="create-outline" size={22} color="#2563EB" />
//                                 <Text className="ml-2 text-blue-700 font-medium">Renombrar</Text>
//                             </TouchableOpacity>

//                             {/* Botón Eliminar */}
//                             <TouchableOpacity
//                                 className="flex-1 bg-red-100 p-3 rounded-xl flex-row items-center justify-center"
//                                 onPress={() => {
//                                     Alert.alert(
//                                         "Eliminar archivo",
//                                         "¿Estás seguro de que deseas eliminar este archivo?",
//                                         [
//                                             { text: "Cancelar", style: "cancel" },
//                                             {
//                                                 text: "Eliminar",
//                                                 style: "destructive",
//                                                 onPress: async () => {
//                                                     if (selectedFile) {
//                                                         await eliminarArchivo(selectedFile.id, selectedFile.nombre);
//                                                         await cargarContenido();
//                                                     }
//                                                     setFileActionVisible(false);
//                                                     setSelectedFile(null);
//                                                 },
//                                             },
//                                         ]
//                                     );
//                                 }}
//                             >
//                                 <Ionicons name="trash-outline" size={22} color="#DC2626" />
//                                 <Text className="ml-2 text-red-700 font-medium">Eliminar</Text>
//                             </TouchableOpacity>

//                         </View>
//                     </Pressable>
//                 </Pressable>
//             </Modal>
//             <ModalPermisos
//                 visible={modalPermisosVisible}
//                 tipo="almacenamiento"
//                 onClose={() => setModalPermisosVisible(false)}
//                 onConceder={async () => {
//                     const ok = await pedirPermisosNecesarios();
//                     if (ok) setModalPermisosVisible(false);
//                 }}
//             />
//         </View >
//     );
// }

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
    BackHandler,
    Dimensions,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { useTheme } from "@/src/contexts/TemaContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ModalPermisos } from "@/components/ui/modalPermisos";
import { FolderListSkeleton } from "@/components/ui/skeleton";
import { ArchivoItem, Carpeta, useCarpeta } from "./hooks/carpeta.hook";

// ─────────────────────────────────────────────
//  Sub-componentes
// ─────────────────────────────────────────────

/** Cabecera con botón atrás + título */
function Header({
    path,
    colors,
    insets,
    onBack,
}: {
    path: { id: string; name: string }[];
    colors: any;
    insets: any;
    onBack: () => void;
}) {
    return (
        <View
            style={[
                styles.header,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    paddingTop: insets.top + 4,
                },
            ]}
        >
            {/* Botón atrás */}
            <View style={styles.headerSide}>
                {path.length > 0 && (
                    <TouchableOpacity
                        onPress={onBack}
                        activeOpacity={0.7}
                        style={[
                            styles.backButton,
                            {
                                backgroundColor: colors.primary,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <Ionicons name="arrow-back" size={20} color={colors.primaryForeground ?? "#fff"} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Título */}
            <View style={styles.headerCenter}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[styles.headerTitle, { color: colors.foreground }]}
                >
                    {path.length === 0 ? "Mis carpetas" : path[path.length - 1].name}
                </Text>
            </View>

            {/* Espaciador derecho */}
            <View style={styles.headerSide} />
        </View>
    );
}

/** Ítem de carpeta o archivo */
function FileItem({
    item,
    colors,
    onPress,
    onLongPress,
}: {
    item: any;
    colors: any;
    onPress: () => void;
    onLongPress: () => void;
}) {
    const isFolder = item.type === "folder";

    return (
        <Animated.View entering={FadeInUp.delay(50)} exiting={FadeOutDown} style={styles.itemWrapper}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                onLongPress={onLongPress}
                delayLongPress={200}
                style={[
                    styles.itemRow,
                    { backgroundColor: colors.background, borderColor: colors.border },
                ]}
            >
                {/* Icono */}
                <View style={[styles.itemIcon, { backgroundColor: colors.muted }]}>
                    <Ionicons
                        name={isFolder ? "folder-outline" : "document-text-outline"}
                        size={28}
                        color={isFolder ? "#2563EB" : "#6B7280"}
                    />
                </View>

                {/* Texto */}
                <View style={styles.itemText}>
                    <Text style={[styles.itemName, { color: colors.foreground }]}>{item.nombre}</Text>
                    <Text style={[styles.itemType, { color: colors.mutedForeground ?? colors.foreground }]}>
                        {isFolder ? "Carpeta" : "Archivo"}
                    </Text>
                </View>

                {isFolder && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
            </TouchableOpacity>
        </Animated.View>
    );
}

/** Tarjeta de progreso de subida */
function UploadProgress({
    progress,
    colors,
    onCancel,
}: {
    progress: number;
    colors: any;
    onCancel: () => void;
}) {
    return (
        <Animated.View
            entering={FadeInUp.springify()}
            exiting={FadeOutDown}
            style={styles.uploadCard}
        >
            <Card style={[styles.uploadInner, { backgroundColor: colors.card }]}>
                <CardHeader style={styles.uploadHeader}>
                    <Text style={[styles.uploadTitle, { color: colors.foreground }]}>Subiendo archivo</Text>
                    <Text style={[styles.uploadPercent, { color: colors.mutedForeground }]}>
                        {Math.round(progress)}%
                    </Text>
                </CardHeader>
                <CardContent>
                    <Progress value={progress} style={styles.progressBar} />
                    <View style={styles.uploadCancel}>
                        <TouchableOpacity
                            onPress={onCancel}
                            activeOpacity={0.8}
                            style={[
                                styles.cancelButton,
                                { backgroundColor: colors.background, borderColor: colors.border },
                            ]}
                        >
                            <Text style={[styles.cancelText, { color: colors.foreground }]}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </CardContent>
            </Card>
        </Animated.View>
    );
}

/** FAB expandible */
function FabMenu({
    visible,
    padreId,
    colors,
    insets,
    onToggle,
    onCreateFolder,
    onUpload,
}: {
    visible: boolean;
    padreId?: string;
    colors: any;
    insets: any;
    onToggle: () => void;
    onCreateFolder: () => void;
    onUpload: () => void;
}) {
    const bottomOffset = insets.bottom + Math.max(88, Math.floor(Dimensions.get("window").height * 0.08));

    return (
        <View style={[styles.fab, { bottom: bottomOffset }]}>
            {visible && (
                <Animated.View
                    entering={FadeInUp.springify()}
                    exiting={FadeOutDown}
                    style={styles.fabMenu}
                >
                    <TouchableOpacity onPress={onCreateFolder} activeOpacity={0.8} style={styles.fabMenuItem}>
                        <Ionicons name="folder-open-outline" size={26} color="#4B5563" />
                    </TouchableOpacity>

                    {padreId && (
                        <TouchableOpacity onPress={onUpload} activeOpacity={0.8} style={styles.fabMenuItem}>
                            <Ionicons name="cloud-upload-outline" size={26} color="#2563EB" />
                        </TouchableOpacity>
                    )}
                </Animated.View>
            )}

            <TouchableOpacity
                onPress={onToggle}
                activeOpacity={0.9}
                style={[
                    styles.fabMain,
                    {
                        backgroundColor: colors.primary,
                        shadowColor: "#000",
                    },
                ]}
            >
                <Ionicons
                    name={visible ? "close" : "add"}
                    size={32}
                    color={colors.primaryForeground ?? "#fff"}
                />
            </TouchableOpacity>
        </View>
    );
}

/** Modal genérico con fondo semitransparente */
function BaseModal({
    visible,
    onClose,
    children,
}: {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
                    {children}
                </Pressable>
            </Pressable>
        </Modal>
    );
}

/** Modal Crear Carpeta */
function CreateFolderModal({
    visible,
    colors,
    onClose,
    onCreate,
}: {
    visible: boolean;
    colors: any;
    onClose: () => void;
    onCreate: (name: string) => void;
}) {
    const [name, setName] = useState("");

    return (
        <BaseModal visible={visible} onClose={onClose}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>Nueva carpeta</Text>

                <TextInput
                    style={[styles.textInput, { color: colors.foreground }]}
                    placeholder="Nombre de la carpeta"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={setName}
                />

                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        onPress={() => {
                            onCreate(name);
                            setName("");
                            onClose();
                        }}
                        activeOpacity={0.9}
                        style={[styles.modalBtn, styles.btnBlue]}
                    >
                        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                        <Text style={styles.btnWhiteText}> Crear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        activeOpacity={0.9}
                        style={[styles.modalBtn, styles.btnRed]}
                    >
                        <Ionicons name="close-circle-outline" size={22} color="white" />
                        <Text style={styles.btnWhiteText}> Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BaseModal>
    );
}

/** Modal Renombrar */
function RenameModal({
    visible,
    isFile,
    initialName,
    onClose,
    onSave,
}: {
    visible: boolean;
    isFile: boolean;
    initialName: string;
    onClose: () => void;
    onSave: (name: string) => void;
}) {
    const [name, setName] = useState(initialName);

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    return (
        <BaseModal visible={visible} onClose={onClose}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitleDark}>
                    {isFile ? "Renombrar Archivo" : "Renombrar Carpeta"}
                </Text>

                <TextInput
                    placeholder="Nuevo nombre"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#9CA3AF"
                    style={styles.textInputDark}
                />

                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        onPress={() => onSave(name)}
                        activeOpacity={0.9}
                        style={[styles.modalBtn, styles.btnBlueLight]}
                    >
                        <Ionicons name="create-outline" size={22} color="#2563EB" />
                        <Text style={styles.btnBlueText}> Guardar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        activeOpacity={0.9}
                        style={[styles.modalBtn, styles.btnRed]}
                    >
                        <Ionicons name="close-circle-outline" size={22} color="white" />
                        <Text style={styles.btnWhiteText}> Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BaseModal>
    );
}

/** Modal acciones carpeta */
function FolderActionModal({
    visible,
    carpetaNombre,
    onClose,
    onRename,
    onDelete,
}: {
    visible: boolean;
    carpetaNombre: string;
    onClose: () => void;
    onRename: () => void;
    onDelete: () => void;
}) {
    return (
        <BaseModal visible={visible} onClose={onClose}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitleDark}>{carpetaNombre}</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        onPress={onRename}
                        activeOpacity={0.9}
                        style={[styles.modalBtn, styles.btnBlueLight]}
                    >
                        <Ionicons name="create-outline" size={22} color="#2563EB" />
                        <Text style={styles.btnBlueText}> Renombrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onDelete}
                        activeOpacity={0.9}
                        style={[styles.modalBtn, styles.btnRedLight]}
                    >
                        <Ionicons name="trash-outline" size={22} color="#DC2626" />
                        <Text style={styles.btnRedText}> Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BaseModal>
    );
}

/** Modal acciones archivo */
function FileActionModal({
    visible,
    fileName,
    onClose,
    onRename,
    onDelete,
}: {
    visible: boolean;
    fileName: string;
    onClose: () => void;
    onRename: () => void;
    onDelete: () => void;
}) {
    return (
        <BaseModal visible={visible} onClose={onClose}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitleDark}>{fileName}</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        onPress={onRename}
                        activeOpacity={0.9}
                        style={[styles.modalBtn, styles.btnBlueLight]}
                    >
                        <Ionicons name="create-outline" size={22} color="#2563EB" />
                        <Text style={styles.btnBlueText}> Renombrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onDelete}
                        activeOpacity={0.9}
                        style={[styles.modalBtn, styles.btnRedLight]}
                    >
                        <Ionicons name="trash-outline" size={22} color="#DC2626" />
                        <Text style={styles.btnRedText}> Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BaseModal>
    );
}

// ─────────────────────────────────────────────
//  Pantalla principal
// ─────────────────────────────────────────────

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
    const insets = useSafeAreaInsets();

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
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
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
        <View style={[styles.screen, { backgroundColor: colors.primary }]}>
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
                    setModalVisible(true);
                    setFabMenuVisible(false);
                }}
                onUpload={() => {
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

// ─────────────────────────────────────────────
//  Estilos
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
    // Layout
    screen: {
        flex: 1,
    },
    listContent: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    headerSide: {
        width: 64,
    },
    headerCenter: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },

    // Item lista
    itemWrapper: {
        paddingHorizontal: 16,
    },
    itemRow: {
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
    },
    itemIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    itemText: {
        flex: 1,
        marginLeft: 16,
        marginRight: 10,
    },
    itemName: {
        fontSize: 15,
        fontWeight: "600",
    },
    itemType: {
        fontSize: 12,
        marginTop: 4,
    },

    // Upload card
    uploadCard: {
        position: "absolute",
        bottom: 110,
        left: 16,
        right: 16,
        zIndex: 200,
    },
    uploadInner: {
        borderRadius: 24,
        borderWidth: 1,
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    uploadHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 4,
    },
    uploadTitle: {
        fontWeight: "700",
        fontSize: 14,
    },
    uploadPercent: {
        fontWeight: "600",
        fontSize: 14,
    },
    progressBar: {
        height: 8,
        borderRadius: 999,
    },
    uploadCancel: {
        marginTop: 8,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    cancelButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
    },
    cancelText: {
        fontWeight: "600",
        fontSize: 12,
    },

    // FAB
    fab: {
        position: "absolute",
        right: 16,
        alignItems: "center",
    },
    fabMenu: {
        marginBottom: 16,
        gap: 12,
        alignItems: "center",
    },
    fabMenuItem: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    fabMain: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },

    // Modales – base
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalBox: {
        width: "80%",
    },
    modalContent: {
        padding: 24,
        borderRadius: 16,
        shadowOpacity: 0.25,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,
        backgroundColor: "#fff",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 16,
    },
    modalTitleDark: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 16,
        color: "#111827",
    },
    modalButtons: {
        flexDirection: "row",
        gap: 12,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    // Input
    textInput: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        marginBottom: 16,
    },
    textInputDark: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
        color: "#111827",
        fontSize: 15,
    },

    // Botones
    btnBlue: {
        backgroundColor: "#2563EB",
    },
    btnBlueLight: {
        backgroundColor: "#dbeafe",
    },
    btnRed: {
        backgroundColor: "#DC2626",
    },
    btnRedLight: {
        backgroundColor: "#fee2e2",
    },
    btnWhiteText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    btnBlueText: {
        color: "#1d4ed8",
        fontWeight: "600",
        fontSize: 14,
    },
    btnRedText: {
        color: "#b91c1c",
        fontWeight: "600",
        fontSize: 14,
    },
});