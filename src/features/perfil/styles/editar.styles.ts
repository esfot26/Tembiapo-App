import { Dimensions, StyleSheet } from "react-native";


export const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    keyboardView: {
        flex: 1
    },
    scrollView: {
        flex: 1
    },
    scrollContent: {
        paddingHorizontal: width * 0.05,
        paddingBottom: height * 0.05
    },
    avatarContainer: {
        alignItems: "center",
        marginVertical: height * 0.03
    },
    avatar: {
        width: width * 0.25,
        height: width * 0.25,
        borderRadius: (width * 0.25) / 2, // Garantiza un círculo perfecto
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: height * 0.015,
    },
    changePhotoText: {
        fontSize: width * 0.035,
        fontWeight: "600"
    },
    formContainer: {
        borderRadius: width * 0.04,
        padding: width * 0.05,
        marginBottom: height * 0.03,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3, // Bajado un toque para que no sea tan tosco en modo claro
    },
    sectionTitle: {
        fontSize: width * 0.042,
        fontWeight: "700",
        marginBottom: height * 0.015,
        marginTop: height * 0.02,
        // Eliminados estilos conflictivos; el alineado se maneja mejor desde el contenedor
    },
    inputContainer: {
        marginBottom: height * 0.018
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: width * 0.03,
        borderWidth: 1,
        paddingHorizontal: width * 0.04,
        minHeight: height * 0.06,
    },
    inputError: {
        borderColor: "#ef4444",
        backgroundColor: "#fef2f2"
    },
    inputIcon: {
        marginRight: width * 0.025
    },
    input: {
        flex: 1,
        fontSize: width * 0.038,
        paddingVertical: height * 0.012
    },
    requiredMark: {
        color: "#ef4444",
        fontSize: width * 0.04,
        fontWeight: "bold",
        marginLeft: width * 0.01
    },
    errorText: {
        fontSize: width * 0.032,
        marginTop: height * 0.006,
        fontWeight: "500",
        paddingLeft: width * 0.01 // Alinea sutilmente el error con el inicio del input
    },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: height * 0.018,
        borderRadius: width * 0.03,
        marginTop: height * 0.02,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 4,
    },
    saveButtonDisabled: {
        opacity: 0.5
    },
    saveButtonText: {
        color: "white",
        fontSize: width * 0.04,
        fontWeight: "600",
        marginLeft: width * 0.02
    },
});