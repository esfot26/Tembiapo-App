import { FIREBASE_AUTH, FIREBASE_DB } from "@/src/services/FirebaseConfig";
import { useRouter } from "expo-router";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";

WebBrowser.maybeCompleteAuthSession();

export const LoginLogic = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Google Auth
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "63825210908-lg5nf87uuttbsunq3fpo3qlihjrin8sc.apps.googleusercontent.com",
        iosClientId: "63825210908-s13rv36ltph3um4t7hgghd8rtp5otik1.apps.googleusercontent.com",
        webClientId: "63825210908-o3p1o3roiicj908n6mfouslrcfhoki0u.apps.googleusercontent.com",
    });

    // Guardar solo UID
    const guardarUID = async (uid: string) => {
        await SecureStore.setItemAsync("uid", uid);
    };

    // Crear doc usuario si no existe (para Google)
    const crearUsuarioEnFirestore = async (firebaseUser: any) => {
        try {
            const userDocRef = doc(FIREBASE_DB, "usuarios", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    email: firebaseUser.email,
                    username: firebaseUser.email?.split("@")[0] || "user",
                    nombre: firebaseUser.displayName?.split(" ")[0] || "",
                    apellido: firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
                    telefono: firebaseUser.phoneNumber || "",
                    fechaNacimiento: "",
                    estado: "activo",
                    creado: new Date().toISOString(),
                });
            }
        } catch (error) {
            console.log("Error creando usuario:", error);
        }
    };

    // ---------------------------------------------
    // 🔥 LOGIN CON EMAIL - CORREGIDO
    // ---------------------------------------------
    const handleLogin = async () => {
        try {
            setLoading(true);

            const resp = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const user = resp.user;

            // 🚨 BLOQUEAR SI EL CORREO NO ESTÁ VERIFICADO
            if (!user.emailVerified) {
                Toast.show({
                    type: "info",
                    text1: "Verifica tu cuenta",
                    text2: "Revisa tu correo antes de iniciar sesión.",
                });

                router.replace("/(auth)/verificar-correo/verificarCorreo");
                return;
            }

            await guardarUID(user.uid);
            await crearUsuarioEnFirestore(user);

            router.replace("/(tabs)/inicio");

        } catch (error: any) {
            console.log("Error al iniciar sesión:", error);
            Toast.show({
                type: "error",
                text1: "Login fallido",
                text2: "Correo o contraseña incorrectos",
            });
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------------------------
    // 🔵 LOGIN CON GOOGLE - SIN BLOQUEO (Google ya viene verificado)
    // ---------------------------------------------
    const handleLoginGoogle = async () => {
        try {
            setLoading(true);

            const res = await promptAsync();
            if (res?.type !== "success") return;

            const credential = GoogleAuthProvider.credential(
                res.authentication?.idToken,
                res.authentication?.accessToken
            );

            const result = await signInWithCredential(FIREBASE_AUTH, credential);
            const user = result.user;

            await guardarUID(user.uid);
            await crearUsuarioEnFirestore(user);

            router.replace("/(tabs)/inicio");
        } catch (error) {
            console.log("Error login Google:", error);
            Toast.show({
                type: "error",
                text1: "Error con Google",
                text2: "Intenta nuevamente",
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        loading,
        handleLogin,
        handleLoginGoogle,
    };
};
