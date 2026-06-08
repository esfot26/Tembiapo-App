import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FormActionsProps {
    saving: boolean;
    onSave: () => void;
}

export function FormActions({ saving, onSave }: FormActionsProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                flexDirection: "row",
                gap: 12,
                paddingHorizontal: 16,
                paddingTop: 12,
                paddingBottom: insets.bottom + 90,
                backgroundColor: "transparent",
            }}
        >
            <TouchableOpacity
                onPress={onSave}
                disabled={saving}
                style={{
                    flex: 1,
                    backgroundColor: saving ? "#93c5fd" : "#2563eb",
                    paddingVertical: 14,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 8,
                    shadowColor: "#2563eb",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 5,
                }}
            >
                {saving ? (
                    <ActivityIndicator color="white" size="small" />
                ) : (
                    <>
                        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                            Guardar
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.replace("/(tabs)/configuracion")}
                activeOpacity={0.85}
                style={{
                    flex: 1,
                    backgroundColor: "#dc2626",
                    paddingVertical: 14,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 8,
                    shadowColor: "#dc2626",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 5,
                }}
            >
                <Ionicons name="close-circle-outline" size={20} color="#fff" />
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                    Cancelar
                </Text>
            </TouchableOpacity>
        </View>
    );
}