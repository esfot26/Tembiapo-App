// hooks/useDriveNavigation.js
import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

export function useDriveNavigation(path?: { id?: string }[]) {
    const router = useRouter();

    const handleBack = useCallback(() => {
        if (Array.isArray(path) && path.length > 1) {
            const newPath = [...path];
            newPath.pop();

            const previousFolder = newPath[newPath.length - 1];

            router.replace({
                pathname: "/(tabs)/carpeta",
                params: {
                    padreId: previousFolder?.id ?? "",
                    path: JSON.stringify(newPath),
                },
            });
        } else {
            router.replace("/(tabs)/carpeta");
        }
    }, [path, router]);

    // Manejar el botón físico de "atrás" en Android
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                handleBack();
                return true; // Evita salir de la app
            };

            const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () => {
                subscription.remove();
            };
        }, [handleBack])
    );

    return { handleBack };
}