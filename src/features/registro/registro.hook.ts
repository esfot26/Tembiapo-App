import React, { useState } from "react";
import {
    validarCamposObligatorios,
    validarEmail,
    validarContraseña,
    validarUsername,
    validarTelefono,
    validarFecha,
} from "@/src/utils/validacion";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "@/src/services/FirebaseConfig";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export interface RegistroFormValues {
    username: string;
    setUsername: (v: string) => void;
    nombreCompleto: string;
    setNombreCompleto: (v: string) => void;
    telefono: string;
    setTelefono: (v: string) => void;
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    confirmPassword: string;
    setConfirmPassword: (v: string) => void;
    fechaNacimiento: string;
    setFechaNacimiento: (v: string) => void;
    loading: boolean;
    crearCuenta: () => void;
}

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
                creadoEn: serverTimestamp(),
            });

            await sendEmailVerification(user);

            Toast.show({
                type: "success",
                text1: "Cuenta creada 🎉",
                text2: "Te enviamos un correo para verificar tu cuenta.",
            });

            router.replace("/(auth)/verificar-correo");

        } catch (error: any) {
            console.log("Error registro:", error.code);
            console.log("Código:", error.code);
            console.log("Mensaje:", error.message);
            const firebaseErrors: Record<string, string> = {
                "auth/email-already-in-use": "Este correo ya está registrado.",
                "auth/invalid-email": "El formato del correo no es válido.",
                "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
                "auth/network-request-failed": "Sin conexión. Verifica tu internet.",
                "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.",
                "auth/operation-not-allowed": "Registro deshabilitado. Contacta soporte.",
            };

            Toast.show({
                type: "error",
                text1: "Error al registrar",
                text2: firebaseErrors[error.code] ?? "Ocurrió un error inesperado.",
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
