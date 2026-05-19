
export interface Evento {
    id: string;
    titulo: string;
    descripcion: string;
    fecha: Date;
    tipo: string;
    hora?: string;
    notificar?: boolean;
    recordatorioOffsetMinutos?: number | null;
    recordatorioModo?: "offset" | "interval";
    recordatorioIntervaloMinutos?: number | null;
    notificationId?: string;
}