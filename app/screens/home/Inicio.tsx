import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { type NavigationProp, useNavigation, useFocusEffect } from "@react-navigation/native"
import { type User, onAuthStateChanged } from "firebase/auth"
import React, { useState } from "react"
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
    Dimensions,
    ScrollView,
} from "react-native"
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../services/FirebaseConfig"
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const isSmallScreen = screenWidth < 350
const isMediumScreen = screenWidth >= 350 && screenWidth < 400

// Define el tipo para tus rutas
type RootStackParamList = {
    Inicio: undefined
    Perfil: undefined
    ListaNotas: undefined
    Login: undefined
    Registro: undefined
    Calendario: undefined
}

// Interfaz para los datos del usuario en Firestore
interface UserData {
    email: string
    username: string
    nombre: string
    apellido: string
    telefono: string
    fechaNacimiento: string
}

interface MenuItemProps {
    iconName: string
    iconColor: string
    title: string
    subtitle: string
    onPress: () => void // Hacer onPress obligatorio
}

const MenuItem: React.FC<MenuItemProps> = ({ iconName, iconColor, title, subtitle, onPress }) => {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
                <MaterialCommunityIcons name={iconName as any} size={isSmallScreen ? 20 : 24} color="white" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.menuItemTitle}>{title}</Text>
                <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
            </View>
            <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </View>
        </TouchableOpacity>
    )
}

export default function Inicio() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const [user, setUser] = useState<User | null>(null)
    const [userData, setUserData] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        archivos: 0,
        tareas: 0,
        eventos: 0,
    })

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
            Alert.alert("Error", "Error al cargar el perfil. Inténtalo de nuevo.")
        } finally {
            setLoading(false)
        }
    }

    const fetchStats = async (uid: string) => {
        try {
            const todosRef = collection(FIREBASE_DB, `todos/${uid}/user_todos`)
            const unsubscribeTodos = onSnapshot(todosRef, (snapshot) => {
                const tareasCount = snapshot.size
                setStats((prevStats) => ({
                    ...prevStats,
                    tareas: tareasCount,
                }))
            })

            setStats((prevStats) => ({
                ...prevStats,
                archivos: 0,
                eventos: 0,
            }))

            return unsubscribeTodos
        } catch (error) {
            console.error("Error al obtener estadísticas:", error)
            setStats({
                archivos: 0,
                tareas: 0,
                eventos: 0,
            })
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            let unsubscribeStats: (() => void) | undefined

            const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
                setUser(user)
                if (user) {
                    await fetchUserData(user.uid)
                    unsubscribeStats = await fetchStats(user.uid)
                } else {
                    setUserData(null)
                    setLoading(false)
                }
            })

            return () => {
                unsubscribeAuth()
                if (unsubscribeStats) {
                    unsubscribeStats()
                }
            }
        }, []),
    )

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Cargando datos del usuario...</Text>
            </View>
        )
    }

    const displayName =
        userData?.nombre && userData?.apellido
            ? `${userData.nombre} ${userData.apellido}`
            : userData?.username
                ? userData.username
                : user?.email
                    ? user.email
                    : "Guest"

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.appName}>Tembiapo</Text>
                        <Text style={styles.welcomeTitle}>¡Hola, {displayName.split(" ")[0]}! 👋</Text>
                        <Text style={styles.subtitle}>Organiza tus actividades académicas</Text>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.archivos}</Text>
                        <Text style={styles.statLabel}>Archivos</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.tareas}</Text>
                        <Text style={styles.statLabel}>Tareas</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.eventos}</Text>
                        <Text style={styles.statLabel}>Eventos</Text>
                    </View>
                </View>

                <View style={styles.menuContainer}>
                    <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
                    <MenuItem
                        iconName="folder-multiple"
                        iconColor="#1e40af"
                        title="Mis Carpetas"
                        subtitle="Organiza tus archivos y documentos"
                        onPress={() => console.log("Carpetas presionado")}
                    />
                    <MenuItem
                        iconName="upload"
                        iconColor="#059669"
                        title="Gestión de Archivos"
                        subtitle="Sube tus archivos y documentos"
                        onPress={() => console.log("Archivos presionado")}
                    />
                    <MenuItem
                        iconName="check-circle"
                        iconColor="#dc2626"
                        title="Tareas"
                        subtitle="Gestiona tus tareas y pendientes"
                        onPress={() => navigation.navigate("ListaNotas")}
                    />
                    <MenuItem
                        iconName="calendar"
                        iconColor="#7c3aed"
                        title="Calendario"
                        subtitle="Visualiza tus eventos y actividades"
                        onPress={() => navigation.navigate("Calendario")}
                    />
                    <MenuItem
                        iconName="account"
                        iconColor="#ea580c"
                        title="Perfil"
                        subtitle="Configura tu perfil y preferencias"
                        onPress={() => navigation.navigate("Perfil")}
                    />
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
        paddingHorizontal: screenWidth * 0.07,
    },
    header: {
        marginTop: screenHeight * 0.07,
        marginBottom: screenHeight * 0.03,
    },
    headerContent: {
        alignItems: "center",
    },
    appName: {
        fontSize: isSmallScreen ? 14 : 16,
        fontWeight: "600",
        color: "#1e40af",
        marginBottom: 4,
        letterSpacing: 3,
    },
    welcomeTitle: {
        fontSize: isSmallScreen ? 18 : isMediumScreen ? 22 : 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#1f2937",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: isSmallScreen ? 14 : 16,
        textAlign: "center",
        color: "#6b7280",
        lineHeight: 18,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: screenHeight * 0.03,
        paddingHorizontal: screenWidth * 0.02,
    },
    statCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: screenWidth * 0.04,
        alignItems: "center",
        flex: 1,
        marginHorizontal: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#f1f5f9",
    },
    statNumber: {
        fontSize: isSmallScreen ? 18 : 22,
        fontWeight: "bold",
        color: "#1e40af",
        marginBottom: 2,
    },
    statLabel: {
        fontSize: isSmallScreen ? 12 : 14,
        color: "#6b7280",
        fontWeight: "500",
    },
    menuContainer: {
        flex: 1,
        paddingBottom: screenHeight * 0.02,
        
    },
    sectionTitle: {
        fontSize: isSmallScreen ? 16 : 18,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 12,
        marginLeft: 4,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: screenWidth * 0.04,
        borderRadius: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#f1f5f9",
    },
    iconContainer: {
        padding: isSmallScreen ? 10 : 12,
        borderRadius: 12,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: isSmallScreen ? 15 : 16,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 2,
    },
    menuItemSubtitle: {
        fontSize: isSmallScreen ? 13 : 14,
        color: "#6b7280",
        lineHeight: 18,
    },
    arrowContainer: {
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
    },
})
