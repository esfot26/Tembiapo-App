import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { THEME } from "@/lib/theme"

type ThemeMode = "light" | "dark";

type ThemeContextType = {
    theme: ThemeMode;
    colors: typeof THEME["light"]; // 👈 Proporciona todos los colores del tema activo
    toggleTheme: () => void;
    setTheme: (t: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    colors: THEME.light,
    toggleTheme: () => { },
    setTheme: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [theme, setThemeState] = useState<ThemeMode>("light");

    useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem("appTheme");
            if (saved === "dark" || saved === "light") setThemeState(saved);
        })();
    }, []);

    const setTheme = async (t: ThemeMode) => {
        setThemeState(t);
        await AsyncStorage.setItem("appTheme", t);
    };

    const toggleTheme = async () => {
        const newTheme = theme === "light" ? "dark" : "light";
        await setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                colors: THEME[theme],
                toggleTheme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
