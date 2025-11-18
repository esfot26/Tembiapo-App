import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
    text: string;
    onPress: () => void;
    colors?: string[];
}

const GradientButton: React.FC<Props> = ({
    text,
    onPress,
    colors = ["#2563EB", "#1E3A8A"],
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.shadow}
        >
            <LinearGradient colors={colors as [string, string, ...string[]]} style={styles.button}>
                <Text style={styles.text}>{text}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default GradientButton;

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    text: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    shadow: {
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
});
