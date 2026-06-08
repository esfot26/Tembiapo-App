import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/nota.editor.styles";

interface Props {
    onVolver: () => void;
    colors: any;
}

export function GuestWarning({ onVolver, colors }: Props) {
    return (
        <>
            <View style={{
                backgroundColor: "#fef3c7", borderRadius: 12,
                padding: 16, marginBottom: 16, alignItems: "center", gap: 12,
            }}>
                <Ionicons name="lock-closed" size={32} color="#d97706" />
                <Text style={{ fontSize: 14, color: "#d97706", fontWeight: "600", textAlign: "center" }}>
                    Modo Invitado
                </Text>
                <Text style={{ fontSize: 13, color: "#b45309", textAlign: "center" }}>
                    Para crear notas, debés iniciar sesión con tu cuenta.
                </Text>
            </View>

            <TouchableOpacity onPress={onVolver} activeOpacity={0.8}
                style={[styles.actionButton, { backgroundColor: colors.destructive, width: "100%" }]}>
                <Ionicons name="close-circle-outline" size={22} color="white" />
                <Text style={styles.actionText}>Volver</Text>
            </TouchableOpacity>
        </>
    );
}