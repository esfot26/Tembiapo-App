import { FIREBASE_AUTH, FIREBASE_DB } from "@/src/services/FirebaseConfig";
import { useRouter } from "expo-router";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";

// Configurar Google Sign In una sola vez
GoogleSignin.configure({
    webClientId: "983107385937-27vc2fuut7kn06sr376njbib4lhnnq3p.apps.googleusercontent.com",
    offlineAccess: true,
});

export const LoginLogic = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // 👈 false, no true

    const guardarUID = async (uid: string) => {
        await SecureStore.setItemAsync("uid", uid);
    };

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

    const handleLogin = async () => {
        if (!email.trim() && !password.trim()) {
            Toast.show({ type: "error", text1: "Campos requeridos", text2: "Por favor ingresa tu correo y contraseña." });
            return;
        }
        if (!email.trim()) {
            Toast.show({ type: "error", text1: "Correo requerido", text2: "El campo de correo no puede estar vacío." });
            return;
        }
        if (!password.trim()) {
            Toast.show({ type: "error", text1: "Contraseña requerida", text2: "El campo de contraseña no puede estar vacío." });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Toast.show({ type: "error", text1: "Correo inválido", text2: "Ingresa un correo con formato válido." });
            return;
        }

        try {
            setLoading(true);
            const resp = await signInWithEmailAndPassword(FIREBASE_AUTH, email.trim(), password);
            const user = resp.user;

            if (!user.emailVerified) {
                Toast.show({ type: "info", text1: "Verifica tu cuenta", text2: "Revisa tu bandeja de entrada." });
                router.replace("/(auth)/verificar-correo/verificarCorreo");
                return;
            }

            await guardarUID(user.uid);
            await crearUsuarioEnFirestore(user);
            Toast.show({ type: "success", text1: "¡Bienvenido!", text2: "Inicio de sesión exitoso." });
            router.replace("/(tabs)/inicio");

        } catch (error: any) {
            const firebaseErrors: Record<string, { title: string; message: string }> = {
                "auth/wrong-password": { title: "Contraseña incorrecta", message: "La contraseña ingresada no es válida." },
                "auth/user-not-found": { title: "Usuario no encontrado", message: "No existe una cuenta con ese correo." },
                "auth/invalid-credential": { title: "Credenciales incorrectas", message: "El correo o la contraseña no son correctos." },
                "auth/invalid-email": { title: "Correo inválido", message: "El formato del correo electrónico no es válido." },
                "auth/user-disabled": { title: "Cuenta deshabilitada", message: "Esta cuenta ha sido deshabilitada." },
                "auth/too-many-requests": { title: "Demasiados intentos", message: "Cuenta bloqueada temporalmente." },
                "auth/network-request-failed": { title: "Sin conexión", message: "Verifica tu conexión a internet." },
            };
            const knownError = firebaseErrors[error.code];
            Toast.show({
                type: "error",
                text1: knownError?.title ?? "Error al iniciar sesión",
                text2: knownError?.message ?? "Ocurrió un error inesperado.",
            });
        } finally {
            setLoading(false);
        }
    };

    // ── Google Login nativo ─────────────────────────────────────
    const handleLoginGoogle = async () => {
        try {
            setLoading(true);

            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const idToken = userInfo.data?.idToken;

            if (!idToken) {
                Toast.show({ type: "error", text1: "Error con Google", text2: "No se obtuvo el token." });
                return;
            }

            const credential = GoogleAuthProvider.credential(idToken);
            const result = await signInWithCredential(FIREBASE_AUTH, credential);
            const user = result.user;

            await guardarUID(user.uid);
            await crearUsuarioEnFirestore(user);

            Toast.show({ type: "success", text1: "¡Bienvenido!", text2: `Hola, ${user.displayName ?? "usuario"}` });
            router.replace("/(tabs)/inicio");

        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // usuario canceló, no mostramos error
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Toast.show({ type: "info", text1: "En progreso", text2: "Ya hay un inicio de sesión en curso." });
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Toast.show({ type: "error", text1: "Google Play no disponible", text2: "Actualizá Google Play Services." });
            } else {
                console.log("Error Google:", error);
                Toast.show({ type: "error", text1: "Error con Google", text2: "Intenta nuevamente." });
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        showPassword, setShowPassword,
        loading,
        handleLogin,
        handleLoginGoogle,
    };
};