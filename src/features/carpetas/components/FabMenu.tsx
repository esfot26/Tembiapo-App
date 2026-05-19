import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FabMenuProps {
    onCreateFolder: () => void;
    onUploadFile: () => void;
}

export const FabMenu = ({ onCreateFolder, onUploadFile }: FabMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <View style={styles.container}>
            {isOpen && (
                <View style={styles.menu}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => { onUploadFile(); setIsOpen(false); }}
                    >
                        <Text style={styles.menuText}>Subir Archivo</Text>
                        <Ionicons name="document-outline" size={20} color="#333" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => { onCreateFolder(); setIsOpen(false); }}
                    >
                        <Text style={styles.menuText}>Crear Carpeta</Text>
                        <Ionicons name="folder-outline" size={20} color="#333" />
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
                <Ionicons name={isOpen ? "close" : "add"} size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        alignItems: 'flex-end',
    },
    menu: {
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    menuText: {
        marginRight: 10,
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    fab: {
        backgroundColor: '#000', // Minimalista y moderno
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 6,
    },
});