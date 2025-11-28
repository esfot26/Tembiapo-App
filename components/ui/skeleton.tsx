import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '@/src/contexts/TemaContext';

type SkeletonProps = {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: any;
};

export const Skeleton = ({
    width = '100%',
    height = 20,
    borderRadius = 8,
    style
}: SkeletonProps) => {
    const { colors } = useTheme();
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: colors.muted,
                    opacity,
                },
                style,
            ]}
        />
    );
};

// Skeleton para tarjetas de carpetas/archivos
export const FolderCardSkeleton = () => {
    const { colors } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.background,
                borderRadius: 16,
                padding: 16,
                marginVertical: 8,
                marginHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            {/* Icono */}
            <Skeleton width={48} height={48} borderRadius={12} />

            {/* Contenido */}
            <View style={{ flex: 1, marginLeft: 16 }}>
                <Skeleton width="60%" height={16} style={{ marginBottom: 8 }} />
                <Skeleton width="40%" height={12} />
            </View>

            {/* Chevron */}
            <Skeleton width={20} height={20} borderRadius={10} />
        </View>
    );
};

// Skeleton para tarjetas de notas
export const NotaCardSkeleton = () => {
    const { colors } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.card,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.muted,
                marginHorizontal: 16,
                marginVertical: 16,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
            }}
        >
            <View style={{ flex: 1, paddingRight: 12 }}>
                {/* Título */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Skeleton width={22} height={22} borderRadius={11} style={{ marginRight: 8 }} />
                    <Skeleton width="70%" height={20} />
                </View>

                {/* Descripción */}
                <Skeleton width="90%" height={14} style={{ marginBottom: 6 }} />
                <Skeleton width="75%" height={14} style={{ marginBottom: 12 }} />

                {/* Tags */}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Skeleton width={80} height={28} borderRadius={14} />
                    <Skeleton width={70} height={28} borderRadius={14} />
                    <Skeleton width={90} height={28} borderRadius={14} />
                </View>
            </View>

            {/* Botones de acción */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
                <Skeleton width={40} height={40} borderRadius={20} />
                <Skeleton width={40} height={40} borderRadius={20} />
            </View>
        </View>
    );
};

// Skeleton para lista de carpetas
export const FolderListSkeleton = ({ count = 5 }: { count?: number }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <FolderCardSkeleton key={index} />
            ))}
        </>
    );
};

// Skeleton para lista de notas
export const NotaListSkeleton = ({ count = 3 }: { count?: number }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <NotaCardSkeleton key={index} />
            ))}
        </>
    );
};
