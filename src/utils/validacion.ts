
export const validarCamposObligatorios = (campos: Record<string, any>): string | null => {
    for (const [key, value] of Object.entries(campos)) {
        if (!value || value.toString().trim() === "") {
            return `El campo "${key}" es obligatorio.`;
        }
    }
    return null;
};

/**
 * Valida el formato del correo electrónico
 */
export const validarEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : "Por favor, ingresa un email válido.";
};

/**
 * Valida que la contraseña tenga la longitud mínima
 */
export const validarContraseña = (password: string, minLength = 8): string | null => {
    return password.length >= minLength
        ? null
        : `La contraseña debe tener al menos ${minLength} caracteres.`;
};

/**
 * Valida el formato del nombre de usuario
 */
export const validarUsername = (username: string): string | null => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return usernameRegex.test(username)
        ? null
        : "El nombre de usuario solo puede contener letras, números y guiones bajos, y debe tener al menos 3 caracteres.";
};

/**
 * Valida el número de teléfono
 */
export const validarTelefono = (telefono: string): string | null => {
    const telefonoRegex = /^\d{8,15}$/;
    return telefonoRegex.test(telefono)
        ? null
        : "Por favor, ingresa un teléfono válido (mínimo 8 dígitos).";
};

/**
 * Valida el formato de fecha (DD-MM-YYYY)
 */
export const validarFecha = (fecha: string): string | null => {
    // Acepta 1900–2099, meses 01–12 y días 01–31
    const fechaRegex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    return fechaRegex.test(fecha)
        ? null
        : "Por favor, ingresa la fecha de nacimiento en formato YYYY-MM-DD.";
};



