import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "center",
        padding: 30,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    iconContainer: {
        alignSelf: "center",
        backgroundColor: "#EFF6FF",
        borderRadius: 100,
        padding: 16,
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#1E3A8A",
        marginBottom: 8,
    },
    description: {
        textAlign: "center",
        fontSize: 14,
        color: "#64748B",
        marginTop: 4,
    },
    emailText: {
        textAlign: "center",
        fontSize: 15,
        fontWeight: "700",
        color: "#1E3A8A",
        marginTop: 2,
    },
    buttonRow: {
        marginTop: 12,
    },
    separator: {
        height: 1,
        backgroundColor: "#E2E8F0",
        marginVertical: 16,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    backText: {
        color: "#64748B",
        fontSize: 13,
        textAlign: "center",
    },
});