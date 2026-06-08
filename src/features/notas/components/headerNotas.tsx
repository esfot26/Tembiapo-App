import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    paddingTop: number;
    styles: any;
    colors: any;
    isGuest: boolean;
    onCrear: () => void;
}

export function NotasHeader({ paddingTop, styles, colors, isGuest, onCrear }: Props) {
    return (
        <View style={[styles.header, { paddingTop }]}>
            <View style={styles.headerTop}>
                <Text style={styles.titulo}>Notas</Text>
                <TouchableOpacity
                    style={[styles.botonAgregar, { opacity: isGuest ? 0.5 : 1 }]}
                    onPress={onCrear}
                    disabled={isGuest}
                    activeOpacity={0.9}
                >
                    <Ionicons name="add" size={22} color={colors.primaryForeground} />
                </TouchableOpacity>
            </View>
        </View>
    );
}