import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { type NavigationProp, useNavigation, useFocusEffect } from "@react-navigation/native"
import { type User, onAuthStateChanged } from "firebase/auth"
import React, { useState } from "react"
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    ScrollView,
} from "react-native"
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../services/FirebaseConfig"
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore"
import { styles } from "./Inicio.styles"

// ✅ Añadido "Carpetas" a RootStackParamList
type RootStackParamList = {
    Inicio: undefined
    Perfil: undefined
    Notas: undefined
    Login: undefined
    Registro: undefined
    Calendario: undefined
    Carpetas: { userId: string } | undefined  // ✅ Añadido
}

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
    onPress: () => void
    count?: number
}

const MenuItem: React.FC<MenuItemProps> = ({ iconName, iconColor, title, subtitle, onPress, count }) => {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
                    <MaterialCommunityIcons name={iconName as any} size={20} color="white" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.menuItemTitle}>{title}</Text>
                    <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
                </View>
            </View>
            <View style={styles.menuItemRight}>
                {count !== undefined && count > 0 && (
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{count}</Text>
                    </View>
                )}
                <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
            </View>
        </TouchableOpacity>
    )
}

const StatCard: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
    <View style={styles.statCard}>
        <Text style={[styles.statNumber, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
)

export default function Inicio() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const [user, setUser] = useState<User | null>(null)
    const [userData, setUserData] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        tareas: 0,
        completadas: 0,
        pendientes: 0,
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
        } finally {
            setLoading(false)
        }
    }

    const fetchStats = async (uid: string) => {
        try {
            const todosRef = collection(FIREBASE_DB, `todos/${uid}/user_todos`)

            const unsubscribeTodos = onSnapshot(todosRef, (snapshot) => {
                const totalTareas = snapshot.size
                const completadas = snapshot.docs.filter(doc => doc.data().completado).length
                const pendientes = totalTareas - completadas

                setStats({
                    tareas: totalTareas,
                    completadas,
                    pendientes,
                })
            })

            return unsubscribeTodos
        } catch (error) {
            console.error("Error al obtener estadísticas:", error)
            setStats({
                tareas: 0,
                completadas: 0,
                pendientes: 0,
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
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        )
    }

    const displayName = userData?.nombre || userData?.username || user?.email?.split('@')[0] || "Usuario"

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.welcomeTitle}>¡Hola, {displayName}! 👋</Text>
                        <Text style={styles.subtitle}>Bienvenido a tu espacio de organización</Text>
                    </View>
                </View>

                {/* Estadísticas */}
                <View style={styles.statsContainer}>
                    <StatCard value={stats.tareas} label="Total" color="#3b82f6" />
                    <StatCard value={stats.completadas} label="Hechas" color="#10b981" />
                    <StatCard value={stats.pendientes} label="Pendientes" color="#f59e0b" />
                </View>

                {/* Menú de acciones */}
                <View style={styles.menuContainer}>
                    <Text style={styles.sectionTitle}>Acciones rápidas</Text>

                    <MenuItem
                        iconName="check-circle"
                        iconColor="#10b981"
                        title="Mis Tareas"
                        subtitle="Gestiona tus pendientes"
                        onPress={() => navigation.navigate("Notas")}
                        count={stats.pendientes}
                    />

                    <MenuItem
                        iconName="calendar"
                        iconColor="#3b82f6"
                        title="Calendario"
                        subtitle="Organiza tu tiempo"
                        onPress={() => navigation.navigate("Calendario")}
                    />

                    <MenuItem
                        iconName="folder"
                        iconColor="#8b5cf6"
                        title="Archivos"
                        subtitle="Documentos y recursos"
                        onPress={() => navigation.navigate("Carpetas")}
                    />

                    <MenuItem
                        iconName="account"
                        iconColor="#f59e0b"
                        title="Perfil"
                        subtitle="Configura tu cuenta"
                        onPress={() => navigation.navigate("Perfil")}
                    />
                </View>

                {/* Estado rápido */}
                <View style={styles.quickStatus}>
                    <View style={styles.statusItem}>
                        <Ionicons name="time-outline" size={20} color="#6b7280" />
                        <Text style={styles.statusText}>Hoy tienes {stats.pendientes} tareas pendientes</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}