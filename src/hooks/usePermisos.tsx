import { useState, useCallback } from "react";
import * as MediaLibrary from "expo-media-library";
import { Camera } from "expo-camera";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export function usePermisos() {
    const [estadoPermisos, setEstadoPermisos] = useState({
        camara: null,
        almacenamiento: null,
        notificaciones: null,
    });

    // ─────────────────────────────────────────────
    // 📍 1. Verificar permisos actuales (sin pedirlos)
    // ─────────────────────────────────────────────
    const verificarPermisos = useCallback(async () => {
        const cam = await Camera.getCameraPermissionsAsync();
        const alm = await MediaLibrary.getPermissionsAsync();
        const noti = await Notifications.getPermissionsAsync();

        setEstadoPermisos({
            camara: cam.status as any,
            almacenamiento: alm.status as any,
            notificaciones: noti.status as any,
        });

        return {
            camara: cam.status === "granted",
            almacenamiento: alm.status === "granted",
            notificaciones: noti.status === "granted",
        };
    }, []);

    // ─────────────────────────────────────────────
    // 📍 2. Solicitar permisos individuales
    // ─────────────────────────────────────────────
    const pedirCamara = useCallback(async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setEstadoPermisos((prev) => ({ ...prev, camara: status as any }));
        return status === "granted";
    }, []);

    const pedirAlmacenamiento = useCallback(async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setEstadoPermisos((prev) => ({ ...prev, almacenamiento: status as any }));
        return status === "granted";
    }, []);

    const pedirNotificaciones = useCallback(async () => {
        if (!Device.isDevice) return false;

        const { status } = await Notifications.requestPermissionsAsync();
        setEstadoPermisos((prev) => ({ ...prev, notificaciones: status as any }));
        return status === "granted";
    }, []);

    // ─────────────────────────────────────────────
    // 📍 3. Pedir permisos necesarios SOLO cuando falten
    // ─────────────────────────────────────────────
    const pedirPermisosNecesarios = useCallback(async () => {
        const permisos = await verificarPermisos();

        const promesas = [];

        if (!permisos.almacenamiento) promesas.push(pedirAlmacenamiento());
        if (!permisos.camara) promesas.push(pedirCamara());
        if (!permisos.notificaciones) promesas.push(pedirNotificaciones());

        const resultados = await Promise.all(promesas);

        return resultados.every((r) => r === true);
    }, [verificarPermisos, pedirAlmacenamiento, pedirCamara, pedirNotificaciones]);

    return {
        estadoPermisos,
        verificarPermisos,
        pedirCamara,
        pedirAlmacenamiento,
        pedirNotificaciones,
        pedirPermisosNecesarios,
    };
}
