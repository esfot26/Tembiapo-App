import { useState, useCallback } from "react";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { Nota, NotasService, NotaData } from "../../services/NotasServices";


export const useNotas = () => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(false);


  const cargarNotas = useCallback(async () => {
    setLoading(true);
    try {
      const notasObtenidas = await NotasService.obtenerNotas();
      setNotas(notasObtenidas);
    } catch (error) {
      console.error("Error al cargar las notas:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudieron cargar las notas.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const crearNota = async (notaData: NotaData) => {
    setLoading(true);
    try {
      const nuevaNota = await NotasService.crearNota(notaData);
      setNotas((prev) => [...prev, nuevaNota as unknown as Nota]);

      await cargarNotas(); // Recargar la lista de notas
      Toast.show({
        type: "success",
        text1: "¡Nota creada!",
        text2: "Tu nueva nota ya está disponible.",
        visibilityTime: 2500,
        autoHide: true,
        topOffset: 60,
      });
    } catch (error) {
      console.error("Error al crear la nota:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo crear la nota.",
      });
    } finally {
      setLoading(false);
    }
  };

  const actualizarNota = async (
    notaId: string,
    updates: Partial<Omit<Nota, "id" | "creadorId" | "fechaCreacion">>
  ) => {
    setLoading(true);
    try {
      await NotasService.actualizarNota(notaId, updates);
      await cargarNotas(); // Recargar la lista de notas
      Toast.show({
        type: "success",
        text1: "Nota Actualizada",
        text2: "La nota ha sido actualizada exitosamente.",
      });
    } catch (error) {
      console.error("Error al actualizar la nota:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo actualizar la nota.",
      });
    } finally {
      setLoading(false);
    }
  };

  const eliminarNota = async (notaId: string) => {
    setLoading(true);
    try {
      await NotasService.eliminarNota(notaId);
      await cargarNotas();
      Toast.show({
        type: "success",
        text1: "Nota eliminada",
        text2: "La nota fue eliminada correctamente.",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
        position: "top",
      });
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo eliminar la nota.",
        visibilityTime: 2500,
        autoHide: true,
        topOffset: 60,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    notas,
    loading,
    cargarNotas,
    crearNota,
    actualizarNota,
    eliminarNota,
  };
};