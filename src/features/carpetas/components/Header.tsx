import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";


export function Header({
    path,
    colors,
    insets,
    onBack,
}: {
    path: { id: string; name: string }[];
    colors: any;
    insets: any;
    onBack: () => void;
}) {
    return (
        <View
            style={[
                styles.header,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    paddingTop: insets.top + 4,
                },
            ]}
        >
            {/* Botón atrás */}
            <View style={styles.headerSide}>
                {path.length > 0 && (
                    <TouchableOpacity
                        onPress={onBack}
                        activeOpacity={0.7}
                        style={[
                            styles.backButton,
                            {
                                backgroundColor: colors.primary,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <Ionicons name="arrow-back" size={20} color={colors.primaryForeground ?? "#fff"} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Título */}
            <View style={styles.headerCenter}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[styles.headerTitle, { color: colors.foreground }]}
                >
                    {path.length === 0 ? "Mis carpetas" : path[path.length - 1].name}
                </Text>
            </View>

            {/* Espaciador derecho */}
            <View style={styles.headerSide} />
        </View>
    );
}

const styles = StyleSheet.create({
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

});