import React from "react"
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../services/FirebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"
import {
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
    View,
    StyleSheet,
    Platform,
    TextInput,
    Alert,
    Text,
    ScrollView,
    Dimensions,
    SafeAreaView,
} from "react-native"
import { doc, setDoc } from "firebase/firestore"
import { Ionicons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")
const isSmallDevice = width < 375;

function Registro() {
    const [username, setUsername] = React.useState("")
    const [nombre, setNombre] = React.useState("")
    const [apellido, setApellido] = React.useState("")
    const [telefono, setTelefono] = React.useState("")
    const [fechaNacimiento, setFechaNacimiento] = React.useState("")  
    const [rol, setRol] = React.useState("usuario")      
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [loading, setIsLoading] = React.useState(false)
    const auth = FIREBASE_AUTH

    const crearCuenta = async () => {
        if (!email || !password || !nombre || !apellido || !telefono || !fechaNacimiento || !username) {
            Alert.alert("Todos los campos son obligatorios.")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Por favor, ingresa un email válido.")
            return
        }

        const passwordMinLength = 8
        if (password.length < passwordMinLength) {
            Alert.alert("Error", `La contraseña debe tener al menos ${passwordMinLength} caracteres.`)
            return
        }

        const usernameRegex = /^[a-zA-Z0-9_]{3,}$/
        if (!usernameRegex.test(username)) {
            Alert.alert(
                "Error",
                "El nombre de usuario solo puede contener letras, números y guiones bajos, y debe tener al menos 3 caracteres.",
            )
            return
        }

        const telefonoRegex = /^\d{8,15}$/;
        if (!telefonoRegex.test(telefono)) {
            Alert.alert("Error", "Por favor, ingresa un teléfono válido (mínimo 8 dígitos).");
            return;
        }

        const fechaRegex = /^\d{2}-\d{2}-\d{4}$/
        if (!fechaRegex.test(fechaNacimiento)) {
            Alert.alert("Error", "Por favor, ingresa la fecha de nacimiento en formato DD-MM-YYYY-")
            return
        }

        setIsLoading(true)
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password)
            const user = auth.currentUser
            console.log(user)
            alert("¡Cuenta creada exitosamente! Bienvenido " + response.user.email)
            if (user) {
                await setDoc(doc(FIREBASE_DB, "usuarios", user.uid), {
                    email: email.toLowerCase(),
                    username: username.trim(),
                    nombre: nombre.trim(),
                    apellido: apellido.trim(),
                    telefono: telefono.trim(),
                    fechaNacimiento: fechaNacimiento.trim(),
                    rol: "usuario",
                    creado: new Date().toISOString()
                });
            }
            
        } catch (error) {
            if (error instanceof Error) {
                alert("Error al crear cuenta: " + error.message)
            } else {
                alert("Error inesperado")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Ionicons name="school" size={width * 0.1} color="#1e40af" />
                        </View>
                        <Text style={styles.title}>Tembiapo</Text>

                    </View>

                    <View style={styles.formContainer}>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Información Personal</Text>

                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                                <TextInput
                                    value={nombre}
                                    style={styles.input}
                                    placeholder="Nombre"
                                    autoCapitalize="words"
                                    onChangeText={setNombre}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                                <TextInput
                                    value={apellido}
                                    style={styles.input}
                                    placeholder="Apellido"
                                    autoCapitalize="words"
                                    onChangeText={setApellido}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="at-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                                <TextInput
                                    value={username}
                                    style={styles.input}
                                    placeholder="Nombre de usuario"
                                    autoCapitalize="none"
                                    onChangeText={setUsername}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="call-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                                <TextInput
                                    value={telefono}
                                    style={styles.input}
                                    placeholder="Teléfono"
                                    keyboardType="phone-pad"
                                    onChangeText={setTelefono}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="calendar-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                                <TextInput
                                    value={fechaNacimiento}
                                    style={styles.input}
                                    keyboardType="number-pad"
                                    placeholder="Fecha de Nacimiento"
                                    onChangeText={setFechaNacimiento}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                
                            </View>
                        </View>

                        {/* Credenciales */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Credenciales de Acceso</Text>

                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                                <TextInput
                                    value={email}
                                    style={styles.input}
                                    placeholder="Correo Electrónico"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    onChangeText={setEmail}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                                <TextInput
                                    value={password}
                                    style={styles.input}
                                    placeholder="Contraseña (mín. 8 caracteres)"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#6b7280" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                            onPress={crearCuenta}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <>
                                    <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Registro

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: width * 0.07, // ligeramente menos padding en móviles
        paddingVertical: height * 0.01, // reducido para evitar espacio excesivo
    },
    header: {
        alignItems: "center",
        marginBottom: height * 0.01, // más espacio para respirar
    },
    logoContainer: {
        width: width * 0.14,
        height: width * 0.14,
        borderRadius: width * 0.07,
        backgroundColor: "#dbeafe",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: height * 0.02,
    },
    title: {
        fontSize: isSmallDevice ? width * 0.04 : width * 0.05,
        fontWeight: "800",
        color: "#1e40af",
        textAlign: "center",
    },
    subtitle: {
        fontSize: isSmallDevice ? width * 0.035 : width * 0.04,
        color: "#6b7280",
        textAlign: "center",
        lineHeight: isSmallDevice ? 10 : 14,
    },
    formContainer: {
        flex: 1,
    },
    sectionContainer: {
        marginBottom: height * 0.01,
    },
    sectionTitle: {
        fontSize: isSmallDevice ? width * 0.025 : width * 0.035,
        fontWeight: "600",
        color: "#374151",
        marginBottom: height * 0.010,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        marginBottom: height * 0.012,
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.012,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        // Sombras más suaves y consistentes
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
        minHeight: 50, // asegura tamaño táctil mínimo
    },
    inputIcon: {
        marginRight: width * 0.012,
    },
    input: {
        flex: 1,
        fontSize: isSmallDevice ? width * 0.038 : width * 0.042,
        color: "#374151",
        paddingVertical: 0, // evita padding extra en iOS
    },
    eyeIcon: {
        padding: 6,
    },
    registerButton: {
        backgroundColor: "#1e40af",
        borderRadius: 12,
        paddingVertical: height * 0.022,
        paddingHorizontal: width * 0.08,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: height * 0.03,
        minHeight: 52, // tamaño táctil recomendado
        shadowColor: "#1e40af",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 6,
    },
    registerButtonDisabled: {
        backgroundColor: "#9ca3af",
        shadowOpacity: 0,
        elevation: 0,
    },
    registerButtonText: {
        color: "#ffffff",
        fontSize: isSmallDevice ? width * 0.042 : width * 0.045,
        fontWeight: "600",
    },
})
