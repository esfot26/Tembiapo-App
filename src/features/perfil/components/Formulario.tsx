import { Ionicons } from "@expo/vector-icons";
import { View, TextInput, Text } from "react-native";
import { FormState } from "../types";
import { styles, width } from "../styles/editar.styles";
import { useTheme } from "@/src/contexts/TemaContext";

interface FormInputProps {
    field: keyof FormState;
    placeholder: string;
    icon: string;
    keyboardType?: any;
    required?: boolean;
    value: string;
    error?: boolean;
    onChangeText: (field: keyof FormState, text: string) => void;
}

export function FormInput({
    field,
    placeholder,
    icon,
    keyboardType = "default",
    required = false,
    value,
    error = false,
    onChangeText,
}: FormInputProps) {
    const { colors } = useTheme(); 

    const errorMessages: Partial<Record<keyof FormState, string>> = {
        nombre: "Mínimo 2 caracteres",
        apellido: "Mínimo 2 caracteres",
        username: "Mínimo 3 caracteres",
        email: "Email inválido",
        telefono: "Teléfono inválido",
        fechaNacimiento: "Formato DD/MM/AAAA",
    };

    return (
        <View style={styles.inputContainer}>
            <View
                style={[
                    styles.inputWrapper,
                    { borderColor: colors.border, backgroundColor: colors.card },
                    error && { borderColor: colors.destructive ?? "#ef4444" },
                ]}
            >
                <Ionicons
                    name={icon as any}
                    size={width * 0.06}
                    color={error ? (colors.destructive ?? "#ef4444") : colors.foreground}
                    style={styles.inputIcon}
                />
                <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.foreground}
                    value={value}
                    onChangeText={(text) => onChangeText(field, text)}
                    keyboardType={keyboardType}
                />
                {required && <Text style={styles.requiredMark}>*</Text>}
            </View>

            {error && (
                <Text style={[styles.errorText, { color: colors.destructive ?? "#ef4444" }]}>
                    {errorMessages[field]}
                </Text>
            )}
        </View>
    );
}