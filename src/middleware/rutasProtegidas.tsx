import { FIREBASE_AUTH } from "../services/FirebaseConfig";
import { router } from "expo-router";

export function checkEmailVerified() {
    const user = FIREBASE_AUTH.currentUser;

    if (!user) {
        router.replace("/(auth)/login");
        return false;
    }

    if (!user.emailVerified) {
        router.replace("/(auth)/verificar-correo");
        return false;
    }

    return true;
}
