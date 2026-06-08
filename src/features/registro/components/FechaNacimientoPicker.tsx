import { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import BotonCustom from "@/components/ui/BotonCustom";

interface Props {
    value: string;
    onChange: (date: string) => void;
}

export function FechaNacimientoPicker({ value, onChange }: Props) {
    const [show, setShow] = useState(false);

    const handleChange = (_: any, selectedDate?: Date) => {
        setShow(Platform.OS === "ios");
        if (selectedDate) {
            onChange(selectedDate.toISOString().split("T")[0]);
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setShow(true)}>
                <BotonCustom
                    iconName="calendar"
                    placeholder="Seleccionar fecha"
                    value={value ? value.split("-").reverse().join("/") : ""}
                    editable={false}
                />
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleChange}
                />
            )}
        </View>
    );
}