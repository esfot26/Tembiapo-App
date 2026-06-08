import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    header: { alignItems: "center", paddingTop: 30, paddingBottom: 20, paddingHorizontal: 20 },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    avatar: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 12 },
    avatarText: { fontSize: 40, fontWeight: "500", color: "#FFF" },
    nombre: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
    email: { fontSize: 14, marginBottom: 8 },
    name: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "500",
    },
    statsRow: {
        flexDirection: "row",
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
    },
    settingsSection: { paddingHorizontal: 20 },
    version: { textAlign: "center", marginTop: 50, marginBottom: 50 },
});