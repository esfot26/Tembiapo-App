import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, Platform, Alert } from "react-native";
import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_APP } from "../../../services/FirebaseConfig";

const auth = getAuth(FIREBASE_APP);
const provider = new GoogleAuthProvider();

GoogleSignin.configure({
    iosClientId: "63825210908-s13rv36ltph3um4t7hgghd8rtp5otik1.apps.googleusercontent.com",
    //androidClientId: "63825210908-lg5nf87uuttbsunq3fpo3qlihjrin8sc.apps.googleusercontent.com",
    webClientId: "63825210908-o3p1o3roiicj908n6mfouslrcfhoki0u.apps.googleusercontent.com",
    offlineAccess: true,
});

export default function LoginGoogleUnified() {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<any>(null);

    // 🔹 Verificar sesión al iniciar app
    useEffect(() => {
        if (Platform.OS === "web") {
            // Firebase web
            const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
                if (fbUser) setFirebaseUser(fbUser);
                else setFirebaseUser(null);
            });
            return unsubscribe;
        } else {
            // Móvil nativo
            const checkUser = async () => {
                try {
                    const currentUser = await GoogleSignin.getCurrentUser();
                    if (currentUser) setUser(currentUser);
                } catch (error) {
                    console.log("Error al obtener usuario nativo:", error);
                }
            };
            checkUser();
        }
    }, []);

    // 🔹 Login unificado
    const handleLoginGoogle = async () => {
        try {
            if (Platform.OS === "web") {
                await signInWithPopup(auth, provider);
                console.log("✅ Login web exitoso");
            } else {
                await GoogleSignin.hasPlayServices();
                const userInfo = await GoogleSignin.signIn();
                //setUser(userInfo);
                console.log("✅ Login móvil exitoso");
            }
        } catch (error) {
            console.error("Error login Google:", error);
            Alert.alert("Error", "No se pudo iniciar sesión con Google.");
        }
    };

    // 🔹 Logout unificado
    const handleLogout = async () => {
        try {
            if (Platform.OS === "web") {
                await auth.signOut();
                setFirebaseUser(null);
            } else {
                await GoogleSignin.signOut();
                setUser(null);
            }
        } catch (error) {
            console.error("Error logout:", error);
        }
    };

    // 🔹 Mostrar usuario
    const renderUser = () => {
        if (Platform.OS === "web" && firebaseUser) {
            return (
                <View style={{ alignItems: "center" }}>
                    <Text>{firebaseUser.displayName}</Text>
                    <Text>{firebaseUser.email}</Text>
                    <Button title="Cerrar sesión" onPress={handleLogout} color="red" />
                </View>
            );
        }
        if (Platform.OS !== "web" && user) {
            return (
                <View style={{ alignItems: "center" }}>
                    {/* {user.user.photo ? (
                        <Image
                            source={{ uri: user.user.photo }}
                            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
                        />
                    ) : null} */}
                    <Text>{user.user.name}</Text>
                    <Text>{user.user.email}</Text>
                    <Button title="Cerrar sesión" onPress={handleLogout} color="red" />
                </View>
            );
        }
        return null;
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {!user && !firebaseUser ? (
                <Button title="Login con Google" onPress={handleLoginGoogle} />
            ) : (
                renderUser()
            )}
        </View>
    );
}
