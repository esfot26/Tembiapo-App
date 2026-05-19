import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UploadProgressProps {
    progress: number; // Porcentaje de 0 a 100
    fileName?: string;
}

export const UploadProgress = ({ progress, fileName }: UploadProgressProps) => {
    // Ocultar el componente si no hay ninguna subida activa o ya terminó
    if (progress === 0 || progress === 100) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Subiendo {fileName ? fileName : 'archivo'}...
            </Text>
            <View style={styles.track}>
                <View style={[styles.fill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.percentage}>{Math.round(progress)}%</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    text: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
    },
    track: {
        height: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        backgroundColor: '#007AFF', // Azul profesional/limpio
    },
    percentage: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        textAlign: 'right',
    },
});