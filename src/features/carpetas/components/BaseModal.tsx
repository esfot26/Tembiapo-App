import { Modal, Pressable, Dimensions, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    runOnJS,
} from "react-native-reanimated";
import { useEffect } from "react";

const DURATION = 120; 

export function BaseModal({
    visible,
    onClose,
    children,
}: {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.96);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: DURATION });
            scale.value = withTiming(1, { duration: DURATION });
        } else {
            opacity.value = withTiming(0, { duration: DURATION });
            scale.value = withTiming(0.96, { duration: DURATION });
        }
    }, [visible]);

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const boxStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));


    const handleClose = () => {
        opacity.value = withTiming(0, { duration: DURATION }, (done) => {
            if (done) runOnJS(onClose)();
        });
        scale.value = withTiming(0.96, { duration: DURATION });
    };

    if (!visible && opacity.value === 0) return null;

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
            <Animated.View style={[styles.overlay, overlayStyle]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
                <Animated.View style={[styles.box, boxStyle]}>
                    {children}
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    box: {
        width: Dimensions.get("window").width * 0.8,
    },
});