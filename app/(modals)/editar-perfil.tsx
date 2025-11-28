import { useEffect, useMemo, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  ActivityIndicator, ScrollView, Dimensions, KeyboardAvoidingView, Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { FIREBASE_APP, FIREBASE_DB } from "@/src/services/FirebaseConfig";
import { useTheme } from "@/src/contexts/TemaContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width, height } = Dimensions.get("window");
const auth = getAuth(FIREBASE_APP);

type FormState = {
  nombre: string;
  apellido: string;
  username: string;
  telefono: string;
  fechaNacimiento: string;
  email: string;
};

const safe = (v: any) => (v && v !== "undefined" ? String(v) : "");

export default function EditarPerfil() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showFechaPicker, setShowFechaPicker] = useState(false);

  // 1) Parseo SEGURO del parámetro (si viene)
  const parsedFromParams = useMemo(() => {
    try {
      if (!params.userData) return null;
      const data = JSON.parse(params.userData as string);
      return {
        nombreCompleto: safe(data.nombreCompleto),
        email: safe(data.email),
        telefono: safe(data.telefono),
        username: safe(data.username),
        fechaNacimiento: safe(data.fechaNacimiento),

      };
    } catch {
      return null;
    }
  }, [params.userData]);

  // 2) Estado de carga inicial (mientras resolvemos origen de datos)
  const [bootLoading, setBootLoading] = useState(true);

  // 3) Estado del formulario
  const [formData, setFormData] = useState<FormState>({
    nombre: "",
    apellido: "",
    username: "",
    telefono: "",
    fechaNacimiento: "",
    email: "",
  });

  const [errors, setErrors] = useState<{ [K in keyof FormState]?: boolean }>({});
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    (async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setBootLoading(false);
          return;
        }

        const formatFecha = (v: string) => {
          const s = safe(v);
          if (!s) return "";
          const iso = s.includes("T") ? s.split("T")[0] : s;
          const m = iso.match(/^\d{4}-\d{2}-\d{2}$/);
          if (m) {
            const [y, mo, d] = iso.split("-");
            return `${d}/${mo}/${y}`;
          }
          return s;
        };

        if (parsedFromParams) {
          const partes = safe(parsedFromParams.nombreCompleto).trim().split(" ");
          const nombre = partes[0] || "";
          const apellido = partes.slice(1).join(" ") || "";
          setFormData((prev) => ({
            ...prev,
            nombre,
            apellido,
            username: safe(parsedFromParams.username),
            telefono: safe(parsedFromParams.telefono),
            fechaNacimiento: formatFecha(parsedFromParams.fechaNacimiento as string),
            email: safe(parsedFromParams.email),
          }));
        }

        const ref = doc(FIREBASE_DB, "usuarios", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const u = snap.data() as any;
          const nombreCompleto = safe(u?.nombreCompleto) || safe(user.displayName);
          const partes = nombreCompleto.trim().split(" ");
          const nombre = partes[0] || "";
          const apellido = partes.slice(1).join(" ") || "";
          const email = safe(u?.email) || safe(user.email);
          setFormData((prev) => ({
            nombre: prev.nombre || nombre,
            apellido: prev.apellido || apellido,
            username: prev.username || safe(u?.username),
            telefono: prev.telefono || safe(u?.telefono),
            fechaNacimiento: prev.fechaNacimiento || formatFecha(safe(u?.fechaNacimiento)),
            email: prev.email || email,
          }));
        } else {
          const partes = safe(user.displayName).trim().split(" ");
          setFormData((prev) => ({
            ...prev,
            nombre: prev.nombre || partes[0] || "",
            apellido: prev.apellido || partes.slice(1).join(" ") || "",
            email: prev.email || safe(user.email),
          }));
        }
      } catch (e) {
        console.error("Error cargando datos de usuario:", e);
        Toast.show({ type: "error", text1: "No se pudieron cargar tus datos." });
      } finally {
        setBootLoading(false);
      }
    })();
  }, [parsedFromParams]);

  const validateField = (field: keyof FormState, value: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      switch (field) {
        case "nombre":
        case "apellido":
          next[field] = value.trim().length < 2;
          break;
        case "username":
          next[field] = value.trim().length < 3;
          break;
        case "telefono":
          next[field] = value.length > 0 && !/^\d{8,15}$/.test(value.replace(/\s/g, ""));
          break;
        case "fechaNacimiento":
          next[field] = value.length > 0 && !/^\d{2}\/\d{2}\/\d{4}$/.test(value);
          break;

      }
      return next;
    });
  };

  const handleUpdate = async () => {
    if (!formData.nombre || !formData.apellido || !formData.username) {
      Alert.alert("Campos obligatorios", "Completá nombre, apellido y username.");
      return;
    }
    if (Object.values(errors).some(Boolean)) {
      Alert.alert("Revisá el formulario", "Hay campos con errores.");
      return;
    }

    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Sin usuario logueado.");
      const ref = doc(FIREBASE_DB, "usuarios", user.uid);

      await updateDoc(ref, {
        username: formData.username,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        email: formData.email,
        nombreCompleto: `${formData.nombre} ${formData.apellido}`.trim(),

      });

      await updateProfile(user, {
        displayName: `${formData.nombre} ${formData.apellido}`.trim(),
      });

      Toast.show({ type: "success", text1: "Perfil actualizado" });
      router.back();
    } catch (e) {
      console.error("Error al actualizar perfil:", e);
      Toast.show({ type: "error", text1: "No se pudo actualizar el perfil" });
    } finally {
      setSaving(false);
    }
  };

  const renderInput = (
    field: keyof FormState,
    placeholder: string,
    icon: string,
    keyboardType: any = "default",
    required = false
  ) => (
    <View style={styles.inputContainer}>
      <View
        style={[
          styles.inputWrapper,
          { borderColor: colors.border, backgroundColor: colors.card },
          errors[field] && { borderColor: colors.destructive || "#ef4444" },
        ]}
      >
        <Ionicons
          name={icon as any}
          size={width * 0.06}
          color={errors[field] ? (colors.destructive || "#ef4444") : colors.foreground}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: colors.foreground }]}
          placeholder={placeholder}
          placeholderTextColor={colors.foreground}
          value={formData[field]}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, [field]: text }));
            validateField(field, text);
          }}
          keyboardType={keyboardType}
        />
        {required && <Text style={styles.requiredMark}>*</Text>}
      </View>
      {errors[field] && (
        <Text style={[styles.errorText, { color: colors.destructive || "#ef4444" }]}>
          {field === "nombre" || field === "apellido"
            ? "Mínimo 2 caracteres"
            : field === "username"
              ? "Mínimo 3 caracteres"
              : field === "telefono"
                ? "Teléfono inválido"
                : "Formato DD/MM/AAAA"
          }
        </Text>
      )}
    </View>
  );

  if (bootLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 10, color: colors.secondaryForeground }}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/configuracion")}
          activeOpacity={0.7}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
            shadowOpacity: 0.12,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <Ionicons name="arrow-back" size={width * 0.08} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center", padding: 12 }}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: colors.foreground, fontSize: 18, fontWeight: "700", marginLeft: 12 }}>
            Editar Perfil
          </Text>
        </View>
        <View style={{ width: 80 }} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Formulario */}
          <View style={[styles.formContainer, { backgroundColor: colors.card, shadowColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Información Personal</Text>
            {renderInput("nombre", "Nombre", "person-outline", "default", true)}
            {renderInput("apellido", "Apellido", "person-outline", "default", true)}
            {renderInput("username", "Nombre de usuario", "at-outline", "default", true)}
            {renderInput("email", "Correo electrónico", "mail-outline", "email-address")}

            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Información de Contacto</Text>
            {renderInput("telefono", "Teléfono", "call-outline", "phone-pad")}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  { borderColor: colors.border, backgroundColor: colors.card },
                  errors["fechaNacimiento"] && { borderColor: colors.destructive || "#ef4444" },
                ]}
              >
                <Ionicons
                  name={"calendar-outline" as any}
                  size={width * 0.06}
                  color={errors["fechaNacimiento"] ? (colors.destructive || "#ef4444") : colors.foreground}
                  style={styles.inputIcon}
                />
                <TouchableOpacity
                  style={{ flex: 1, paddingVertical: height * 0.015 }}
                  onPress={() => setShowFechaPicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: colors.foreground, fontSize: width * 0.04 }}>
                    {formData.fechaNacimiento
                      ? formData.fechaNacimiento
                      : "Fecha (DD/MM/AAAA)"}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors["fechaNacimiento"] && (
                <Text style={[styles.errorText, { color: colors.destructive || "#ef4444" }]}>Formato DD/MM/AAAA</Text>
              )}
            </View>

            {showFechaPicker && (
              <DateTimePicker
                value={(() => {
                  const s = (formData.fechaNacimiento || "").trim();
                  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
                    const [d, m, y] = s.split("/");
                    return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
                  }
                  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
                    return new Date(s);
                  }
                  return new Date();
                })()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  if (date) {
                    const dd = ("0" + date.getDate()).slice(-2);
                    const mm = ("0" + (date.getMonth() + 1)).slice(-2);
                    const yyyy = date.getFullYear();
                    const display = `${dd}/${mm}/${yyyy}`;
                    setFormData((prev) => ({ ...prev, fechaNacimiento: display }));
                    validateField("fechaNacimiento", display);
                  }
                  setShowFechaPicker(Platform.OS === "ios");
                }}
              />
            )}
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#2563eb",
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 6,
              }}
              onPress={handleUpdate}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Guardar</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)/configuracion")}
              activeOpacity={0.9}
              style={{
                flex: 1,
                backgroundColor: "#dc2626",
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 6,
              }}
            >
              <Ionicons name="close-circle-outline" size={20} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "600" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1},
  scrollContent: { paddingHorizontal: width * 0.05, paddingBottom: height * 0.05 },
  avatarContainer: { alignItems: "center", marginVertical: height * 0.03 },
  avatar: {
    width: width * 0.25, height: width * 0.25, borderRadius: width * 0.125,
    borderWidth: 1, justifyContent: "center", alignItems: "center", marginBottom: height * 0.015,
  },
  changePhotoText: { fontSize: width * 0.035, fontWeight: "600" },
  formContainer: {
    borderRadius: width * 0.04, padding: width * 0.05, marginBottom: height * 0.03,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5,
  },
  sectionTitle: { fontSize: width * 0.045, fontWeight: "600", marginBottom: height * 0.02, marginTop: height * 0.01 },
  inputContainer: { marginBottom: height * 0.02 },
  inputWrapper: {
    flexDirection: "row", alignItems: "center", borderRadius: width * 0.03,
    borderWidth: 1, paddingHorizontal: width * 0.04, minHeight: height * 0.06,
  },
  inputError: { borderColor: "#ef4444", backgroundColor: "#fef2f2" },
  inputIcon: { marginRight: width * 0.03 },
  input: { flex: 1, fontSize: width * 0.04, paddingVertical: height * 0.015 },
  requiredMark: { color: "#ef4444", fontSize: width * 0.045, fontWeight: "bold", marginLeft: width * 0.02 },
  errorText: { fontSize: width * 0.032, marginTop: height * 0.005 },
  saveButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: height * 0.02, borderRadius: width * 0.03, marginTop: height * 0.02,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: "white", fontSize: width * 0.042, fontWeight: "600", marginLeft: width * 0.02 },
});