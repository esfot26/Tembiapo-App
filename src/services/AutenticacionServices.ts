import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    updatePassword,
    sendPasswordResetEmail,
    signOut,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "firebase/auth";

import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "./FirebaseConfig";

export const AuthService = {
    async register(email: string, password: string, name: string) {
        const userCredential = await createUserWithEmailAndPassword(
            FIREBASE_AUTH,
            email,
            password
        );
        const user = userCredential.user;

        await setDoc(doc(FIREBASE_DB, "usuarios", user.uid), {
            nombre: name,
            email,
            photoURL: null,
            creadoEn: serverTimestamp(), 
        });

        await sendEmailVerification(user);
        return user;
    },

    async login(email: string, password: string) {
        return signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    },

    async resetPassword(email: string) {
        return sendPasswordResetEmail(FIREBASE_AUTH, email);
    },

    // ✅ Reautentica antes de cambiar contraseña
    async changePassword(currentPassword: string, newPassword: string) {
        const user = FIREBASE_AUTH.currentUser;
        if (!user || !user.email) throw new Error("Usuario no autenticado");

        // Reautenticar primero
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        return updatePassword(user, newPassword);
    },

    async logout() {
        return signOut(FIREBASE_AUTH);
    },

    async getUserProfile(uid: string) {
        return getDoc(doc(FIREBASE_DB, "usuarios", uid));
    },
};