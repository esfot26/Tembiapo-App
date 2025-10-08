import { Ionicons } from "@expo/vector-icons"
import { type NavigationProp, useNavigation } from "@react-navigation/native"
import { View, TouchableOpacity, StyleSheet, Alert, Text, Dimensions, SafeAreaView } from "react-native"
import { signOut } from "firebase/auth"
import { useActiveScreen } from "../contexts/ActiveScreenContext"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const isSmallScreen = screenWidth < 350
const isLargeScreen = screenWidth > 400

export default function Navbar() {
   
    type TabParamList = {
        Inicio: undefined
        Notas: undefined 
        Perfil: undefined 
        Calendario: undefined
    }

    const navigation = useNavigation<NavigationProp<TabParamList>>()
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

    // ✅ CORRECCIÓN: Navegación a los TABS
    const handleNavigation = (screen: keyof TabParamList) => {
        console.log("Navegando a:", screen)
        navigation.navigate(screen)
    }

    // ✅ CORRECCIÓN: Items actualizados con los nombres correctos de los TABS
    const navItems = [
        {
            key: "Inicio", // ← Nombre del TAB
            icon: "home-outline" as const,
            activeIcon: "home" as const,
            
            onPress: () => handleNavigation("Inicio"),
        },
        {
            key: "Notas", // ← Nombre del TAB (no "ListaNotas")
            icon: "checkbox-outline" as const,
            activeIcon: "checkbox" as const,
            
            onPress: () => handleNavigation("Notas"), // ← Navega al TAB "Notas"
        },
        {
            key: "Calendario", // ← Nombre del TAB
            icon: "calendar-outline" as const,
            activeIcon: "calendar" as const,
            
            onPress: () => handleNavigation("Calendario"),
        },
        {
            key: "Perfil", // ← Nombre del TAB
            icon: "person-outline" as const,
            activeIcon: "person" as const,
            
            onPress: () => handleNavigation("Perfil"),
        },
        {
            key: "Logout",
            icon: "log-out-outline" as const,
            activeIcon: "log-out" as const,
            onPress: handleLogout,
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
        bottom: 30,
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
        position: 'absolute',
        top: -30,
        right: 20,
        backgroundColor: "white",
        borderRadius: 25,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#FECACA",
    },
})