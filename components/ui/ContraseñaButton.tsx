import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, TextInputProps, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

// Props extendidas con opciones de personalización
interface ContraseñaButtonProps extends TextInputProps {
    backgroundColor?: string; // color de fondo (por defecto blanco o azul claro)
    iconColor?: string; // color de los íconos
    textColor?: string; // color del texto
    borderColor?: string; // color del borde
    rounded?: boolean; // para ajustar forma del input
}

const ContraseñaButton: React.FC<ContraseñaButtonProps> = ({
    backgroundColor = "#F9FAFB",
    iconColor = "#1E3A8A",
    textColor = "#111827",
    borderColor = "#E5E7EB",
    rounded = true,
    style,
    ...props
}) => {
    const [visible, setVisible] = useState(false);

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor,
                    borderColor,
                    borderRadius: rounded ? 12 : 4,
                },
            ]}
        >
            <Feather name="lock" size={20} color={iconColor} />

            <TextInput
                {...props}
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!visible}
                style={[
                    styles.input,
                    {
                        color: textColor,
                    },
                ]}
            />

            <TouchableOpacity onPress={() => setVisible(!visible)}>
                <Feather
                    name={visible ? "eye" : "eye-off"}
                    size={20}
                    color={iconColor}
                />
            </TouchableOpacity>
        </View>
    );
};

export default ContraseñaButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginBottom: 14,
        
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
    },

});
