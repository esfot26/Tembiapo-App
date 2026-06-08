import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export function useCalendarioAnimacion(selectedDate: Date | null) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, friction: 7, useNativeDriver: true }),
        ]).start();
    }, [selectedDate]);

    return { fadeAnim, slideAnim };
}