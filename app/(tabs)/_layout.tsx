import { Tabs } from "expo-router";
import CustomTabBar from "@/components/layout/CustomTabBar";
import { useTheme } from "@/src/contexts/TemaContext";
import { Ionicons } from "@expo/vector-icons";


export default function TabsLayout() {
    const { colors } = useTheme();

    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.muted,
            }}
        >
            <Tabs.Screen
                name="inicio/index"
                options={{
                    title: "Inicio",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="calendario/index"
                options={{
                    title: "Calendario",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="carpeta/index"
                options={{
                    title: "Carpetas",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="folder-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="notas/index"
                options={{
                    title: "Notas",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="notifications-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="configuracion/index"
                options={{
                    title: "Configuración",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
