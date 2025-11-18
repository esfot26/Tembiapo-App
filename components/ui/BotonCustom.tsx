import React from "react";
import { View, TextInput, TextInputProps, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

// Props extendidas con opciones visuales
interface BotonCustomProps extends TextInputProps {
    iconName: keyof typeof Feather.glyphMap;
    backgroundColor?: string;
    iconColor?: string;
    textColor?: string;
    borderColor?: string;
    rounded?: boolean;
}

const BotonCustom: React.FC<BotonCustomProps> = ({
    iconName,
    backgroundColor = "#F9FAFB", // gris claro para fondos blancos
    iconColor = "#1E3A8A", // azul principal
    textColor = "#111827",
    borderColor = "#E5E7EB",
    rounded = true,
    style,
    ...props
}) => {
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
            <Feather name={iconName} size={20} color={iconColor} />
            <TextInput
                {...props}
                placeholderTextColor="#9CA3AF"
                style={[
                    styles.input,
                    {
                        color: textColor,
                    },
                    style,
                ]}
            />
        </View>
    );
};

export default BotonCustom;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 2,
        marginBottom: 8,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
    },
});
