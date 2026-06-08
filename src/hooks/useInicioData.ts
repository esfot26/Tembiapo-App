import { useState, useCallback, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { collection, onSnapshot, doc, getDoc, query } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/src/services/FirebaseConfig";
import { CalendarioServices } from "@/src/services/CalendarioServices";

// Definimos la interfaz para los datos del usuario
export interface UserData {
    email: string;
    username: string;
    nombreCompleto: string;
    apellido: string;
    telefono: string;
    fechaNacimiento: string;
}

export const useInicioData = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        tareas: 0,
        completadas: 0,
        pendientes: 0,
        eventos: 0,
    });

    // 1. Obtener datos del perfil del usuario (One-time fetch)
    const fetchUserData = async (uid: string) => {
        if (!uid) {
            setLoading(false);
            return;
        }
        try {
            const userDoc = await getDoc(doc(FIREBASE_DB, "usuarios", uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserData({
                    email: data.email || "",
                    username: data.username || "",
                    nombreCompleto: data.nombreCompleto || "",
                    apellido: data.apellido || "",
                    telefono: data.telefono || "",
                    fechaNacimiento: data.fechaNacimiento || "",
                });
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setLoading(false);
        }
    };

    // 2. Suscribirse a cambios en tiempo real (Notas y Eventos)
    const subscribeToData = useCallback((uid: string) => {
        setLoading(true);

        // Listener de Notas en Firestore
        const notasRef = collection(FIREBASE_DB, "usuarios", uid, "usuario_notas");
        const q = query(notasRef);

        const unsubscribeNotas = onSnapshot(q, async (snapshot) => {
            const total = snapshot.size;
            const completadas = snapshot.docs.filter((d) => d.data().completado).length;
            const pendientes = total - completadas;

            // Obtenemos eventos (puedes convertir esto a listener también si CalendarioServices lo permite)
            const eventosData = await CalendarioServices.verEventos();

            setStats({
                tareas: total,
                completadas,
                pendientes,
                eventos: eventosData.length,
            });

            setLoading(false);
        }, (error) => {
            console.error("Error en suscripción de notas:", error);
            setLoading(false);
        });

        return unsubscribeNotas;
    }, []);

    return {
        user,
        userData,
        stats,
        loading,
        setLoading,
        fetchUserData,
        subscribeToData
    };
};