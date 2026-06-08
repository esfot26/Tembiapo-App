import { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@/src/contexts/TemaContext";
import { styles, width, height } from "../styles/editar.styles";

interface DatePickerInputProps {
    value: string;
    error?: boolean;
    onChange: (formatted: string) => void;
}

function parseToDate(s: string): Date {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
        const [d, m, y] = s.split("/");
        return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s);
    return new Date();
}

export function DatePickerInput({ value, error = false, onChange }: DatePickerInputProps) {
    const { colors } = useTheme();
    const [show, setShow] = useState(false);

    const handleChange = (_: any, date?: Date) => {
        if (Platform.OS === "android") setShow(false);
        if (date) {
            const dd = ("0" + date.getDate()).slice(-2);
            const mm = ("0" + (date.getMonth() + 1)).slice(-2);
            const yyyy = date.getFullYear();
            onChange(`${dd}/${mm}/${yyyy}`);
        }
        if (Platform.OS === "ios") setShow(false);
    };

    return (
        <View style={styles.inputContainer}>
            <TouchableOpacity
                onPress={() => setShow(true)}
                activeOpacity={0.7}
                style={[
                    styles.inputWrapper,
                    {
                        borderColor: error ? (colors.destructive ?? "#ef4444") : colors.border,
                        backgroundColor: colors.card
                    },
                ]}
            >
                <Ionicons
                    name="calendar-outline"
                    size={width * 0.06}
                    color={error ? (colors.destructive ?? "#ef4444") : colors.foreground}
                    style={styles.inputIcon}
                />
                <Text style={{
                    flex: 1, color: value ? colors.foreground : colors.mutedForeground,
                    fontSize: width * 0.038, paddingVertical: height * 0.012
                }}>
                    {value || "Fecha de nacimiento (DD/MM/AAAA)"}
                </Text>
                <Ionicons name="chevron-down-outline" size={width * 0.045} color={colors.mutedForeground} />
            </TouchableOpacity>

            {error && (
                <Text style={[styles.errorText, { color: colors.destructive ?? "#ef4444" }]}>
                    Formato DD/MM/AAAA
                </Text>
            )}

            {show && (
                <DateTimePicker
                    value={parseToDate(value)}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={handleChange}
                />
            )}
        </View>
    );
}