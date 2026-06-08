import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeOutDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export function UploadProgress({
    progress,
    colors,
    onCancel,
    fileName,
}: {
    progress: number;
    colors: any;
    onCancel: () => void;
    fileName?: string;
}) {
    const pct = Math.round(progress);
    const [confirming, setConfirming] = useState(false);

    const handleCancelPress = () => setConfirming(true);
    const handleConfirm = () => { setConfirming(false); onCancel(); };
    const handleDismiss = () => setConfirming(false);

    return (
        <Animated.View
            entering={FadeInUp.springify().damping(18)}
            exiting={FadeOutDown.duration(180)}
            style={styles.container}
        >
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

                {/* Header */}
                <View style={styles.row}>
                    <View style={[styles.iconWrap, { backgroundColor: colors.primary + "15" }]}>
                        <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.info}>
                        <Text style={[styles.title, { color: colors.foreground }]}>
                            Subiendo archivo
                        </Text>
                        {fileName && (
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="middle"
                                style={[styles.filename, { color: colors.mutedForeground }]}
                            >
                                {fileName}
                            </Text>
                        )}
                    </View>
                    <View style={[styles.badge, { backgroundColor: colors.primary + "15" }]}>
                        <Text style={[styles.badgeText, { color: colors.primary }]}>{pct}%</Text>
                    </View>
                </View>

                {/* Barra */}
                <View style={[styles.track, { backgroundColor: colors.border }]}>
                    <View style={[styles.fill, { backgroundColor: colors.primary, width: `${pct}%` as any }]} />
                </View>

                {/* Botón cancelar o confirmación */}
                {!confirming ? (
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        <TouchableOpacity
                            onPress={handleCancelPress}
                            activeOpacity={0.75}
                            style={styles.cancelBtn}
                        >
                            <Ionicons name="close-circle-outline" size={18} color="#A32D2D" />
                            <Text style={styles.cancelBtnText}>Cancelar subida</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.confirmBox}>
                        <Text style={[styles.confirmText, { color: colors.mutedForeground }]}>
                            ¿Seguro que querés cancelar?
                        </Text>
                        <View style={styles.confirmRow}>
                            <TouchableOpacity
                                onPress={handleConfirm}
                                activeOpacity={0.75}
                                style={styles.btnYes}
                            >
                                <Text style={styles.btnYesText}>Sí, cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleDismiss}
                                activeOpacity={0.75}
                                style={[styles.btnNo, { backgroundColor: colors.background, borderColor: colors.border }]}
                            >
                                <Text style={[styles.btnNoText, { color: colors.foreground }]}>
                                    Seguir subiendo
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}

            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 110,
        left: 16,
        right: 16,
        zIndex: 200,
    },
    card: {
        borderRadius: 20,
        borderWidth: 0.5,
        padding: 16,
        elevation: 6,
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 14,
    },
    iconWrap: {
        width: 38, height: 38,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    info: { flex: 1, gap: 2 },
    title: { fontSize: 13, fontWeight: "600" },
    filename: { fontSize: 11 },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        minWidth: 44,
        alignItems: "center",
    },
    badgeText: { fontSize: 12, fontWeight: "600" },
    track: {
        height: 5,
        borderRadius: 999,
        overflow: "hidden",
        marginBottom: 14,
    },
    fill: { height: "100%", borderRadius: 999 },

    // Botón cancelar — grande y fácil de tocar
    cancelBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 13,
        borderRadius: 14,
        borderWidth: 0.5,
        borderColor: "#F7C1C1",
        backgroundColor: "#FCEBEB",
    },
    cancelBtnText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#A32D2D",
    },

    // Confirmación
    confirmBox: { gap: 10 },
    confirmText: {
        fontSize: 12,
        textAlign: "center",
    },
    confirmRow: {
        flexDirection: "row",
        gap: 8,
    },
    btnYes: {
        flex: 1,
        paddingVertical: 11,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: "#FCEBEB",
        borderWidth: 0.5,
        borderColor: "#F7C1C1",
    },
    btnYesText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#A32D2D",
    },
    btnNo: {
        flex: 1,
        paddingVertical: 11,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 0.5,
    },
    btnNoText: {
        fontSize: 13,
        fontWeight: "500",
    },
});