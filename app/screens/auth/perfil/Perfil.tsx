import React, { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Dimensions,
    ScrollView,
} from "react-native"
import { doc, getDoc } from "firebase/firestore"
import { getAuth, signOut } from "firebase/auth"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { FIREBASE_APP, FIREBASE_DB } from "../../../../services/FirebaseConfig"
import { Ionicons } from "@expo/vector-icons"

interface UserData {
    email: string
    username: string
    nombre: string
    apellido: string
    telefono: string
    fechaNacimiento: string
}

const auth = getAuth(FIREBASE_APP)
const { width, height } = Dimensions.get("window")

const isSmallScreen = width < 350
const isMediumScreen = width >= 350 && width < 400
const isLargeScreen = width >= 400

const Perfil = () => {
    const [userData, setUserData] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation<any>()

    const fetchUserData = async (uid: string) => {
        setLoading(true)
        try {
            const userDocRef = doc(FIREBASE_DB, "usuarios", uid)
            const userDoc = await getDoc(userDocRef)

            if (userDoc.exists()) {
                const data = userDoc.data()
                setUserData({
                    email: data.email || "",
                    username: data.username || "",
                    nombre: data.nombre || "",
                    apellido: data.apellido || "",
                    telefono: data.telefono || "",
                    fechaNacimiento: data.fechaNacimiento || "",
                })
            } else {
                setUserData(null)
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error)
            Alert.alert("Error", "Error al cargar el perfil. Inténtalo de nuevo.")
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            const user = auth.currentUser
            if (user) {
                fetchUserData(user.uid)
            } else {
                setUserData(null)
                setLoading(false)
                navigation.navigate("Login")
            }
        }, [navigation]),
    )

    const handleLogout = async () => {
        Alert.alert("Cerrar Sesión", "¿Estás seguro de que quieres cerrar sesión?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Cerrar Sesión",
                style: "destructive",
                onPress: async () => {
                    try {
                        await signOut(auth)
                        console.log("Sesión cerrada correctamente.")
                    } catch (error) {
                        console.error("Error al cerrar sesión:", error)
                        Alert.alert("Error", "No se pudo cerrar la sesión.")
                    }
                },
            },
        ])
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#1e40af" />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        )
    }

    if (!userData) {
        return (
            <View style={styles.center}>
                <Ionicons name="person-circle-outline" size={80} color="#9ca3af" />
                <Text style={styles.errorText}>No se pudieron cargar los datos del usuario.</Text>
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.loginButtonText}>Ir a iniciar sesión</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

            <View style={styles.profileCard}>
                <Text style={styles.sectionTitle}>Información Personal</Text>

                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="person" size={20} color="#1e40af" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.label}>Nombre Completo</Text>
                        <Text style={styles.value}>
                            {userData.nombre} {userData.apellido}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="at" size={20} color="#1e40af" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.label}>Usuario</Text>
                        <Text style={styles.value}>{userData.username}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="mail" size={20} color="#1e40af" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{userData.email}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="call" size={20} color="#1e40af" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.label}>Teléfono</Text>
                        <Text style={styles.value}>{userData.telefono || "No especificado"}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="calendar" size={20} color="#1e40af" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.label}>Fecha de Nacimiento</Text>
                        <Text style={styles.value}>{userData.fechaNacimiento || "No especificado"}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate("EditarPerfil", { userData: userData })}
                >
                    <Ionicons name="create-outline" size={20} color="white" />
                    <Text style={styles.editButtonText}>Editar Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="white" />
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        paddingHorizontal: width * 0.05,
    },
    header: {
        paddingTop: height * 0.02,
        paddingBottom: height * 0.02,
        paddingHorizontal: width * 0.05,
        backgroundColor: "white",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    subtitle: {
        fontSize: isSmallScreen ? 12 : 14,
        color: "#64748b",
    },
    profileCard: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: width * 0.05,
        marginHorizontal: width * 0.05,
        marginTop: height * 0.03,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    sectionTitle: {
        fontSize: isSmallScreen ? 16 : 18,
        fontWeight: "bold",
        color: "#1e293b",
        marginBottom: height * 0.02,
        textAlign: "center",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: height * 0.02,
        borderBottomWidth: 0.8,
        borderBottomColor: "#f1f5f9",
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#eff6ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: width * 0.04,
    },
    infoContent: {
        flex: 1,
    },
    label: {
        fontSize: isSmallScreen ? 12 : 14,
        fontWeight: "500",
        color: "#64748b",
        marginBottom: 2,
    },
    value: {
        fontSize: isSmallScreen ? 15 : 16,
        color: "#1e293b",
        fontWeight: "600",
    },
    buttonContainer: {
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.03,
        gap: height * 0.015,
    },
    editButton: {
        backgroundColor: "#1e40af",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: height * 0.02,
        borderRadius: 15,
        gap: 8,
        shadowColor: "#1e40af",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    editButtonText: {
        color: "white",
        fontSize: isSmallScreen ? 15 : 16,
        fontWeight: "600",
    },
    logoutButton: {
        backgroundColor: "#dc2626",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: height * 0.02,
        borderRadius: 15,
        gap: 8,
        shadowColor: "#dc2626",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    logoutButtonText: {
        color: "white",
        fontSize: isSmallScreen ? 15 : 16,
        fontWeight: "600",
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: "#64748b",
    },
    errorText: {
        fontSize: 16,
        color: "#64748b",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 30,
    },
    loginButton: {
        backgroundColor: "#1e40af",
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
    },
    loginButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
})

export default Perfil