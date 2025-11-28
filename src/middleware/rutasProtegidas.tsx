import { FIREBASE_AUTH } from "../services/FirebaseConfig";
import { router } from "expo-router";

export function checkEmailVerified() {
    const user = FIREBASE_AUTH.currentUser;

    if (!user) {
        router.replace("/login");
        return false;
    }

    if (!user.emailVerified) {
        router.replace("/verificar-correo/verificarCorreo");
        return false;
    }

    return true;
}
