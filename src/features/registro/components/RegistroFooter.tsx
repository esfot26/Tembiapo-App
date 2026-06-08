import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export function RegistroFooter() {
    const router = useRouter();

    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 24,
            marginBottom: 20 // Añade un poco de aire al final
        }}>
            <Text style={{
                color: "#CBD5E1", // Un gris azulado claro para mejor lectura
                fontSize: 14,
                fontWeight: "500"
            }}>
                ¿Ya tienes una cuenta?
            </Text>

            <TouchableOpacity
                onPress={() => router.push("/(auth)/login")}
                activeOpacity={0.7}
            >
                <Text style={{
                    color: "#FFFFFF", // Blanco para máxima visibilidad
                    fontWeight: "bold",
                    marginLeft: 6,
                    fontSize: 14,
                    textDecorationLine: 'underline',
                    textDecorationColor: "#38BDF8" // Un subrayado sutil en azul
                }}>
                    Inicia sesión
                </Text>
            </TouchableOpacity>
        </View>
    );
}