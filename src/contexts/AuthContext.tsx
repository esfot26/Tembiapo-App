// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../services/FirebaseConfig";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type AuthContextType = {
    usuario: User | null;
    loading: boolean;
    isGuest: boolean;                    // ← NUEVO
    continueAsGuest: () => Promise<void>; // ← NUEVO
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [usuario, setUsuario] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false); // ← NUEVO
    const router = useRouter();

    // ── Inicializar estado de invitado desde AsyncStorage ──────────────────
    useEffect(() => {
        AsyncStorage.getItem("@tembiapo:is_guest").then((val) => {
            if (val === "true") setIsGuest(true);
        });
    }, []);

    // ── Firebase auth listener (sin cambios) ───────────────────────────────
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            setLoading(false);

            if (user && !user.emailVerified) {
                setUsuario(null);
                await SecureStore.setItemAsync("uid", user.uid);
                router.replace("/(auth)/verificar-correo/index");
                return;
            }

            // Si hay usuario real, limpia el modo invitado
            if (user) setIsGuest(false);

            setUsuario(user ?? null);
        });

        return unsubscribe;
    }, []);

    // ── NUEVO: entrar como invitado ────────────────────────────────────────
    const continueAsGuest = async () => {
        await AsyncStorage.setItem("@tembiapo:is_guest", "true");
        setIsGuest(true);
        router.replace("/(tabs)/inicio"); // ← NUEVO: ruta para usuarios invitados
    };

    // ── logout (agrega limpieza de invitado) ───────────────────────────────
    const logout = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            await SecureStore.deleteItemAsync("uid");
            await AsyncStorage.removeItem("@tembiapo:is_guest"); // ← NUEVO
            setUsuario(null);
            setIsGuest(false);                                   // ← NUEVO
            router.replace("/(auth)/login");
        } catch (error) {
            console.log("Error en logout:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ usuario, loading, isGuest, continueAsGuest, logout }}>
            {children}
        </AuthContext.Provider>
    );
};