
export const parseHoraToDate = (baseDate: Date, horaStr?: string): Date => {
    if (!horaStr) return baseDate;
    const [h, m] = horaStr.split(":").map((p) => parseInt(p || "0", 10));
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    return d;
};

export const calcularFechaProgramacion = (
    fechaBase: Date,
    minutosAntes: number
): Date | null => {
    const ahora = new Date();
    if (fechaBase <= ahora) return null;


    const minutos = Math.max(0, minutosAntes);
    const fechaRecordatorio = new Date(fechaBase.getTime() - minutos * 60 * 1000);
    return fechaRecordatorio <= ahora ? fechaBase : fechaRecordatorio;
};