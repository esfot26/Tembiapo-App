import { useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    Dimensions,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { doc, updateDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { FIREBASE_DB, FIREBASE_APP } from "../../../../services/FirebaseConfig"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import Toast from "react-native-toast-message"

const { width, height } = Dimensions.get("window")
const auth = getAuth(FIREBASE_APP)

// Define los parámetros de navegación
export type RootStackParamList = {
    Home: undefined
    EditarPerfil: {
        userData: {
            nombre: string
            apellido: string
            username: string
            telefono: string
            fechaNacimiento: string
        }
    }
}

type EditarPerfilProps = NativeStackScreenProps<RootStackParamList, "EditarPerfil">

const EditarPerfil = ({ route, navigation }: EditarPerfilProps) => {
    const { userData } = route.params

    const [formData, setFormData] = useState({
        nombre: userData?.nombre || "",
        apellido: userData?.apellido || "",
        username: userData?.username || "",
        telefono: userData?.telefono || "",
        fechaNacimiento: userData?.fechaNacimiento || "",
    })

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({})

    const validateField = (field: string, value: string) => {
        const newErrors = { ...errors }
        switch (field) {
            case "nombre":
            case "apellido":
                newErrors[field] = value.trim().length < 2
                break
            case "username":
                newErrors[field] = value.trim().length < 3
                break
            case "telefono":
                newErrors[field] =
                    value.length > 0 && !/^\d{8,15}$/.test(value.replace(/\s/g, ""))
                break
            case "fechaNacimiento":
                newErrors[field] =
                    value.length > 0 && !/^\d{2}\/\d{2}\/\d{4}$/.test(value)
                break
        }
        setErrors(newErrors)
    }

    const handleUpdate = async () => {
        if (!formData.nombre || !formData.apellido || !formData.username) {
            Alert.alert("Error", "Por favor completa todos los campos obligatorios")
            return
        }

        const hasErrors = Object.values(errors).some((error) => error)
        if (hasErrors) {
            Alert.alert("Error", "Por favor corrige los errores en el formulario")
            return
        }

        setLoading(true)
        try {
            const user = auth.currentUser
            if (user) {
                const userDocRef = doc(FIREBASE_DB, "users", user.uid)
                await updateDoc(userDocRef, formData)

                Toast.show({
                    type: "success",
                    text1: "Perfil actualizado correctamente",
                })
                navigation.goBack()
            } else {
                Alert.alert("Error", "No se encontró un usuario autenticado.")
            }
        } catch (error) {
            console.error("Error al actualizar perfil:", error)
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Ocurrió un error al actualizar el perfil. Inténtalo de nuevo.",
            })
        } finally {
            setLoading(false)
        }
    }

    const renderInput = (
        field: keyof typeof formData,
        placeholder: string,
        icon: string,
        keyboardType: any = "default",
        required = false
    ) => (
        <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, errors[field] && styles.inputError]}>
                <Ionicons
                    name={icon as any}
                    size={width * 0.06}
                    color={errors[field] ? "#ef4444" : "#6b7280"}
                    style={styles.inputIcon}
                />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#9ca3af"
                    value={formData[field]}
                    onChangeText={(text) => {
                        setFormData({ ...formData, [field]: text })
                        validateField(field, text)
                    }}
                    keyboardType={keyboardType}
                />
                {required && <Text style={styles.requiredMark}>*</Text>}
            </View>
            {errors[field] && (
                <Text style={styles.errorText}>
                    {field === "nombre" || field === "apellido"
                        ? "Mínimo 2 caracteres"
                        : field === "username"
                            ? "Mínimo 3 caracteres"
                            : field === "telefono"
                                ? "Formato de teléfono inválido"
                                : field === "fechaNacimiento"
                                    ? "DD/MM/AAAA"
                                    : ""}
                </Text>
            )}
        </View>
    )

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={width * 0.15} color="#6b7280" />
                        </View>
                        <TouchableOpacity style={styles.changePhotoButton}>
                            <Text style={styles.changePhotoText}>Cambiar foto</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.sectionTitle}>Información Personal</Text>

                        {renderInput("nombre", "Nombre", "person-outline", "default", true)}
                        {renderInput("apellido", "Apellido", "person-outline", "default", true)}
                        {renderInput("username", "Nombre de usuario", "at-outline", "default", true)}

                        <Text style={styles.sectionTitle}>Información de Contacto</Text>

                        {renderInput("telefono", "Teléfono", "call-outline", "phone-pad")}
                        {renderInput("fechaNacimiento", "(DD/MM/AAAA)", "calendar-outline")}
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                        onPress={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <>
                                <Ionicons name="checkmark" size={width * 0.05} color="white" />
                                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#f8fafc" },
    keyboardView: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: width * 0.05, paddingBottom: height * 0.05 },
    avatarContainer: { alignItems: "center", marginVertical: height * 0.03 },
    avatar: {
        width: width * 0.25,
        height: width * 0.25,
        borderRadius: width * 0.125,
        backgroundColor: "#e5e7eb",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: height * 0.015,
    },
    changePhotoButton: { paddingHorizontal: width * 0.04, paddingVertical: height * 0.01 },
    changePhotoText: { color: "#1e40af", fontSize: width * 0.035, fontWeight: "600" },
    formContainer: {
        backgroundColor: "white",
        borderRadius: width * 0.04,
        padding: width * 0.05,
        marginBottom: height * 0.03,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: width * 0.045,
        fontWeight: "600",
        color: "#374151",
        marginBottom: height * 0.02,
        marginTop: height * 0.01,
    },
    inputContainer: { marginBottom: height * 0.02 },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        borderRadius: width * 0.03,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        paddingHorizontal: width * 0.04,
        minHeight: height * 0.06,
    },
    inputError: { borderColor: "#ef4444", backgroundColor: "#fef2f2" },
    inputIcon: { marginRight: width * 0.03 },
    input: { flex: 1, fontSize: width * 0.04, color: "#1f2937", paddingVertical: height * 0.015 },
    requiredMark: { color: "#ef4444", fontSize: width * 0.045, fontWeight: "bold", marginLeft: width * 0.02 },
    errorText: { color: "#ef4444", fontSize: width * 0.032, marginTop: height * 0.005, marginLeft: width * 0.02 },
    saveButton: {
        backgroundColor: "#1e40af",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: height * 0.02,
        borderRadius: width * 0.03,
        marginTop: height * 0.02,
        shadowColor: "#1e40af",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    saveButtonDisabled: { backgroundColor: "#9ca3af", shadowOpacity: 0, elevation: 0 },
    saveButtonText: { color: "white", fontSize: width * 0.042, fontWeight: "600", marginLeft: width * 0.02 },
})

export default EditarPerfil
