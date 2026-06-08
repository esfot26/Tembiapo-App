import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export function FabMenu({
    visible,
    padreId,
    colors,
    insets,
    onToggle,
    onCreateFolder,
    onUpload,
}: {
    visible: boolean;
    padreId?: string;
    colors: any;
    insets: any;
    onToggle: () => void;
    onCreateFolder: () => void;
    onUpload: () => void;
}) {
    const bottomOffset = insets.bottom + Math.max(88, Math.floor(Dimensions.get("window").height * 0.08));

    return (
        <View style={[styles.fab, { bottom: bottomOffset }]}>
            {visible && (
                <Animated.View
                    entering={FadeInUp.springify()}
                    exiting={FadeOutDown}
                    style={styles.fabMenu}
                >
                    <TouchableOpacity onPress={onCreateFolder} activeOpacity={0.8} style={styles.fabMenuItem}>
                        <Ionicons name="folder-open-outline" size={26} color="#4B5563" />
                    </TouchableOpacity>

                    {padreId && (
                        <TouchableOpacity onPress={onUpload} activeOpacity={0.8} style={styles.fabMenuItem}>
                            <Ionicons name="cloud-upload-outline" size={26} color="#2563EB" />
                        </TouchableOpacity>
                    )}
                </Animated.View>
            )}

            <TouchableOpacity
                onPress={onToggle}
                activeOpacity={0.9}
                style={[
                    styles.fabMain,
                    {
                        backgroundColor: colors.primary,
                        shadowColor: "#000",
                    },
                ]}
            >
                <Ionicons
                    name={visible ? "close" : "add"}
                    size={32}
                    color={colors.primaryForeground ?? "#fff"}
                />
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        right: 16,
        alignItems: "center",
    },
    fabMenu: {
        marginBottom: 16,
        gap: 12,
        alignItems: "center",
    },
    fabMenuItem: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    fabMain: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },

});