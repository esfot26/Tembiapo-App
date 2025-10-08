import { Dimensions, StyleSheet } from "react-native";



export const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
export const isSmallScreen = screenWidth < 330;
export const isMediumScreen = screenWidth >= 330 && screenWidth < 380;


export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#1e40af", // Educational blue primary
    },
    keyboardContainer: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: screenWidth * 0.05,
    },
    header: {
        alignItems: "center",
        marginBottom: screenHeight * 0.05,
    },
    logoContainer: {
        width: screenWidth * 0.2,
        height: screenWidth * 0.2,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: screenWidth * 0.1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    appName: {
        fontSize: isSmallScreen ? 28 : isMediumScreen ? 32 : 36,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 8,
    },
    appSubtitle: {
        fontSize: isSmallScreen ? 14 : 16,
        color: "rgba(255, 255, 255, 0.8)",
        textAlign: "center",
    },
    loginContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: screenWidth * 0.06,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    title: {
        fontSize: isSmallScreen ? 22 : 26,
        fontWeight: "700",
        color: "#1e293b",
        textAlign: "center",
        marginBottom: screenHeight * 0.03,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        height: screenHeight * 0.06,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: isSmallScreen ? 14 : 16,
        color: "#1e293b",
    },
    eyeIcon: {
        padding: 4,
    },
    loginButton: {
        backgroundColor: "#1e40af",
        borderRadius: 12,
        height: screenHeight * 0.06,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        shadowColor: "#1e40af",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        color: "#ffffff",
        fontSize: isSmallScreen ? 16 : 18,
        fontWeight: "600",
    },
    loadingContainer: {
        alignItems: "center",
        paddingVertical: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#64748b",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#e2e8f0",
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: "#64748b",
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        height: screenHeight * 0.06,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    googleButtonText: {
        marginLeft: 12,
        fontSize: isSmallScreen ? 14 : 16,
        color: "#374151",
        fontWeight: "500",
    },
    registerLink: {
        marginTop: 24,
        alignItems: "center",
    },
    registerText: {
        fontSize: isSmallScreen ? 14 : 16,
        color: "#64748b",
        textAlign: "center",
    },
    registerTextBold: {
        color: "#1e40af",
        fontWeight: "600",
    },
});