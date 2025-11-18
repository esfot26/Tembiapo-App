// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../services/FirebaseConfig";
import * as SecureStore from "expo-secure-store";

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

    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            setUsuario(user ?? null);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const logout = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            await SecureStore.deleteItemAsync("uid");
            setUsuario(null);
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
