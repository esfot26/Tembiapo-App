import { useTheme } from "@/src/contexts/TemaContext";
import { Stack } from "expo-router";


export default function ModalLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        presentation: "modal",
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.primary,
      }}
    >
      <Stack.Screen
        name="nota-editor"
        options={{
          headerTitle: "Nota",
          headerTitleStyle: {
            color: colors.primaryForeground,
          },
        }}
      />
      <Stack.Screen
        name="editar-perfil"
        options={{
          headerTitle: "Editar Perfil",
          headerTitleStyle: {
            color: colors.primaryForeground,
          },
        }}
      />
    </Stack>
  );
}
