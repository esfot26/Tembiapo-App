export interface Evento {
    id: string;
    titulo: string;
    descripcion: string;
    fecha: Date;
    tipo: string;
    hora?: string;
    notificar?: boolean;
    recordatorioOffset?: number | null;
    editingEvento?: Evento | null;
    recordatorioOffsetMinutos?: number | null;
    recordatorioModo?: "offset" | "interval";
    recordatorioIntervaloMinutos?: number | null;
    notificationId?: string;
}

