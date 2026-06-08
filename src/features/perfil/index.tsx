import { View, Text, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/contexts/TemaContext";
import { usePerfilForm } from "@/src/features/perfil/hooks/usePerfilForm";
import { HeaderPerfil } from "@/src/features/perfil/components/HeaderPerfil";
import { FormInput } from "@/src/features/perfil/components/Formulario";
import { DatePickerInput } from "@/src/features/perfil/components/SeleccionarFecha";
import { FormActions } from "@/src/features/perfil/components/Botones";
import { styles } from "@/src/features/perfil/styles/editar.styles";

export default function EditarPerfil() {
    const { colors } = useTheme();
    const { formData, errors, bootLoading, saving, handleFieldChange, handleUpdate } = usePerfilForm();

    if (bootLoading) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 10, color: colors.secondaryForeground }}>
                        Cargando perfil...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
            <HeaderPerfil titulo="Editar Perfil" />

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={[styles.formContainer, { backgroundColor: colors.card, shadowColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign: "center" }]}>
                            Información Personal
                        </Text>
                        {(["nombre", "apellido"] as const).map((field) => (
                            <FormInput key={field} field={field}
                                placeholder={field === "nombre" ? "Nombre" : "Apellido"}
                                icon="person-outline" required
                                value={formData[field]} error={errors[field]}
                                onChangeText={handleFieldChange}
                            />
                        ))}
                        <FormInput field="username" placeholder="Nombre de usuario"
                            icon="at-outline" required
                            value={formData.username} error={errors.username}
                            onChangeText={handleFieldChange}
                        />
                        <FormInput field="email" placeholder="Correo electrónico"
                            icon="mail-outline" keyboardType="email-address"
                            value={formData.email} error={errors.email}
                            onChangeText={handleFieldChange}
                        />
                    </View>

                    <View style={[styles.formContainer, { backgroundColor: colors.card, shadowColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                            Información de Contacto
                        </Text>
                        <FormInput field="telefono" placeholder="Teléfono"
                            icon="call-outline" keyboardType="phone-pad"
                            value={formData.telefono} error={errors.telefono}
                            onChangeText={handleFieldChange}
                        />
                        <DatePickerInput
                            value={formData.fechaNacimiento}
                            error={errors.fechaNacimiento}
                            onChange={(formatted) => handleFieldChange("fechaNacimiento", formatted)}
                        />
                    </View>

                </ScrollView>
                <FormActions saving={saving} onSave={handleUpdate} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}