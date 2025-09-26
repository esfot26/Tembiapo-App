
import { StyleSheet, Dimensions } from "react-native";



export const { width: screenWidth } = Dimensions.get("window")


export const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "flex-start",
        padding: screenWidth * 0.04,
        backgroundColor: "white",
        borderRadius: 16,
        marginBottom: screenWidth * 0.03,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderLeftWidth: 4,
        borderLeftColor: "#1e40af",
    },
    completedCard: {
        backgroundColor: "#f9fafb",
        borderLeftColor: "#10b981",
    },
    checkButton: {
        marginRight: screenWidth * 0.03,
        marginTop: 2,
        padding: 4,
    },
    checkButtonCompleted: {
        backgroundColor: "#ecfdf5",
        borderRadius: 20,
    },
    cardContent: {
        flex: 1,
        paddingRight: screenWidth * 0.02,
    },
    cardTitle: {
        fontSize: screenWidth * 0.042,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 6,
        lineHeight: screenWidth * 0.055,
    },
    cardDescription: {
        fontSize: screenWidth * 0.035,
        color: "#6b7280",
        lineHeight: screenWidth * 0.045,
    },
    completedText: {
        textDecorationLine: "line-through",
        color: "#9ca3af",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionButton: {
        marginLeft: screenWidth * 0.02,
        padding: screenWidth * 0.02,
        borderRadius: 8,
    },
    editButton: {
        backgroundColor: "#eff6ff",
    },
    deleteButton: {
        backgroundColor: "#fef2f2",
    },
    priorityBadge: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 6,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 0,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        maxHeight: "80%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    modalTitle: {
        fontSize: screenWidth * 0.048,
        fontWeight: "700",
        color: "#111827",
    },
    closeButton: {
        padding: 4,
    },
    modalContent: {
        padding: 24,
    },
    inputLabel: {
        fontSize: screenWidth * 0.038,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    modalInput: {
        borderWidth: 1.5,
        borderColor: "#d1d5db",
        borderRadius: 12,
        padding: 16,
        fontSize: screenWidth * 0.04,
        marginBottom: 20,
        backgroundColor: "#f9fafb",
        color: "#111827",
    },
    modalTextarea: {
        height: screenWidth * 0.3,
        textAlignVertical: "top",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 24,
        paddingBottom: 24,
        gap: 12,
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        minWidth: screenWidth * 0.2,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#f3f4f6",
        borderWidth: 1,
        borderColor: "#d1d5db",
    },
    saveButton: {
        backgroundColor: "#1e40af",
    },
    cancelText: {
        color: "#374151",
        fontSize: screenWidth * 0.038,
        fontWeight: "600",
    },
    saveText: {
        color: "#ffffff",
        fontSize: screenWidth * 0.038,
        fontWeight: "600",
    },
})