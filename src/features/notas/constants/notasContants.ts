import { Ionicons } from "@expo/vector-icons";


export const categoriaIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
    Trabajo: "briefcase-outline",
    Personal: "person-outline",
    Estudio: "book-outline",
    Salud: "heart-outline",

};

export const prioridadIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
    baja: "chevron-down-outline",
    media: "remove-outline",
    alta: "chevron-up-outline",
};