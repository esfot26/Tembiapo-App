import { useState, useCallback } from "react";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { Nota, NotasService, NotaData } from "../../services/NotasServices";


export const useNotas = () => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(false);


  const obtenerNotas = async () => {
    const inicio = Date.now();

    try {
      const notas = await NotasService.obtenerNotas();

      const tiempoRespuesta = Date.now() - inicio;
      console.log(`Tiempo de carga de notas: ${tiempoRespuesta}ms`);
      console.log(`[PRUEBA] obtenerNotas: ${tiempoRespuesta}ms`);
      if (tiempoRespuesta > 2000) {
        console.warn(`⚠️ Tiempo excedido: ${tiempoRespuesta}ms`);
      }

      return notas;
    } catch (error) {
      const tiempoRespuesta = Date.now() - inicio;
      console.log(`[PRUEBA] obtenerNotas (error): ${tiempoRespuesta}ms`);
      throw error;
    }
  };


  const crearNota = async (notaData: NotaData) => {
    const inicio = Date.now();
    const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    const tempNota: Nota = {
      id: tempId,
      ...notaData,
      completado: false,
      creadorId: "temp", // Se reemplazará con el real
      fechaCreacion: { toDate: () => new Date() } as any, // Timestamp temporal
    };


    setNotas((prev) => [tempNota, ...prev]);

    try {
      // 📡 Guardar en Firebase en segundo plano
      const nuevaNota = await NotasService.crearNota(notaData);

      // 🔄 Reemplazar nota temporal con nota real
      setNotas((prev) =>
        prev.map((n) => (n.id === tempId ? (nuevaNota as unknown as Nota) : n))
      );

      const tiempoRespuesta = Date.now() - inicio;
      console.log(`Tiempo de creación de nota: ${tiempoRespuesta}ms`);
      console.log(`[PRUEBA] crearNota: ${tiempoRespuesta}ms`);
      if (tiempoRespuesta > 2000) {
        console.warn(`⚠️ Tiempo excedido: ${tiempoRespuesta}ms`);
      }

      Toast.show({
        type: "success",
        text1: "¡Nota creada!",
        text2: "Tu nueva nota ya está disponible.",
        visibilityTime: 1500,
        autoHide: true,
        topOffset: 60,
      });
    } catch (error) {
      console.error("Error al crear la nota:", error);

      const tiempoRespuesta = Date.now() - inicio;
      console.log(`[PRUEBA] crearNota (error): ${tiempoRespuesta}ms`);

      // ❌ Rollback: Remover nota temporal
      setNotas((prev) => prev.filter((n) => n.id !== tempId));

      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo crear la nota.",
        visibilityTime: 1500,
        autoHide: true,
        topOffset: 60,
      });
    }
  };

  const actualizarNota = async (
    notaId: string,
    updates: Partial<Omit<Nota, "id" | "creadorId" | "fechaCreacion">>
  ) => {
    // 💾 Guardar nota original para rollback
    const notaOriginal = notas.find((n) => n.id === notaId);
    if (!notaOriginal) return;

    // ✅ Actualizar inmediatamente en la UI
    setNotas((prev) =>
      prev.map((n) => (n.id === notaId ? { ...n, ...updates } : n))
    );

    try {
      // 📡 Actualizar en Firebase en segundo plano
      await NotasService.actualizarNota(notaId, updates);

      // 🔄 Recargar notas para sincronizar con Firebase
      await obtenerNotas();

      Toast.show({
        type: "success",
        text1: "Nota Actualizada",
        text2: "La nota ha sido actualizada exitosamente.",
      });
    } catch (error) {
      console.error("Error al actualizar la nota:", error);

      // ❌ Rollback: Restaurar nota original
      setNotas((prev) =>
        prev.map((n) => (n.id === notaId ? notaOriginal : n))
      );

      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo actualizar la nota.",
      });
    }
  };

  const eliminarNota = async (notaId: string) => {
    // 💾 Guardar nota para rollback
    const notaEliminada = notas.find((n) => n.id === notaId);
    if (!notaEliminada) return;

    // ✅ Remover inmediatamente de la UI
    setNotas((prev) => prev.filter((n) => n.id !== notaId));

    try {
      // 📡 Eliminar en Firebase en segundo plano
      await NotasService.eliminarNota(notaId);

      Toast.show({
        type: "success",
        text1: "Nota eliminada",
        text2: "✅​ La nota fue eliminada correctamente .",
        visibilityTime: 1500,
        autoHide: true,
        topOffset: 50,
        position: "top",
      });
    } catch (error) {
      console.error("Error al eliminar la nota:", error);

      // ❌ Rollback: Restaurar nota
      setNotas((prev) => [notaEliminada, ...prev]);

      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo eliminar la nota.",
        visibilityTime: 1500,
        autoHide: true,
        topOffset: 60,
      });
    }
  };

  return {
    notas,
    setNotas,
    loading,
    obtenerNotas,
    crearNota,
    actualizarNota,
    eliminarNota,
  };
};