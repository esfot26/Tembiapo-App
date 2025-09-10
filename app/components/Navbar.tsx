import { Ionicons } from "@expo/vector-icons"
import { type NavigationProp, useNavigation } from "@react-navigation/native"
import { View, TouchableOpacity, StyleSheet, Alert, Text, Dimensions, SafeAreaView } from "react-native"
import { signOut } from "firebase/auth"
import { useActiveScreen } from "../contexts/ActiveScreenContext"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const isSmallScreen = screenWidth < 350
const isLargeScreen = screenWidth > 400

export default function Navbar() {
    type RootStackParamList = {
        Inicio: undefined
        Perfil: undefined
        ListaNotas: undefined
        Login: undefined
        Registro: undefined
        Calendario: undefined
    }

    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const { activeScreen } = useActiveScreen()

    const auth = require("firebase/auth").getAuth()

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

    const handleNavigation = (screen: keyof RootStackParamList) => {
        navigation.navigate(screen)
    }

    const navItems = [
        {
            key: "Inicio",
            icon: "school-outline" as const,
            activeIcon: "school" as const,
            label: "Inicio",
            onPress: () => handleNavigation("Inicio"),
        },
        {
            key: "ListaNotas", // 👈 mismo nombre que tu pantalla
            icon: "checkbox-outline" as const,
            activeIcon: "checkbox" as const,
            label: "Tareas",
            onPress: () => handleNavigation("ListaNotas"),
        },
        {
            key: "Calendario", // 👈 coincide con tu CalendarioStack
            icon: "calendar-outline" as const,
            activeIcon: "calendar" as const,
            label: "Calendario",
            onPress: () => handleNavigation("Calendario"),
        },
        {
            key: "Perfil",
            icon: "person-outline" as const,
            activeIcon: "person" as const,
            label: "Perfil",
            onPress: () => handleNavigation("Perfil"),
        },
    ]

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.bottomNav}>
                {navItems.map((item) => {
                    const isActive = activeScreen === item.key
                    return (
                        <TouchableOpacity
                            key={item.key}
                            style={[styles.navItem, isActive && styles.activeNavItem]}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={isActive ? item.activeIcon : item.icon}
                                size={isSmallScreen ? 20 : isLargeScreen ? 26 : 24}
                                color={isActive ? "#3B82F6" : "#6B7280"}
                            />
                            {/* <Text style={[styles.navLabel, isActive && styles.activeNavLabel]}>{item.label}</Text> */}
                        </TouchableOpacity>
                    )
                })}

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
        minHeight: 70,
    },
    navItem: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        minWidth: 60,
        flex: 1,
        maxWidth: screenWidth / 6,
    },
    activeNavItem: {
        backgroundColor: "#EFF6FF",
    },
    navLabel: {
        fontSize: 10,
        color: "#6B7280",
        marginTop: 4,
        fontWeight: "500",
        textAlign: "center",
    },
    activeNavLabel: {
        color: "#3B82F6",
        fontWeight: "600",
    },
    logoutButton: {
        position: "absolute",
        top: -20,
        right: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#FEE2E2",
        minWidth: 36,
        minHeight: 36,
    },
})
