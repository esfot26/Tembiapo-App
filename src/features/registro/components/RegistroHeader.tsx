import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export function RegistroHeader() {
    return (
        <View style={{ alignItems: "center", marginBottom: 12 }}>
            <View style={{ backgroundColor: "white", borderRadius: 100, padding: 8 }}>
                <Feather name="user-plus" size={32} color="#1E3A8A" />
            </View>
            <Text style={{ color: "white", fontSize: 28, fontWeight: "bold", marginTop: 4 }}>
                Crear Cuenta
            </Text>
            <Text style={{ color: "#DBEAFE", marginTop: 2, fontSize: 15 }}>
                Únete a Tembiapo
            </Text>
        </View>
    );
}