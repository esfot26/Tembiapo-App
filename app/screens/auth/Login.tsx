import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
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
} from "react-native"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { FIREBASE_APP, FIREBASE_DB } from "../../../services/FirebaseConfig"
import {
    GoogleAuthProvider,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
} from "firebase/auth"
import Toast from "react-native-toast-message"
import { Ionicons } from "@expo/vector-icons"

const auth = getAuth(FIREBASE_APP)
const provider = new GoogleAuthProvider()

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const isSmallScreen = screenWidth < 330
const isMediumScreen = screenWidth >= 330 && screenWidth < 380

const Login = () => {
    const navigation = useNavigation()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Now, in place of just navigating, we check if the user document exists in Firestore
                const userDocRef = doc(FIREBASE_DB, "users", user.uid)
                const userDoc = await getDoc(userDocRef)

                if (!userDoc.exists()) {
                    console.log("✅ User document not found. Creating a new one...")
                    // We create a new document with the authentication info
                    await setDoc(userDocRef, {
                        email: user.email,
                        username: user.email?.split("@")[0] || "user", // Or a default username
                        nombre: user.displayName?.split(" ")[0] || "",
                        apellido: user.displayName?.split(" ").slice(1).join(" ") || "",
                        telefono: "",
                        fechaNacimiento: "",
                    })
                    console.log("✅ User document created in Firestore.")
                }

                // Now that the document is guaranteed, we navigate
                console.log("✅ User logged in and document verified, navigating to Home.")
                navigation.navigate("Inicio")
            }
        })
        return unsubscribe
    }, [navigation])

    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Por favor, verifica tu correo electrónico y contraseña.",
            });
            return
        }

        setIsLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password)
            console.log("✅ Inicio de sesión exitoso.")
            Toast.show({
                type: "success",
                text1: "Login successful",
                text2: "Has iniciado sesión correctamente ✅",
            })
        } catch (error: any) {
            let errorMessage = "Ocurrió un error inesperado."
            if (error.code === "auth/invalid-credential") {
                errorMessage = "Credenciales inválidas. Por favor, verifica e intenta de nuevo."
            } else if (error.code === "auth/user-not-found") {
                errorMessage = "Usuario no encontrado. Por favor, regístrate."
            } else {
                errorMessage = error.message
            }
            Alert.alert("Login error", errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLoginGoogle = async () => {
        try {
            setIsLoading(true)
            if (Platform.OS === "web") {
                await signInWithPopup(auth, provider)
            } else {
                await signInWithRedirect(auth, provider)
            }
            console.log("✅ Inicio de sesión con Google exitoso.")
            Toast.show({
                type: "success",
                text1: "Inicio de sesión exitoso",
                text2: "Has iniciado sesión con Google ✅",
            })
        } catch (error) {
            setIsLoading(false)
            console.error("❌ Error:", error)
            Alert.alert("Error", "No se pudo iniciar sesión con Google. Inténtalo de nuevo.")
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1e40af" />
            <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="school" size={screenWidth * 0.15} color="#ffffff" />
                    </View>
                    <Text style={styles.appName}>Tembiapo</Text>
                    <Text style={styles.appSubtitle}>Your study companion</Text>
                </View>

                <View style={styles.loginContainer}>
                    <Text style={styles.title}>Login</Text>

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
                            <Text style={styles.loadingText}>Iniciado sesión...</Text>
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                                <Text style={styles.loginButtonText}>Login</Text>
                            </TouchableOpacity>

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>or continue with</Text>
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
        </View>
    )
}

export default Login

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
})
