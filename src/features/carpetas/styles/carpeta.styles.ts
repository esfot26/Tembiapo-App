import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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