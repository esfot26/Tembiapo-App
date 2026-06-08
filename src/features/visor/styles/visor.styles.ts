import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 10,
        paddingHorizontal: 16,
        elevation: 4,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    backBtn: {
        width: 36, height: 36, borderRadius: 18,
        justifyContent: "center", alignItems: "center",
        borderWidth: 1,
        shadowOpacity: 0.12, shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    title: {
        flex: 1, textAlign: "center",
        fontSize: 16, fontWeight: "700",
        marginHorizontal: 8,
    },
    loading: {
        flex: 1, justifyContent: "center", alignItems: "center",
    },
    unsupported: {
        flex: 1, justifyContent: "center", alignItems: "center",
        padding: 32, gap: 12,
    },
    unsupportedTitle: {
        fontSize: 18, fontWeight: "700", marginTop: 8,
    },
    unsupportedSub: {
        fontSize: 14, textAlign: "center", lineHeight: 20,
    },
    openBtn: {
        marginTop: 8, paddingHorizontal: 24, paddingVertical: 12,
        borderRadius: 12,
    },
}); 