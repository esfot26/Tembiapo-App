import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/src/contexts/TemaContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { NotaForm } from "./components/notaForm";
import { GuestWarning } from "./components/modoInvitado";
import { EditorHeader } from "./components/editorHeader";
import { useNotaEditor } from "./hooks/useNotasEditor";


export default function NotaEditorScreen() {
    const { colors } = useTheme();
    const { isGuest } = useAuth();
    const insets = useSafeAreaInsets();
    const editor = useNotaEditor();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <EditorHeader
                isEdit={editor.isEdit}
                paddingTop={insets.top + 4}
                colors={colors}
                onBack={editor.handleBack}
            />

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}>
                {isGuest ? (
                    <GuestWarning onVolver={editor.handleBack} colors={colors} />
                ) : (
                    <NotaForm
                        {...editor}
                        colors={colors}
                        onSave={editor.handleSave}
                        onCancel={editor.handleBack}
                    />
                )}
            </ScrollView>
        </View>
    );
}