import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { styles } from "../styles/carpeta.styles";


export function FileItem({
    item,
    colors,
    onPress,
    onLongPress,
}: {
    item: any;
    colors: any;
    onPress: () => void;
    onLongPress: () => void;
}) {
    const isFolder = item.type === "folder";

    return (
        <Animated.View entering={FadeInUp.delay(50)} exiting={FadeOutDown} style={styles.itemWrapper}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                onLongPress={onLongPress}
                delayLongPress={200}
                style={[
                    styles.itemRow,
                    { backgroundColor: colors.background, borderColor: colors.border },
                ]}
            >
                {/* Icono */}
                <View style={[styles.itemIcon, { backgroundColor: colors.muted }]}>
                    <Ionicons
                        name={isFolder ? "folder-outline" : "document-text-outline"}
                        size={28}
                        color={isFolder ? "#2563EB" : "#6B7280"}
                    />
                </View>

                {/* Texto */}
                <View style={styles.itemText}>
                    <Text style={[styles.itemName, { color: colors.foreground }]}>{item.nombre}</Text>
                    <Text style={[styles.itemType, { color: colors.mutedForeground ?? colors.foreground }]}>
                        {isFolder ? "Carpeta" : "Archivo"}
                    </Text>
                </View>

                {isFolder && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
            </TouchableOpacity>
        </Animated.View>
    );
}

