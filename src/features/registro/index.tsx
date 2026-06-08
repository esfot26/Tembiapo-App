import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { RegistroLogic } from "./registro.hook";
import { RegistroForm } from "./components/RegistroForm";
import { RegistroFooter } from "./components/RegistroFooter";
import { RegistroHeader } from "./components/RegistroHeader";


export default function RegistroScreen() {
    const logic = RegistroLogic();

    return (
        <LinearGradient colors={["#1E3A8A", "#2563EB", "#1E40AF"]}
            start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 25, paddingVertical: 25 }}>
                    <RegistroHeader />
                    <RegistroForm {...logic} onSubmit={logic.crearCuenta} />
                    <RegistroFooter />
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}