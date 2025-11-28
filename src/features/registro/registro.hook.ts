// src/hooks/RegistroLogic.ts

import React, { useState } from "react";
import {
    validarCamposObligatorios,
    validarEmail,
    validarContraseña,
    validarUsername,
    validarTelefono,
    validarFecha,
} from "@/src/utils/validacion";

import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "@/src/services/FirebaseConfig";

import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";

import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export const RegistroLogic = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [loading, setIsLoading] = useState(false);

    const rol = "usuario";
    const estado = "Activo";

    const guardarUID = async (uid: string) => {
        await SecureStore.setItemAsync("uid", uid);
    };

    const crearCuenta = async () => {
        const campos = { email, password, nombreCompleto, telefono, fechaNacimiento, username };

        // Validación general
        const errorCampos = validarCamposObligatorios(campos);
        if (errorCampos) {
            Toast.show({
                type: "error",
                text1: "Error de Registro",
                text2: errorCampos,
            });
            return;
        }

        // Validaciones específicas
        const validaciones = [
            validarEmail(email),
            validarContraseña(password),
            validarUsername(username),
            validarTelefono(telefono),
            validarFecha(fechaNacimiento),
        ];

        const error = validaciones.find((v) => v !== null);
        if (error) {
            Toast.show({
                type: "error",
                text1: "Error de Registro",
                text2: error,
            });
            return;
        }

        // Confirmación de contraseñas
        if (password !== confirmPassword) {
            Toast.show({
                type: "error",
                text1: "Error de Registro",
                text2: "Las contraseñas no coinciden.",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Crear usuario Firebase Auth
            const resp = await createUserWithEmailAndPassword(
                FIREBASE_AUTH,
                email,
                password
            );

            const user = resp.user;

            // Guardar UID
            await guardarUID(user.uid);

            // Guardar documento Firestore
            await setDoc(doc(FIREBASE_DB, "usuarios", user.uid), {
                email: email.toLowerCase(),
                username: username.trim(),
                nombreCompleto: nombreCompleto.trim(),
                telefono: telefono.trim(),
                fechaNacimiento,
                rol,
                estado,
                creado: new Date().toISOString(),
            });

            // 🔥 ENVIAR VERIFICACIÓN DE CORREO
            await sendEmailVerification(user);

            Toast.show({
                type: "success",
                text1: "Cuenta creada 🎉",
                text2: "Te enviamos un correo para verificar tu cuenta.",
            });

            // 👉 Enviar a pantalla de verificación
            router.replace("/(auth)/verificar-correo/verificarCorreo");

        } catch (error: any) {
            const errorMessage = error.code
                ? error.code.replace("auth/", "").split("-").join(" ")
                : error.message;

            Toast.show({
                type: "error",
                text1: "Error al registrar",
                text2: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
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
    };
};
