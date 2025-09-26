import Toast from "react-native-toast-message";
import { Categoria, Nota, Prioridad } from "./AgregarNota.styles";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIREBASE_DB } from "../../../services/FirebaseConfig";
import { useState, useRef, useEffect } from "react";
import { Animated } from "react-native";

// ✅ Hook personalizado con animaciones
export const AgregarNotaLogica = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState<Categoria>("otro");
    const [prioridad, setPrioridad] = useState<Prioridad>("media");
    const [fechaVencimiento, setFechaVencimiento] = useState<Date | null>(null);
    const [mostrarPicker, setMostrarPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    // ✅ Animaciones
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const modalScale = useRef(new Animated.Value(0.8)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const inputFocusAnim = useRef(new Animated.Value(0)).current;

    // ✅ Efecto para animaciones
    useEffect(() => {
        if (modalVisible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(modalScale, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 50,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(modalScale, {
                    toValue: 0.8,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [modalVisible]);

    // ✅ Funciones
    const handleOpenModal = () => setModalVisible(true);
    const handleCloseModal = () => setModalVisible(false);

    // ✅ Lógica para crear una nueva nota
    const crearNota = async () => {
        if (titulo.trim() === "") {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Por favor, ingresa un título.",
            });
            return;
        }

        if (descripcion.trim() === "") {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Por favor, ingresa una descripción.",
            });
            return;
        }

        setLoading(true);
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se encontró un usuario autenticado.",
            });
            setLoading(false);
            return;
        }

        try {
            const userTodosRef = collection(FIREBASE_DB, `todos/${user.uid}/user_todos`);

            const nota: Omit<Nota, 'creado'> = {
                titulo,
                descripcion,
                categoria,
                prioridad,
                completado: false,
            };

            if (fechaVencimiento) {
                nota.fechaVencimiento = fechaVencimiento;
            }

            await addDoc(userTodosRef, {
                ...nota,
                creado: serverTimestamp(),
            });

            // Resetear formulario
            setTitulo("");
            setDescripcion("");
            setCategoria("otro");
            setPrioridad("media");
            setFechaVencimiento(null);
            setModalVisible(false);

            Toast.show({
                type: "success",
                text1: "Nota guardada",
                text2: "Tu nota se agregó correctamente ✅",
            });
        } catch (error) {
            console.error("Error al agregar la nota:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo guardar la nota",
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ Retorna estados, funciones y animaciones
    return {
        modalVisible,
        titulo,
        descripcion,
        categoria,
        prioridad,
        fechaVencimiento,
        loading,
        setModalVisible,
        setTitulo,
        setDescripcion,
        setCategoria,
        setPrioridad,
        setFechaVencimiento,
        handleOpenModal,
        handleCloseModal,
        crearNota,
        fadeAnim,
        slideAnim,
        modalScale,
        buttonScale,
        inputFocusAnim,
    };
};