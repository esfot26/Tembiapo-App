import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { nombreMeses } from "../calendarContants";


interface Props {
    currentDate: Date;
    colors: any;
    onPrev: () => void;
    onNext: () => void;
    onHoy: () => void;
}

export const CalendarioHeader = ({ currentDate, colors, onPrev, onNext, onHoy }: Props) => (
    <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.card,
        elevation: 2,
    }}>
        <TouchableOpacity onPress={onPrev}>
            <Ionicons name="chevron-back" size={26} color={colors.foreground} />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>
                {nombreMeses[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            <TouchableOpacity onPress={onHoy}>
                <Text style={{ fontSize: 16, color: colors.foreground, marginTop: 2 }}>Hoy</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onNext}>
            <Ionicons name="chevron-forward" size={26} color={colors.foreground} />
        </TouchableOpacity>
    </View>
);