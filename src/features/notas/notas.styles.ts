import { StyleSheet } from "react-native";


export const getStyles = (colors: {
    primary: any;
    border: any; background: any; muted: any; foreground: any; card: any 
}) => StyleSheet.create({
    containerPrincipal: {
        backgroundColor: colors.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.muted,
        marginHorizontal: 16,
        marginVertical: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 3,
    },

    boton: {
        flexDirection: "row",
        alignItems: "center",
    },

    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    categoriaContainer: {
        flexDirection: "row",
        marginTop: 10,
        flexWrap: "wrap", // Por si las etiquetas son muy largas
    },

    // Estilo base para todos los contenedores de iconos/etiquetas
    badgeContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.background,
        borderColor: colors.muted,
        borderWidth: 1,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 14,
        marginRight: 8,
        marginBottom: 4, // Un poco de espacio si saltan de línea
    },
    // Estilo específico para la fecha (si quieres quitarle el marginRight)
    fechaContainer: {
        marginRight: 0,
    },
    texto: {
        color: colors.foreground,
        marginLeft: 6,
        fontSize: 13,
        fontWeight: "500" // Un toque más profesional
    },

    header: {
        paddingHorizontal: 20,
        paddingBottom: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    titulo: {
        color: colors.foreground,
        fontSize: 18,
        fontWeight: "600",
        letterSpacing: -0.3,
    },
    botonAgregar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },

});