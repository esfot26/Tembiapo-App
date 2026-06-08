import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BotonCustom from "@/components/ui/BotonCustom";
import ContraseñaButton from "@/components/ui/ContraseñaButton";
import { FechaNacimientoPicker } from "./FechaNacimientoPicker";
import { RegistroFormValues } from "../registro.hook";

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <View style={{ marginBottom: 2 }}>
            <Text style={{ color: "#1E3A8A", fontWeight: "600", marginBottom: 3 }}>
                {label}
            </Text>
            {children}
        </View>
    );
}
interface Props extends RegistroFormValues {
    loading: boolean;
    onSubmit: () => void;
}

export function RegistroForm({
    username, setUsername,
    nombreCompleto, setNombreCompleto,
    telefono, setTelefono,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    fechaNacimiento, setFechaNacimiento,
    loading,
    onSubmit,
}: Props) {
    return (
        <View style={{
            backgroundColor: "white",
            borderRadius: 35,
            padding: 14,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 6,
        }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1E3A8A", marginBottom: 8, textAlign: "center" }}>
                Regístrate
            </Text>

            <Campo label="Username">
                <BotonCustom iconName="user" placeholder="Apodo de usuario"
                    value={username} onChangeText={setUsername}
                    keyboardType="default" autoCapitalize="none" />
            </Campo>

            <Campo label="Nombre completo">
                <BotonCustom iconName="user" placeholder="Nombre y Apellido"
                    value={nombreCompleto} onChangeText={setNombreCompleto}
                    keyboardType="default" autoCapitalize="words" />
            </Campo>

            <Campo label="Teléfono">
                <BotonCustom iconName="phone-call" placeholder="0981234556"
                    value={telefono} onChangeText={setTelefono} keyboardType="number-pad" />
            </Campo>

            <Campo label="Fecha de nacimiento">
                <FechaNacimientoPicker value={fechaNacimiento} onChange={setFechaNacimiento} />
            </Campo>

            <Campo label="Correo electrónico">
                <BotonCustom iconName="mail" placeholder="ejemplo@gmail.com"
                    value={email} onChangeText={setEmail}
                    keyboardType="email-address" autoCapitalize="none" />
            </Campo>

            <Campo label="Contraseña">
                <ContraseñaButton placeholder="***********" value={password} onChangeText={setPassword} />
            </Campo>

            <Campo label="Confirmar contraseña">
                <ContraseñaButton placeholder="***********" value={confirmPassword} onChangeText={setConfirmPassword} />
            </Campo>

            <TouchableOpacity onPress={onSubmit} style={{ borderRadius: 12, marginTop: 10 }}
                activeOpacity={0.8} disabled={loading}>
                <LinearGradient colors={["#2563EB", "#1E3A8A"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={{ paddingVertical: 14, borderRadius: 12, alignItems: "center" }}>
                    {loading
                        ? <ActivityIndicator color="#FFF" />
                        : <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Registrarse</Text>
                    }
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}