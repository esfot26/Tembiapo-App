export function translateFirebaseError(code: string): string {
    const errors: Record<string, string> = {
        "auth/email-already-in-use": "Este correo ya está registrado.",
        "auth/invalid-email": "El correo no es válido.",
        "auth/weak-password": "La contraseña es muy débil.",
        "auth/user-not-found": "No existe una cuenta con este correo.",
        "auth/wrong-password": "Contraseña incorrecta.",
        "auth/missing-email": "Ingresa un correo válido.",
        "auth/too-many-requests": "Demasiados intentos. Intenta más tarde."
    };

    return errors[code] || "Ocurrió un error inesperado.";
}
