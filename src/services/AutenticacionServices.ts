import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    updatePassword,
    sendPasswordResetEmail,
    signOut
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "./FirebaseConfig";

export const AuthService = {
    async register(email: string, password: string, name: string) {
        const userCredential = await createUserWithEmailAndPassword(
            FIREBASE_AUTH,
            email,
            password
        );

        const user = userCredential.user;

        // Guardar datos del usuario en Firestore
        await setDoc(doc(FIREBASE_DB, "usuarios", user.uid), {
            nombre: name,
            email,
            foto: null,
            creadoEn: new Date()
        });

        // Enviar verificación
        await sendEmailVerification(user);

        return user;
    },

    async login(email: string, password: string) {
        return signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    },

    async resetPassword(email: string) {
        return sendPasswordResetEmail(FIREBASE_AUTH, email);
    },

    async changePassword(newPassword: string) {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) throw new Error("Usuario no autenticado");

        return updatePassword(user, newPassword);
    },

    async logout() {
        return signOut(FIREBASE_AUTH);
    },

    async getUserProfile(uid: string) {
        return getDoc(doc(FIREBASE_DB, "usuarios", uid));
    }
};
