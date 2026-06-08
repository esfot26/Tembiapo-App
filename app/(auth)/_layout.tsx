import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login/index" />
            <Stack.Screen name="registro/index" />
            <Stack.Screen name="resetear-password/index" />
            <Stack.Screen name="verificar-correo/verificarCorreo" />
        </Stack>
    );
}