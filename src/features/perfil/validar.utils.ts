import { FormState } from "./types";

export type FormErrors = Partial<Record<keyof FormState, boolean>>;

export const validateField = (field: keyof FormState, value: string): boolean => {
    switch (field) {
        case "nombre":
        case "apellido":
            return value.trim().length < 2;
        case "username":
            return value.trim().length < 3;
        case "telefono":
            return value.length > 0 && !/^\d{8,15}$/.test(value.replace(/\s/g, ""));
        case "fechaNacimiento":
            return value.length > 0 && !/^\d{2}\/\d{2}\/\d{4}$/.test(value);
        default:
            return false;
    }
};