import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { renderCategoriaSelector } from "./renderCategoria";
import { renderPrioridadSelector } from "./renderPrioridad";
import { styles } from "../styles/nota.editor.styles";
import { Props } from "../notaProps";

export function NotaForm({
    titulo, setTitulo, descripcion, setDescripcion,
    categoria, setCategoria, prioridad, setPrioridad,
    errorTitulo, setErrorTitulo, errorDescripcion, setErrorDescripcion,
    colors, onSave, onCancel,
}: Props) {
    return (
        <>
            <Text style={[styles.label, { color: colors.foreground }]}>Título *</Text>
            <TextInput
                value={titulo}
                onChangeText={(t) => { setTitulo(t); if (errorTitulo) setErrorTitulo(null); }}
                style={[styles.input, {
                    backgroundColor: colors.card, color: colors.foreground,
                    borderColor: errorTitulo ? colors.destructive : colors.border
                }]}
                placeholder="Título de la nota"
                placeholderTextColor={colors.mutedForeground}
            />
            {errorTitulo && <Text style={[styles.errorTexto, { color: colors.destructive }]}>{errorTitulo}</Text>}

            <Text style={[styles.label, { color: colors.foreground }]}>Descripción *</Text>
            <TextInput
                value={descripcion}
                onChangeText={(t) => { setDescripcion(t); if (errorDescripcion) setErrorDescripcion(null); }}
                style={[styles.input, styles.multilineInput, {
                    backgroundColor: colors.card, color: colors.foreground,
                    borderColor: errorDescripcion ? colors.destructive : colors.border
                }]}
                placeholder="Descripción..."
                placeholderTextColor={colors.mutedForeground}
                multiline
            />
            {errorDescripcion && <Text style={[styles.errorTexto, { color: colors.destructive, marginBottom: 8 }]}>{errorDescripcion}</Text>}

            <Text style={[styles.label, { color: colors.foreground }]}>Categoría</Text>
            {renderCategoriaSelector({ categoria, setCategoria })}

            <Text style={[styles.label, { color: colors.foreground }]}>Prioridad</Text>
            {renderPrioridadSelector({ prioridad, setPrioridad })}

            <View style={{ marginTop: 28, flexDirection: "row", gap: 12 }}>
                <TouchableOpacity onPress={onSave} activeOpacity={0.9}
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}>
                    <Ionicons name="save-outline" size={22} color="white" />
                    <Text style={styles.actionText}>Guardar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onCancel} activeOpacity={0.8}
                    style={[styles.actionButton, { backgroundColor: colors.destructive }]}>
                    <Ionicons name="close-circle-outline" size={22} color="white" />
                    <Text style={styles.actionText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}