import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { VerificarCorreoCard } from "./components/verificarForm";
import { useVerificarCorreo } from "./hooks/useVerificarCorreo";
import { styles } from "./styles/verificarCorreo.styles";

export default function VerificarCorreo() {
    const { email, cooldown, checking, sending,
        reenviar, verificarAhora, volverAlLogin } = useVerificarCorreo();

    return (
        <LinearGradient colors={["#1E3A8A", "#2563EB", "#1E40AF"]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.wrapper}>
                    <VerificarCorreoCard
                        email={email}
                        cooldown={cooldown}
                        checking={checking}
                        sending={sending}
                        onVerificar={verificarAhora}
                        onReenviar={reenviar}
                        onVolverLogin={volverAlLogin}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}