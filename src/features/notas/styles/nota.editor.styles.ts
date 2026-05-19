import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    selectorItem: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 4,
        borderWidth: 1,
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 6,
        marginTop: 16,
    },
    input: {
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
        fontSize: 16,
    },
    multilineInput: {
        minHeight: 110,
        textAlignVertical: "top",
    },
    errorTexto: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: "500",
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
    },
    actionText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
}); 