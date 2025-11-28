// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../services/FirebaseConfig";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

type AuthContextType = {
    usuario: User | null;
    loading: boolean;
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
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            setLoading(false);

            // Usuario NO verificado → redirigir
            if (user && !user.emailVerified) {
                setUsuario(null); // Bloquea acceso a la app
                await SecureStore.setItemAsync("uid", user.uid);
                router.replace("/(auth)/verificar-correo/verificarCorreo");
                return;
            }

            //  Usuario verificado o no logueado
            setUsuario(user ?? null);
        });

        return unsubscribe;
    }, []);

    const logout = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            await SecureStore.deleteItemAsync("uid");
            setUsuario(null);
            router.replace("/(auth)/login");
        } catch (error) {
            console.log("Error en logout:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ usuario, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
