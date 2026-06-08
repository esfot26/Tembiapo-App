import { View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import BotonGradiente from "@/components/ui/BotonGradiente";
import { styles } from "../styles/verificarCorreo.styles";

interface Props {
    email: string;
    cooldown: number;
    checking: boolean;
    sending: boolean;
    onVerificar: () => void;
    onReenviar: () => void;
    onVolverLogin: () => void;
}

export function VerificarCorreoCard({
    email, cooldown, checking, sending,
    onVerificar, onReenviar, onVolverLogin,
}: Props) {
    const reenviarLabel = sending ? "Enviando..."
        : cooldown > 0 ? `Reenviar en ${cooldown}s`
            : "Reenviar correo";

    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Feather name="mail" size={36} color="#1E3A8A" />
            </View>

            <Text style={styles.title}>Verifica tu correo</Text>
            <Text style={styles.description}>Enviamos un enlace de verificación a</Text>
            <Text style={styles.emailText}>{email || "tu correo"}</Text>
            <Text style={styles.description}>Abre el enlace y luego presiona el botón de abajo.</Text>

            <View style={styles.buttonRow}>
                <BotonGradiente
                    text={checking ? "Comprobando..." : "Ya verifiqué ✓"}
                    onPress={onVerificar}
                    colors={["#2563EB", "#1E3A8A"]}
                />
            </View>

            <View style={styles.buttonRow}>
                <BotonGradiente
                    text={reenviarLabel}
                    onPress={onReenviar}
                    colors={["#64748B", "#475569"]}
                />
            </View>

            <View style={styles.separator} />

            <TouchableOpacity onPress={onVolverLogin} style={styles.backButton}>
                <Feather name="arrow-left" size={16} color="#64748B" />
                <Text style={styles.backText}>No puedo verificar, volver al inicio de sesión</Text>
            </TouchableOpacity>
        </View>
    );
}