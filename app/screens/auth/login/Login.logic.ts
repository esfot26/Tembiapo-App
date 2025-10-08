import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import {
    GoogleAuthProvider,
    getAuth,
    onAuthStateChanged,
    signInWithCredential,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { Alert, Platform } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_DB } from "../../../../services/FirebaseConfig";
import { useNavigation } from "@react-navigation/native";





GoogleSignin.configure({
    iosClientId: "63825210908-s13rv36ltph3um4t7hgghd8rtp5otik1.apps.googleusercontent.com",
    //androidClientId: "63825210908-lg5nf87uuttbsunq3fpo3qlihjrin8sc.apps.googleusercontent.com",
    webClientId: "63825210908-o3p1o3roiicj908n6mfouslrcfhoki0u.apps.googleusercontent.com",
    offlineAccess: true,
    //forceCodeForRefreshToken: true,
});

const auth = getAuth(FIREBASE_APP);
const provider = new GoogleAuthProvider();

export const LoginLogic = () => {
    const [email, setEmail] = useState("");
    const navigation = useNavigation<any>();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState<any>(null); // O usa un tipo más específico

    // Escucha cambios de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                setLoading(true);
                try {
                    const userDocRef = doc(FIREBASE_DB, "usuarios", firebaseUser.uid); // Usa un nombre consistente
                    const userDoc = await getDoc(userDocRef);

                    if (!userDoc.exists()) {
                        await setDoc(userDocRef, {
                            email: firebaseUser.email,
                            username: firebaseUser.email?.split("@")[0] || "user",
                            nombre: firebaseUser.displayName?.split(" ")[0] || "",
                            apellido: firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
                            telefono: firebaseUser.phoneNumber || "",
                            fechaNacimiento: "",
                            creado: new Date().toISOString(),
                        });
                    }
                } catch (error) {
                    console.error("Error al verificar/crear usuario:", error);
                    Alert.alert("Error", "No se pudo cargar tu información.");
                } finally {
                    setLoading(false);
                }
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Por favor, verifica tu correo electrónico y contraseña.",
            });
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Toast.show({
                type: "success",
                text1: "Login successful",
                text2: "Has iniciado sesión correctamente ✅",
            });
        } catch (error: any) {
            let errorMessage = "Ocurrió un error inesperado.";
            if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
                errorMessage = "Credenciales inválidas. Por favor, verifica e intenta de nuevo.";
            } else if (error.code === "auth/user-not-found") {
                errorMessage = "Usuario no encontrado. Por favor, regístrate.";
            } else {
                errorMessage = error.message;
            }
            Alert.alert("Login error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginGoogle = async () => {
        setLoading(true);
        try {
            if (Platform.OS === "web") {
                await signInWithPopup(auth, provider);
            } else {
                await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
                const userInfo = await GoogleSignin.signIn();

                // Obtener el ID token de forma segura
                const idToken = userInfo.data?.idToken;
                if (!idToken) {
                    throw new Error("No se pudo obtener el token de Google");
                }

                const googleCredential = GoogleAuthProvider.credential(idToken);
                await signInWithCredential(auth, googleCredential);
            }
        } catch (error: any) {
            console.error("Error en Google Sign-In:", error);
            if (error.code === 'SIGN_IN_CANCELLED') {
                Alert.alert("Cancelado", "El inicio de sesión con Google fue cancelado.");
            } else if (error.code === 'IN_PROGRESS') {
                Alert.alert("En progreso", "Ya hay una operación de inicio de sesión en progreso.");
            } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
                Alert.alert("Google Play Services no disponibles", "Por favor, instala o actualiza Google Play Services.");
            } else {
                Alert.alert("Error", error.message || "No se pudo iniciar sesión con Google.");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        navigation,
        setPassword,
        showPassword,
        setShowPassword,
        loading,
        user,
        handleLogin,
        handleLoginGoogle,
    };
}
