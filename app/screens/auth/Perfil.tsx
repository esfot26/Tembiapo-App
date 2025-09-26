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
    SafeAreaView,
} from "react-native"
import { doc, getDoc } from "firebase/firestore"
import { getAuth, signOut } from "firebase/auth"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { FIREBASE_APP, FIREBASE_DB } from "../../../services/FirebaseConfig"
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

const Perfil = () => {
    const [userData, setUserData] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation()

    const fetchUserData = async (uid: string) => {
        setLoading(true)
        try {
            const userDocRef = doc(FIREBASE_DB, "users", uid)
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
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text style={styles.loadingText}>Cargando perfil...</Text>
                </View>
            </SafeAreaView>
        )
    }

    if (!userData) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Ionicons name="person-circle-outline" size={64} color="#d1d5db" />
                    <Text style={styles.errorText}>No se pudieron cargar los datos del usuario</Text>
                    <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.loginButtonText}>Ir a iniciar sesión</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    const InfoRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
        <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon as any} size={18} color="#3b82f6" />
                </View>
                <Text style={styles.label}>{label}</Text>
            </View>
            <Text style={styles.value} numberOfLines={1}>{value || "No especificado"}</Text>
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={80} color="#3b82f6" />
                    </View>
                    <Text style={styles.userName}>
                        {userData.nombre} {userData.apellido}
                    </Text>
                    <Text style={styles.userEmail}>{userData.email}</Text>
                </View>

                {/* Información Personal */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Personal</Text>

                    <View style={styles.infoCard}>
                        <InfoRow icon="person" label="Nombre completo" value={`${userData.nombre} ${userData.apellido}`} />
                        <View style={styles.separator} />
                        <InfoRow icon="at" label="Usuario" value={userData.username} />
                        <View style={styles.separator} />
                        <InfoRow icon="mail" label="Email" value={userData.email} />
                        <View style={styles.separator} />
                        <InfoRow icon="call" label="Teléfono" value={userData.telefono} />
                        <View style={styles.separator} />
                        <InfoRow icon="calendar" label="Fecha de nacimiento" value={userData.fechaNacimiento} />
                    </View>
                </View>

                {/* Acciones */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Acciones</Text>

                    <View style={styles.actionsCard}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate("EditarPerfil", { userData: userData })}
                        >
                            <View style={styles.actionLeft}>
                                <View style={[styles.actionIcon, { backgroundColor: '#eff6ff' }]}>
                                    <Ionicons name="create-outline" size={20} color="#3b82f6" />
                                </View>
                                <View>
                                    <Text style={styles.actionTitle}>Editar perfil</Text>
                                    <Text style={styles.actionSubtitle}>Actualiza tu información personal</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
                        </TouchableOpacity>

                        <View style={styles.separator} />

                        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
                            <View style={styles.actionLeft}>
                                <View style={[styles.actionIcon, { backgroundColor: '#fef2f2' }]}>
                                    <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                                </View>
                                <View>
                                    <Text style={styles.actionTitle}>Cerrar sesión</Text>
                                    <Text style={styles.actionSubtitle}>Salir de tu cuenta</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: isSmallScreen ? 16 : 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#6b7280",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    errorText: {
        fontSize: 16,
        color: "#6b7280",
        textAlign: "center",
        marginTop: 16,
        marginBottom: 24,
    },
    loginButton: {
        backgroundColor: "#3b82f6",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    loginButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
        paddingTop: 20,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    userName: {
        fontSize: isSmallScreen ? 22 : 24,
        fontWeight: "700",
        color: "#1f2937",
        textAlign: "center",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: "#6b7280",
        textAlign: "center",
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: isSmallScreen ? 16 : 18,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 12,
        marginLeft: 4,
    },
    infoCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
        borderWidth: 1,
        borderColor: "#f3f4f6",
        overflow: "hidden",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    infoLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: "#eff6ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    label: {
        fontSize: 14,
        color: "#6b7280",
        fontWeight: "500",
    },
    value: {
        fontSize: 15,
        color: "#1f2937",
        fontWeight: "600",
        flex: 1,
        textAlign: "right",
        marginLeft: 12,
    },
    separator: {
        height: 1,
        backgroundColor: "#f3f4f6",
        marginHorizontal: 16,
    },
    actionsCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
        borderWidth: 1,
        borderColor: "#f3f4f6",
        overflow: "hidden",
    },
    actionButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    actionLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    actionTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 2,
    },
    actionSubtitle: {
        fontSize: 13,
        color: "#6b7280",
    },
})

export default Perfil