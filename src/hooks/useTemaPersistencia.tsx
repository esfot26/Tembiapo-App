import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

export function usePersistentTheme() {
    const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();

    // 🔹 Cargar tema guardado al iniciar
    useEffect(() => {
        (async () => {
            const savedTheme = await AsyncStorage.getItem("appTheme");
            if (savedTheme && savedTheme !== colorScheme) {
                setColorScheme(savedTheme as "light" | "dark");
            }
        })();
    }, []);

    // 🔹 Cambiar y guardar
    const toggleAndSaveTheme = async () => {
        const newTheme = colorScheme === "light" ? "dark" : "light";
        setColorScheme(newTheme);
        await AsyncStorage.setItem("appTheme", newTheme);
    };

    return { colorScheme, toggleAndSaveTheme };
}
