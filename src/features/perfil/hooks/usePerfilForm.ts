import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { FIREBASE_APP, FIREBASE_DB } from "@/src/services/FirebaseConfig";
import { validateField } from "../validar.utils";
import { FormState } from "../types";

const auth = getAuth(FIREBASE_APP);
const safe = (v: any) => (v && v !== "undefined" ? String(v) : "");

const formatFecha = (v: string) => {
    const s = safe(v);
    if (!s) return "";
    const iso = s.includes("T") ? s.split("T")[0] : s;
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
        const [y, mo, d] = iso.split("-");
        return `${d}/${mo}/${y}`;
    }
    return s;
};

export function usePerfilForm() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [bootLoading, setBootLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<FormState>({
        nombre: "", apellido: "", username: "",
        telefono: "", fechaNacimiento: "", email: "",
    });
    const [errors, setErrors] = useState<{ [K in keyof FormState]?: boolean }>({});

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
        } catch { return null; }
    }, [params.userData]);

    useEffect(() => {
        (async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                if (parsedFromParams) {
                    const partes = safe(parsedFromParams.nombreCompleto).trim().split(" ");
                    setFormData((prev) => ({
                        ...prev,
                        nombre: partes[0] || "",
                        apellido: partes.slice(1).join(" ") || "",
                        username: safe(parsedFromParams.username),
                        telefono: safe(parsedFromParams.telefono),
                        fechaNacimiento: formatFecha(parsedFromParams.fechaNacimiento),
                        email: safe(parsedFromParams.email),
                    }));
                }

                const snap = await getDoc(doc(FIREBASE_DB, "usuarios", user.uid));
                if (snap.exists()) {
                    const u = snap.data() as any;
                    const nombreCompleto = safe(u?.nombreCompleto) || safe(user.displayName);
                    const partes = nombreCompleto.trim().split(" ");
                    setFormData((prev) => ({
                        nombre: prev.nombre || partes[0] || "",
                        apellido: prev.apellido || partes.slice(1).join(" ") || "",
                        username: prev.username || safe(u?.username),
                        telefono: prev.telefono || safe(u?.telefono),
                        fechaNacimiento: prev.fechaNacimiento || formatFecha(safe(u?.fechaNacimiento)),
                        email: prev.email || safe(u?.email) || safe(user.email),
                    }));
                }
            } catch (e) {
                console.error("Error cargando datos:", e);
                Toast.show({ type: "error", text1: "No se pudieron cargar tus datos." });
            } finally {
                setBootLoading(false);
            }
        })();
    }, [parsedFromParams]);

    const handleFieldChange = useCallback((field: keyof FormState, text: string) => {
        setFormData((prev) => ({ ...prev, [field]: text }));
        setErrors((prev) => ({ ...prev, [field]: validateField(field, text) }));
    }, []);

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

            await updateDoc(doc(FIREBASE_DB, "usuarios", user.uid), {
                username: formData.username,
                telefono: formData.telefono,
                fechaNacimiento: formData.fechaNacimiento,
                email: formData.email,
                nombreCompleto: `${formData.nombre} ${formData.apellido}`.trim(),
            });

            await updateProfile(user, {
                displayName: `${formData.nombre} ${formData.apellido}`.trim(),
            });

            Toast.show({ type: "success", text1: "✅ Perfil actualizado" });
            router.back();
        } catch (e) {
            console.error("Error al actualizar:", e);
            Toast.show({ type: "error", text1: "❌ No se pudo actualizar el perfil" });
        } finally {
            setSaving(false);
        }
    };

    return { formData, errors, bootLoading, saving, handleFieldChange, handleUpdate };
}