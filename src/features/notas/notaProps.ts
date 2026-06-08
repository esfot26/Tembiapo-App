import { Prioridad } from "@/src/services/NotasServices";

export interface Props {
    titulo: string; setTitulo: (v: string) => void;
    descripcion: string; setDescripcion: (v: string) => void;
    categoria: string; setCategoria: (v: string) => void;
    prioridad: Prioridad; setPrioridad: (v: Prioridad) => void;
    errorTitulo: string | null; setErrorTitulo: (v: string | null) => void;
    errorDescripcion: string | null; setErrorDescripcion: (v: string | null) => void;
    colors: any;
    onSave: () => void;
    onCancel: () => void;
}