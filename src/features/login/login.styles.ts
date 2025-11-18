import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    logoContainer: {
        backgroundColor: "white",
        borderRadius: 100,
        padding: 14,
    },
    appTitle: {
        color: "white",
        fontSize: 34,
        fontWeight: "bold",
        marginTop: 10,
    },
    subtitle: {
        color: "#DBEAFE",
        fontSize: 15,
        marginTop: 4,
    },
    formContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1E3A8A",
        marginBottom: 20,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    footerText: {
        color: "#6B7280",
        fontSize: 14,
    },
    footerLink: {
        color: "#2563EB",
        fontWeight: "bold",
        marginLeft: 5,
        fontSize: 14,
    },
});
