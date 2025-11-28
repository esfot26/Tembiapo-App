import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import ContraseñaButton from "@/components/ui/ContraseñaButton";
import BotonCustom from "@/components/ui/BotonCustom";
import { RegistroLogic } from "./registro.hook";


export default function RegistroScreen() {
    const router = useRouter();

    // 💡 Traemos la lógica de registro
    const {
        username,
        setUsername,
        nombreCompleto,
        setNombreCompleto,
        telefono,
        setTelefono,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        fechaNacimiento,
        setFechaNacimiento,
        loading,
        crearCuenta,
    } = RegistroLogic();

    const [show, setShow] = useState(false);

    // 📅 Manejo del selector de fecha
    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || new Date();
        setShow(Platform.OS === "ios");
        const formatted = currentDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD
        setFechaNacimiento(formatted);
    };

    return (
        <LinearGradient
            colors={["#1E3A8A", "#2563EB", "#1E40AF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "center",
                        paddingHorizontal: 25,
                        paddingVertical: 25,
                    }}
                >
                    {/* HEADER */}
                    <View style={{ alignItems: "center", marginBottom: 12 }}>
                        <View
                            style={{
                                backgroundColor: "white",
                                borderRadius: 100,
                                padding: 8,
                            }}
                        >
                            <Feather name="user-plus" size={32} color="#1E3A8A" />
                        </View>
                        <Text
                            style={{
                                color: "white",
                                fontSize: 28,
                                fontWeight: "bold",
                                marginTop: 4,
                            }}
                        >
                            Crear Cuenta
                        </Text>
                        <Text
                            style={{ color: "#DBEAFE", marginTop: 2, fontSize: 15 }}
                        >
                            Únete a Tembiapo
                        </Text>
                    </View>

                    {/* FORMULARIO */}
                    <View
                        style={{
                            backgroundColor: "white",
                            borderRadius: 35,
                            padding: 14,
                            shadowColor: "#000",
                            shadowOpacity: 0.15,
                            shadowRadius: 10,
                            elevation: 6,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: "#1E3A8A",
                                marginBottom: 8,
                            }}
                        >
                            Regístrate
                        </Text>

                        {/* Username */}
                        <Text style={{ color: "#1E3A8A", fontWeight: "600", marginBottom: 3 }}>
                            Username
                        </Text>
                        <BotonCustom
                            iconName="user"
                            placeholder="Apodo de usuario"
                            value={username}
                            onChangeText={setUsername}
                            keyboardType="default"
                            autoCapitalize="none"
                        />

                        {/* Nombre completo */}
                        <Text style={{ color: "#1E3A8A", fontWeight: "600", marginBottom: 3 }}>
                            Nombre completo
                        </Text>
                        <BotonCustom
                            iconName="user"
                            placeholder="Nombre y Apellido"
                            value={nombreCompleto}
                            onChangeText={setNombreCompleto}
                            keyboardType="default"
                            autoCapitalize="words"
                        />

                        {/* Teléfono */}
                        <Text style={{ color: "#1E3A8A", fontWeight: "600", marginBottom: 3 }}>
                            Teléfono
                        </Text>
                        <BotonCustom
                            iconName="phone-call"
                            placeholder="0981234556"
                            value={telefono}
                            onChangeText={setTelefono}
                            keyboardType="number-pad"
                        />

                        {/* Fecha de nacimiento */}
                        <Text style={{ color: "#1E3A8A", fontWeight: "600", marginBottom: 3 }}>
                            Fecha de nacimiento
                        </Text>
                        <TouchableOpacity onPress={() => setShow(true)}>
                            <BotonCustom
                                iconName="calendar"
                                placeholder="Seleccionar fecha"
                                value={fechaNacimiento ? fechaNacimiento.split("-").reverse().join("/") : ""}
                                editable={false}
                            />
                        </TouchableOpacity>

                        {show && (
                            <DateTimePicker
                                value={fechaNacimiento ? new Date(fechaNacimiento) : new Date()}
                                mode="date"
                                display="default"
                                onChange={onChange}
                            />
                        )}

                        {/* Email */}
                        <Text style={{ color: "#1E3A8A", fontWeight: "600", marginBottom: 3 }}>
                            Correo electrónico
                        </Text>
                        <BotonCustom
                            iconName="mail"
                            placeholder="ejemplo@gmail.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        {/* Contraseña */}
                        <Text style={{ color: "#1E3A8A", fontWeight: "600", marginBottom: 3 }}>
                            Contraseña
                        </Text>
                        <ContraseñaButton
                            placeholder="***********"
                            value={password}
                            onChangeText={setPassword}
                        />

                        {/* Confirmar contraseña */}
                        <Text style={{ color: "#1E3A8A", fontWeight: "600", marginBottom: 3 }}>
                            Confirmar contraseña
                        </Text>
                        <ContraseñaButton
                            placeholder="***********"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        {/* Botón de registro */}
                        <TouchableOpacity
                            onPress={crearCuenta}
                            style={{ borderRadius: 12, marginTop: 10 }}
                            activeOpacity={0.8}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={["#2563EB", "#1E3A8A"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    paddingVertical: 14,
                                    borderRadius: 12,
                                    alignItems: "center",
                                }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text
                                        style={{
                                            color: "white",
                                            fontSize: 16,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Registrarse
                                    </Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Enlace a Login */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                marginTop: 20,
                            }}
                        >
                            <Text style={{ color: "#6B7280", fontSize: 14 }}>
                                ¿Ya tienes una cuenta?
                            </Text>
                            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                                <Text
                                    style={{
                                        color: "#2563EB",
                                        fontWeight: "bold",
                                        marginLeft: 5,
                                        fontSize: 14,
                                    }}
                                >
                                    Inicia sesión
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}
