import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export function RegistroFooter() {
    const router = useRouter();
    return (
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
            <Text style={{ color: "#6B7280", fontSize: 14 }}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={{ color: "#2563EB", fontWeight: "bold", marginLeft: 5, fontSize: 14 }}>
                    Inicia sesión
                </Text>
            </TouchableOpacity>
        </View>
    );
}