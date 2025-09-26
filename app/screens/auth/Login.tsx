import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StatusBar,
} from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_DB } from "../../../services/FirebaseConfig";
import {
    GoogleAuthProvider,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithCredential
} from "firebase/auth";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const auth = getAuth(FIREBASE_APP);
const provider = new GoogleAuthProvider();

GoogleSignin.configure({
    iosClientId: "63825210908-s13rv36ltph3um4t7hgghd8rtp5otik1.apps.googleusercontent.com",
    //androidClientId: "63825210908-lg5nf87uuttbsunq3fpo3qlihjrin8sc.apps.googleusercontent.com",
    webClientId: "63825210908-o3p1o3roiicj908n6mfouslrcfhoki0u.apps.googleusercontent.com",
    offlineAccess: true,
    //forceCodeForRefreshToken: true,
});


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isSmallScreen = screenWidth < 330;
const isMediumScreen = screenWidth >= 330 && screenWidth < 380;

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Este useEffect se encargará de la redirección.
    // Es la única fuente de verdad para la navegación.
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("✅ Estado de autenticación cambiado. Usuario detectado.");
                setIsLoading(true); // Muestra el indicador de carga mientras se verifica el documento

                try {
                    // Verifica si el documento del usuario ya existe en Firestore
                    const userDocRef = doc(FIREBASE_DB, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (!userDoc.exists()) {
                        console.log("✅ Documento de usuario no encontrado. Creando uno nuevo...");
                        // Crea un nuevo documento con la información de autenticación
                        await setDoc(userDocRef, {
                            email: user.email,
                            username: user.email?.split("@")[0] || "user",
                            nombre: user.displayName?.split(" ")[0] || "",
                            apellido: user.displayName?.split(" ").slice(1).join(" ") || "",
                            telefono: "",
                            fechaNacimiento: "",
                        });
                        console.log("✅ Documento de usuario creado en Firestore.");
                    }

                    // Navega a la pantalla de inicio una vez que el documento es verificado o creado
                    console.log("✅ Usuario verificado, navegando a 'Inicio'.");
                    navigation.navigate("Inicio");
                } catch (error) {
                    console.error("❌ Error al verificar/crear el documento del usuario:", error);
                    Alert.alert("Error de autenticación", "No se pudo completar el proceso de inicio de sesión.");
                } finally {
                    setIsLoading(false); // Oculta el indicador de carga
                }
            } else {
                console.log("❌ Usuario no autenticado.");
            }
        });
        return unsubscribe;
    }, [navigation]);

    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Por favor, verifica tu correo electrónico y contraseña.",
            });
            return;
        }

        setIsLoading(true);
        try {
            // El inicio de sesión por email/contraseña solo se encarga de la autenticación.
            // La navegación se gestiona en el `useEffect` una vez que el estado de autenticación cambia.
            await signInWithEmailAndPassword(auth, email, password);
            console.log("✅ Inicio de sesión con correo y contraseña exitoso.");
            Toast.show({
                type: "success",
                text1: "Login successful",
                text2: "Has iniciado sesión correctamente ✅",
            });
        } catch (error: any) {
            let errorMessage = "Ocurrió un error inesperado.";
            if (error.code === "auth/invalid-credential") {
                errorMessage = "Credenciales inválidas. Por favor, verifica e intenta de nuevo.";
            } else if (error.code === "auth/user-not-found") {
                errorMessage = "Usuario no encontrado. Por favor, regístrate.";
            } else {
                errorMessage = error.message;
            }
            Alert.alert("Login error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginGoogle = async () => {
        setIsLoading(true);
        try {
            if (Platform.OS === "web") {
                console.log("Iniciando sesión con Google para Web...");
                await signInWithPopup(auth, provider);
                console.log("✅ Inicio de sesión con Google (Web) exitoso.");
            } else {
                console.log("Iniciando sesión con Google para Móvil...");

                // Verificar servicios de Google Play
                await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
                console.log("✅ Google Play Services están disponibles.");

                // Iniciar sesión con Google
                const userInfo = await GoogleSignin.signIn();
                console.log("✅ Google Sign-In exitoso");

                // OBTENER EL ID TOKEN CORRECTAMENTE - FORMA COMPATIBLE
                let idToken: string | null = null;

                // Intentar diferentes formas de obtener el token según la versión
                if (userInfo.data && userInfo.data.idToken) {
                    // Para algunas versiones
                    idToken = userInfo.data.idToken;
                } else if (userInfo.idToken) {
                    // Para otras versiones
                    idToken = userInfo.idToken;
                } else if (userInfo.data && (userInfo.data as any).idToken) {
                    // Como fallback
                    idToken = (userInfo.data as any).idToken;
                }

                if (!idToken) {
                    throw new Error("No se pudo obtener el token de Google");
                }

                console.log("🔑 Token obtenido, creando credencial...");

                // Crear credencial de Google
                const googleCredential = GoogleAuthProvider.credential(idToken);

                console.log("🔑 Credencial creada, autenticando con Firebase...");

                // Autenticar con Firebase
                const result = await signInWithCredential(auth, googleCredential);
                console.log("✅ Autenticación con Firebase exitosa:", result.user.email);
            }
        } catch (error: any) {
            console.error("❌ Error completo al iniciar sesión con Google:", error);
            console.error("❌ Código de error:", error.code);
            console.error("❌ Mensaje de error:", error.message);

            if (error.code === 'SIGN_IN_CANCELLED') {
                Alert.alert("Inicio de sesión cancelado", "El inicio de sesión con Google fue cancelado.");
            } else if (error.code === 'IN_PROGRESS') {
                Alert.alert("Operación en progreso", "Ya hay una operación de inicio de sesión en progreso.");
            } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
                Alert.alert("Google Play Services no disponibles", "Por favor, instala o actualiza Google Play Services.");
            } else {
                Alert.alert("Error de inicio de sesión", error.message || "No se pudo iniciar sesión con Google. Inténtalo de nuevo.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("🔍 useEffect de autenticación inicializado");

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("🔄 onAuthStateChanged disparado. Usuario:", user ? user.email : "null");

            if (user) {
                console.log("✅ Usuario autenticado detectado:", user.uid);
                setIsLoading(true);

                try {
                    // Pequeño delay para asegurar que todo esté listo
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const userDocRef = doc(FIREBASE_DB, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (!userDoc.exists()) {
                        console.log("📝 Creando nuevo documento de usuario...");
                        await setDoc(userDocRef, {
                            email: user.email,
                            username: user.email?.split("@")[0] || "user",
                            nombre: user.displayName?.split(" ")[0] || "",
                            apellido: user.displayName?.split(" ").slice(1).join(" ") || "",
                            telefono: user.phoneNumber || "",
                            fechaNacimiento: "",
                            createdAt: new Date().toISOString(),
                        });
                        console.log("✅ Documento de usuario creado");
                    } else {
                        console.log("✅ Documento de usuario ya existe");
                    }

                    console.log("🚀 Intentando navegar a Inicio...");
                    // Diferentes formas de navegar según tu configuración
                    if (navigation && typeof navigation.navigate === 'function') {
                        navigation.navigate("Inicio");
                        console.log("✅ Navegación exitosa");
                    } else {
                        console.error("❌ Navigation no está disponible");
                    }

                } catch (error) {
                    console.error("❌ Error en useEffect:", error);
                    Alert.alert("Error", "Hubo un problema al cargar tu información.");
                } finally {
                    setIsLoading(false);
                }
            } else {
                console.log("👤 No hay usuario autenticado");
                setIsLoading(false);
            }
        });

        return () => {
            console.log("🧹 Limpiando useEffect de autenticación");
            unsubscribe();
        };
    }, [navigation]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1e40af" />
            <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="school" size={screenWidth * 0.15} color="#ffffff" />
                    </View>
                    <Text style={styles.appName}>Tembiapo</Text>
                    <Text style={styles.appSubtitle}></Text>
                </View>

                <View style={styles.loginContainer}>
                    <Text style={styles.title}>Iniciar sesión</Text>

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
                        <TextInput
                            value={email}
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#94a3b8"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
                        <TextInput
                            value={password}
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#94a3b8"
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#1e40af" />
                            <Text style={styles.loadingText}>Iniciando sesión...</Text>
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                            </TouchableOpacity>

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>o</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <TouchableOpacity onPress={handleLoginGoogle} style={styles.googleButton}>
                                <Ionicons name="logo-google" size={20} color="#db4437" />
                                <Text style={styles.googleButtonText}>Continua con Google</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate("Registro")} style={styles.registerLink}>
                                <Text style={styles.registerText}>
                                    No tienes una cuenta? <Text style={styles.registerTextBold}>Regístrate aquí</Text>
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </KeyboardAvoidingView>
            <Toast />
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1e40af", // Educational blue primary
    },
    keyboardContainer: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: screenWidth * 0.05,
    },
    header: {
        alignItems: "center",
        marginBottom: screenHeight * 0.05,
    },
    logoContainer: {
        width: screenWidth * 0.2,
        height: screenWidth * 0.2,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: screenWidth * 0.1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    appName: {
        fontSize: isSmallScreen ? 28 : isMediumScreen ? 32 : 36,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 8,
    },
    appSubtitle: {
        fontSize: isSmallScreen ? 14 : 16,
        color: "rgba(255, 255, 255, 0.8)",
        textAlign: "center",
    },
    loginContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: screenWidth * 0.06,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    title: {
        fontSize: isSmallScreen ? 22 : 26,
        fontWeight: "700",
        color: "#1e293b",
        textAlign: "center",
        marginBottom: screenHeight * 0.03,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        height: screenHeight * 0.06,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: isSmallScreen ? 14 : 16,
        color: "#1e293b",
    },
    eyeIcon: {
        padding: 4,
    },
    loginButton: {
        backgroundColor: "#1e40af",
        borderRadius: 12,
        height: screenHeight * 0.06,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        shadowColor: "#1e40af",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        color: "#ffffff",
        fontSize: isSmallScreen ? 16 : 18,
        fontWeight: "600",
    },
    loadingContainer: {
        alignItems: "center",
        paddingVertical: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#64748b",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#e2e8f0",
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: "#64748b",
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        height: screenHeight * 0.06,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    googleButtonText: {
        marginLeft: 12,
        fontSize: isSmallScreen ? 14 : 16,
        color: "#374151",
        fontWeight: "500",
    },
    registerLink: {
        marginTop: 24,
        alignItems: "center",
    },
    registerText: {
        fontSize: isSmallScreen ? 14 : 16,
        color: "#64748b",
        textAlign: "center",
    },
    registerTextBold: {
        color: "#1e40af",
        fontWeight: "600",
    },
});
