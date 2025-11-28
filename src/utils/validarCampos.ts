import { useState } from "react";

export type FormState = {
    nombre: string;
    apellido: string;
    username: string;
    telefono: string;
    fechaNacimiento: string;
    email: string;
};

export const [errors, setErrors] = useState<{ [K in keyof FormState]?: boolean }>({});

export const validateField = (field: keyof FormState, value: string) => {
    setErrors((prev) => {
        const next = { ...prev };
        switch (field) {
            case "nombre":
            case "apellido":
                next[field] = value.trim().length < 2;
                break;
            case "username":
                next[field] = value.trim().length < 3;
                break;
            case "telefono":
                next[field] = value.length > 0 && !/^\d{8,15}$/.test(value.replace(/\s/g, ""));
                break;
            case "fechaNacimiento":
                next[field] = value.length > 0 && !/^\d{2}\/\d{2}\/\d{4}$/.test(value);
                break;

        }
        return next;
    });
};