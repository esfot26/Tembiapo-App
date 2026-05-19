import { Timestamp } from "firebase/firestore";

export type Carpeta = {
    id: string;
    nombre: string;
    color?: string;
    icono?: string;
    descripcion?: string;
    favorito?: boolean;
    padreId: string | null;
    creadorId?: string;
    fechaCreado: Timestamp;
    fechaActualizado: Timestamp;
    fechaBorrado?: Timestamp | null;
    eliminado?: boolean;
};

export type ArchivoItem = {
    id: string;
    nombre: string;
    carpetaId: string | null;
    url: string;
    mimeType: string;
    size: number;
    color?: string;
    creadorId?: string;
    favorito?: boolean;
    descripcion?: string;
    fechaCreado: Timestamp;
    fechaActualizado?: Timestamp;
    fechaBorrado?: Timestamp | null;
    eliminado?: boolean;
};