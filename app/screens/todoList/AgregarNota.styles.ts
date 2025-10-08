import { useRef } from "react"
import { Animated, Dimensions, StyleSheet } from "react-native"

// Configuración mejorada de categorías
export const CATEGORIAS_CONFIG = {
    personal: {
        label: "Personal",
        color: "#ec4899",
        icon: "heart-outline" as const,
        lightColor: "#fdf2f8"
    },
    trabajo: {
        label: "Trabajo",
        color: "#3b82f6",
        icon: "briefcase-outline" as const,
        lightColor: "#eff6ff"
    },
    estudio: {
        label: "Estudio",
        color: "#10b981",
        icon: "school-outline" as const,
        lightColor: "#f0fdf4"
    },
    otro: {
        label: "Otro",
        color: "#8b5cf6",
        icon: "ellipsis-horizontal-outline" as const,
        lightColor: "#faf5ff"
    }
}

// Configuración mejorada de prioridades
export const PRIORIDADES_CONFIG = {
    baja: {
        label: "Baja",
        color: "#10b981",
        icon: "trending-down-outline" as const,
    },
    media: {
        label: "Media",
        color: "#f59e0b",
        icon: "remove-outline" as const,
    },
    alta: {
        label: "Alta",
        color: "#ef4444",
        icon: "trending-up-outline" as const,
    }
}


export function useAnimations() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const modalScale = useRef(new Animated.Value(0.9)).current;
    const inputFocusAnim = useRef(new Animated.Value(0)).current;
  
    return { fadeAnim, slideAnim, buttonScale, modalScale, inputFocusAnim };
  }
// Tipos actualizados
export type Categoria = "personal" | "trabajo" | "estudio" | "otro"
export type Prioridad = "baja" | "media" | "alta"

export interface Nota {
    titulo: string
    descripcion: string
    categoria: Categoria
    prioridad: Prioridad
    fechaVencimiento?: Date
    completado: boolean
    creado: any
}


export const { width: width } = Dimensions.get("window")
export const { height: height } = Dimensions.get("window")


export const styles = StyleSheet.create({

    
    container: {
        marginHorizontal: width * 0.04,
        marginVertical: width * 0.02,
    },
    addButton: {
        backgroundColor: '#667eea',
        borderRadius: 16,
        shadowColor: "#667eea",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        paddingHorizontal: 24,
        zIndex: 2,
    },
    buttonGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#667eea',
        opacity: 0.3,
        borderRadius: 16,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#ffffff",
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    keyboardAvoid: {
        flex: 1,
        width: '100%',
    },
    modalContainer: {
        width: "100%",
        maxWidth: width * 0.95,
        backgroundColor: "#ffffff",
        borderRadius: 24,
        maxHeight: height * 0.85,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 30,
        elevation: 15,
        overflow: "hidden",
    },
    scrollContent: {
        flexGrow: 1,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 24,
        backgroundColor: "#f8fafc",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1f2937",
        marginLeft: 12,
    },
    closeButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputContainer: {
        padding: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: "700",
        color: "#374151",
        marginBottom: 12,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#e2e8f0",
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    titleInput: {
        flex: 1,
        fontSize: 16,
        color: "#1f2937",
        marginLeft: 12,
        fontWeight: "600",
    },
    descriptionWrapper: {
        backgroundColor: "#f8fafc",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#e2e8f0",
        minHeight: 120,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    descriptionInput: {
        flex: 1,
        fontSize: 15,
        color: "#1f2937",
        padding: 16,
        textAlignVertical: "top",
        fontWeight: "500",
        lineHeight: 22,
    },
    selectorContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    categoriaItem: {
        marginBottom: 8,
    },
    categoriaButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    categoriaButtonSelected: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    categoriaTexto: {
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 8,
    },
    categoriaTextoSelected: {
        fontSize: 14,
        fontWeight: "700",
        color: "#ffffff",
        marginLeft: 8,
    },
    prioridadItem: {
        marginBottom: 8,
    },
    prioridadButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#e2e8f0",
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    prioridadButtonSelected: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    prioridadTexto: {
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 8,
    },
    prioridadTextoSelected: {
        fontSize: 14,
        fontWeight: "700",
        color: "#ffffff",
        marginLeft: 8,
    },
    fechaCreacionContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f1f5f9",
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
    },
    fechaCreacionTexto: {
        fontSize: 14,
        color: "#475569",
        marginLeft: 12,
        fontStyle: "italic",
        fontWeight: "500",
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 24,
        paddingTop: 16,
        gap: 12,
        backgroundColor: "#f8fafc",
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#e2e8f0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#6b7280",
    },
    saveButton: {
        flex: 1,
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#ffffff",
        marginLeft: 8,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})