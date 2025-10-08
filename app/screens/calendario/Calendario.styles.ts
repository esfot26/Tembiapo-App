import { StyleSheet } from "react-native"


const { width, height } = require("react-native").Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        margin: 20,
        padding: 40,
    },
    
    loadingText: {
        marginTop: 16,
        color: "#64748b",
        textAlign: "center",
    },
    header: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontWeight: "700",
        color: "#1e293b",
    },
    headerSubtitle: {
        color: "#64748b",
        marginTop: 4,
    },
    addButton: {
        backgroundColor: "#1e40af",
        borderRadius: 12,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    calendarHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    navButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#f1f5f9",
    },
    monthTitle: {
        fontWeight: "600",
        color: "#1e293b",
    },
    calendarContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    weekHeader: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 12,
    },
    weekDay: {
        alignItems: "center",
        justifyContent: "center",
        height: 30,
    },
    weekDayText: {
        fontWeight: "600",
        color: "#64748b",
    },
    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
    },
    calendarDay: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        borderRadius: 8,
        position: "relative",
    },
    todayCell: {
        backgroundColor: "#1e40af",
    },
    dayNumber: {
        fontWeight: "500",
        color: "#1e293b",
    },
    todayText: {
        color: "#ffffff",
        fontWeight: "700",
    },
    eventIndicator: {
        position: "absolute",
        bottom: 2,
        flexDirection: "row",
        alignItems: "center",
    },
    eventDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    eventCount: {
        fontSize: 10,
        color: "#64748b",
        marginLeft: 2,
        fontWeight: "500",
    },
    eventsSection: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontWeight: "700",
        color: "#1e293b",
        marginBottom: 16,
    },
    emptyEvents: {
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyEventsText: {
        color: "#64748b",
        marginTop: 12,
        textAlign: "center",
    },

    eventCardContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    eventTypeIndicator: {
        width: 4,
        height: 40,
        borderRadius: 2,
        marginRight: 12,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitle: {
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 4,
    },
    eventDate: {
        color: "#64748b",
        marginBottom: 4,
    },
    eventDescription: {
        color: "#64748b",
        lineHeight: 18,
    },
    deleteButton: {
        padding: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 24,
        maxHeight: height * 0.8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontWeight: "700",
        color: "#1e293b",
    },
    modalInput: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        backgroundColor: "#f8fafc",
        color: "#1e293b",
    },
    modalTextArea: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        backgroundColor: "#f8fafc",
        color: "#1e293b",
        textAlignVertical: "top",
        minHeight: 80,
    },
    eventTypeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 20,
    },
    eventTypeOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    selectedEventType: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },

    selectedEventTypeText: {
        color: "#ffffff",
    },
    selectedDateContainer: {
        backgroundColor: "#f1f5f9",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    selectedDateText: {
        color: "#1e293b",
        fontWeight: "500",
        textAlign: "center",
    },
    modalActions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "red",
        color: "white",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#ffffff",
        fontWeight: "600",
    },
    saveButton: {
        flex: 1,
        backgroundColor: "green",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#94a3b8",
    },
    saveButtonText: {
        color: "white",
        fontWeight: "600",
    },
    eventsContainer: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    sectionLabel: {
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    eventCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    eventTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventIcon: {
        marginRight: 6,
    },
    eventTypeText: {
        fontWeight: '600',
        fontSize: 14,
    },
    eventActions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 6,
        marginLeft: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },

    eventContent: {
        // Contenido del evento
    },


    eventTime: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventTimeText: {
        marginLeft: 6,
        color: '#666',
    },
    eventSeparator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyStateText: {
        marginTop: 12,
        color: '#999',
        fontSize: 16,
    },

})