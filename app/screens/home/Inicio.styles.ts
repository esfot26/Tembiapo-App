import { Dimensions, StyleSheet } from "react-native"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const isSmallScreen = screenWidth < 350
const isMediumScreen = screenWidth >= 350 && screenWidth < 400

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: isSmallScreen ? 16 : 20,
        paddingTop: isSmallScreen ? 20 : 30,
    },
    header: {
        marginBottom: 30,
    },
    headerContent: {
        alignItems: "flex-start",
    },
    welcomeTitle: {
        fontSize: isSmallScreen ? 24 : 28,
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: isSmallScreen ? 14 : 16,
        color: "#6b7280",
        lineHeight: 20,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#f3f4f6",
    },
    statNumber: {
        fontSize: isSmallScreen ? 20 : 24,
        fontWeight: "700",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: isSmallScreen ? 12 : 13,
        color: "#6b7280",
        fontWeight: "500",
    },
    menuContainer: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: isSmallScreen ? 16 : 18,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
        borderWidth: 1,
        borderColor: "#f3f4f6",
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: isSmallScreen ? 15 : 16,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 2,
    },
    menuItemSubtitle: {
        fontSize: isSmallScreen ? 13 : 14,
        color: "#6b7280",
        lineHeight: 18,
    },
    menuItemRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    countBadge: {
        backgroundColor: "#ef4444",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        minWidth: 20,
        alignItems: "center",
    },
    countText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
    },
    quickStatus: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#f3f4f6",
    },
    statusItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    statusText: {
        fontSize: 14,
        color: "#6b7280",
        fontWeight: "500",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#6b7280",
    },
})