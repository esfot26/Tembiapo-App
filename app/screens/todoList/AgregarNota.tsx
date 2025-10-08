import {
    TextInput,
    View,
    Modal,
    TouchableOpacity,
    Text,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { CATEGORIAS_CONFIG, Categoria, PRIORIDADES_CONFIG, Prioridad, styles,useAnimations } from "./AgregarNota.styles"
import { AgregarNotaLogica } from "./AgregarNotaLogica"



export default function AgregarNota() {

    const {
        modalVisible,
        titulo,
        descripcion,
        categoria,
        prioridad,
        loading,
        setTitulo,
        setDescripcion,
        setCategoria,
        setPrioridad,
        handleOpenModal,
        handleCloseModal,
        crearNota,
    } = AgregarNotaLogica();

    const { fadeAnim, slideAnim, buttonScale, modalScale, inputFocusAnim } = useAnimations();



    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleOpenModal}
                    activeOpacity={0.9}
                >
                    <View style={styles.buttonContent}>
                        <Ionicons name="add" size={24} color="#ffffff" />
                        <Text style={styles.addButtonText}>Nueva Nota</Text>
                    </View>
                    <View style={styles.buttonGlow} />
                </TouchableOpacity>
            </Animated.View>

            <Modal
                animationType="none"
                transparent
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <Animated.View
                    style={[
                        styles.modalOverlay,
                        { opacity: fadeAnim }
                    ]}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.keyboardAvoid}
                    >
                        <Animated.View
                            style={[
                                styles.modalContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [
                                        { translateY: slideAnim },
                                        { scale: modalScale }
                                    ]
                                }
                            ]}
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                            >
                                {/* Header del Modal */}
                                <View style={styles.modalHeader}>
                                    <View style={styles.titleContainer}>
                                        <Ionicons name="create-outline" size={28} color="#4f46e5" />
                                        <Text style={styles.modalTitle}>Crear Nueva Nota</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleCloseModal}
                                        style={styles.closeButton}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="close" size={24} color="#6b7280" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inputContainer}>
                                    {/* Campo Título */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Título *</Text>
                                        <Animated.View
                                            style={[
                                                styles.inputWrapper,
                                                {
                                                    transform: [{
                                                        scale: inputFocusAnim.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [1, 1.02]
                                                        })
                                                    }],
                                                    shadowOpacity: inputFocusAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0.1, 0.2]
                                                    })
                                                }
                                            ]}
                                        >
                                            <Ionicons name="pencil-outline" size={20} color="#6b7280" />
                                            <TextInput
                                                style={styles.titleInput}
                                                placeholder="Escribe un título atractivo..."
                                                placeholderTextColor="#9ca3af"
                                                value={titulo}
                                                onChangeText={setTitulo}
                                                editable={!loading}

                                            />
                                        </Animated.View>
                                    </View>

                                    {/* Campo Descripción */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Descripción *</Text>
                                        <View style={styles.descriptionWrapper}>
                                            <TextInput
                                                style={styles.descriptionInput}
                                                placeholder="Describe tu nota con detalles..."
                                                placeholderTextColor="#9ca3af"
                                                value={descripcion}
                                                onChangeText={setDescripcion}
                                                editable={!loading}
                                                multiline
                                                numberOfLines={4}
                                                textAlignVertical="top"
                                            />
                                        </View>
                                    </View>

                                    {/* Selector de Categoría */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Categoría</Text>
                                        <View style={styles.selectorContainer}>
                                            {(Object.keys(CATEGORIAS_CONFIG) as Categoria[]).map((cat) => {
                                                const config = CATEGORIAS_CONFIG[cat]
                                                const isSelected = categoria === cat

                                                return (
                                                    <TouchableOpacity
                                                        key={cat}
                                                        onPress={() => setCategoria(cat)}
                                                        style={styles.categoriaItem}
                                                        activeOpacity={0.8}
                                                    >
                                                        {isSelected ? (
                                                            <Animated.View
                                                                style={[
                                                                    styles.categoriaButtonSelected,
                                                                    {
                                                                        backgroundColor: config.color,
                                                                        shadowOpacity: 0.3
                                                                    }
                                                                ]}
                                                            >
                                                                <Ionicons name={config.icon} size={16} color="#ffffff" />
                                                                <Text style={styles.categoriaTextoSelected}>
                                                                    {config.label}
                                                                </Text>
                                                            </Animated.View>
                                                        ) : (
                                                            <Animated.View
                                                                style={[
                                                                    styles.categoriaButton,
                                                                    {
                                                                        borderColor: config.color,
                                                                        backgroundColor: config.lightColor
                                                                    }
                                                                ]}
                                                            >
                                                                <Ionicons name={config.icon} size={16} color={config.color} />
                                                                <Text style={[styles.categoriaTexto, { color: config.color }]}>
                                                                    {config.label}
                                                                </Text>
                                                            </Animated.View>
                                                        )}
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </View>
                                    </View>

                                    {/* Selector de Prioridad */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Prioridad</Text>
                                        <View style={styles.selectorContainer}>
                                            {(Object.keys(PRIORIDADES_CONFIG) as Prioridad[]).map((prio) => {
                                                const config = PRIORIDADES_CONFIG[prio]
                                                const isSelected = prioridad === prio

                                                return (
                                                    <TouchableOpacity
                                                        key={prio}
                                                        onPress={() => setPrioridad(prio)}
                                                        style={styles.prioridadItem}
                                                        activeOpacity={0.8}
                                                    >
                                                        {isSelected ? (
                                                            <Animated.View
                                                                style={[
                                                                    styles.prioridadButtonSelected,
                                                                    { backgroundColor: config.color }
                                                                ]}
                                                            >
                                                                <Ionicons name={config.icon} size={14} color="#ffffff" />
                                                                <Text style={styles.prioridadTextoSelected}>
                                                                    {config.label}
                                                                </Text>
                                                            </Animated.View>
                                                        ) : (
                                                            <View style={styles.prioridadButton}>
                                                                <Ionicons name={config.icon} size={14} color={config.color} />
                                                                <Text style={[styles.prioridadTexto, { color: config.color }]}>
                                                                    {config.label}
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </View>
                                    </View>

                                    {/* Información de fecha */}
                                    <Animated.View
                                        style={[
                                            styles.fechaCreacionContainer,
                                            {
                                                opacity: fadeAnim,
                                                transform: [{
                                                    translateY: fadeAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [20, 0]
                                                    })
                                                }]
                                            }
                                        ]}
                                    >
                                        <Ionicons name="time-outline" size={16} color="#6b7280" />
                                        <Text style={styles.fechaCreacionTexto}>
                                            Se creará el {new Date().toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </Text>
                                    </Animated.View>
                                </View>

                                {/* Botones de acción */}
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        onPress={handleCloseModal}
                                        style={styles.cancelButton}
                                        activeOpacity={0.7}
                                        disabled={loading}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={crearNota}
                                        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                                        disabled={loading}
                                        activeOpacity={0.8}
                                    >
                                        <Animated.View
                                            style={[
                                                styles.saveButtonContent,
                                                {
                                                    backgroundColor: loading ? '#9ca3af' : '#10b981',
                                                    opacity: loading ? 0.7 : 1
                                                }
                                            ]}
                                        >
                                            {loading ? (
                                                <Animated.View style={styles.loadingContainer}>
                                                    <Ionicons name="hourglass-outline" size={16} color="#ffffff" />
                                                </Animated.View>
                                            ) : (
                                                <Ionicons name="checkmark-circle-outline" size={16} color="#ffffff" />
                                            )}
                                            <Text style={styles.saveButtonText}>
                                                {loading ? "Guardando..." : "Crear Nota"}
                                            </Text>
                                        </Animated.View>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </Animated.View>
                    </KeyboardAvoidingView>
                </Animated.View>
            </Modal>
        </View>
    )
}

