import { View, Text, StyleSheet } from "react-native";
import { styles } from "../styles/configuracion.styles";

interface Props {
    nombre: string;
    email: string;
    colors: any;
}

export function ConfiguracionHeader({ nombre, email, colors }: Props) {
    return (
        <View style={styles.header}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>{nombre.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={[styles.nombre, { color: colors.foreground }]}>{nombre}</Text>
            <Text style={[styles.email, { color: colors.mutedForeground }]}>{email}</Text>
        </View>
    );
}

