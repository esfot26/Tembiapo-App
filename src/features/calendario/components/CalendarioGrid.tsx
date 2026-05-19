// import { View, TouchableOpacity, Dimensions } from "react-native";
// import { useTheme } from "@/src/contexts/TemaContext";

// export const CalendarioGrid = () => {
//     const { height, width } = Dimensions.get("window");
//     const CELDA_ANCHO = width / 7 - 6;

//     const { colors, theme } = useTheme();
//     const { currentDate, selectedDate, setSelectedDate, eventos } = useCalendario();
//     // 📅 Render de días del mes
//     const renderDias = () => {
//         const year = currentDate.getFullYear();
//         const month = currentDate.getMonth();
//         const diasEnMes = new Date(year, month + 1, 0).getDate();
//         const primerDia = new Date(year, month, 1).getDay();
//         const hoy = new Date();
//         const celdas = [];

//         // Celdas vacías antes del día 1
//         for (let i = 0; i < primerDia; i++) {
//             celdas.push(
//                 <View
//                     key={`empty-${i}`}
//                     style={{
//                         width: CELDA_ANCHO,
//                         height: CELDA_ANCHO,
//                         margin: 2,
//                     }}
//                 />
//             );
//         }

//         // Días del mes
//         for (let day = 1; day <= diasEnMes; day++) {
//             const fecha = new Date(year, month, day);
//             const eventosDelDia = eventos.filter(
//                 (ev: { fecha: { getDate: () => number; getMonth: () => any; getFullYear: () => any; }; }) =>
//                     ev.fecha.getDate() === day &&
//                     ev.fecha.getMonth() === month &&
//                     ev.fecha.getFullYear() === year
//             );

//             const tieneEvento = eventosDelDia.length > 0;
//             const esHoy =
//                 fecha.getDate() === hoy.getDate() &&
//                 fecha.getMonth() === hoy.getMonth() &&
//                 fecha.getFullYear() === hoy.getFullYear();

//             const esSeleccionado =
//                 selectedDate &&
//                 fecha.getDate() === selectedDate.getDate() &&
//                 fecha.getMonth() === selectedDate.getMonth() &&
//                 fecha.getFullYear() === selectedDate.getFullYear();

//             celdas.push(
//                 <TouchableOpacity
//                     key={day}
//                     onPress={() => setSelectedDate(fecha)}
//                     style={{
//                         width: CELDA_ANCHO,
//                         height: CELDA_ANCHO,
//                         margin: 2,
//                         borderRadius: 12,
//                         borderWidth: 1,
//                         alignItems: "center",
//                         justifyContent: "center",
//                         backgroundColor: esSeleccionado
//                             ? colors.primary
//                             : esHoy
//                                 ? (theme === "dark" ? colors.card : "#e0f2fe")
//                                 : theme === "dark"
//                                     ? colors.card
//                                     : "#f9fafb",
//                         borderColor: esSeleccionado
//                             ? colors.primary
//                             : tieneEvento
//                                 ? colors.primary
//                                 : colors.border,
//                         shadowColor: "#000",
//                         shadowOpacity: 0.08,
//                         shadowRadius: 3,
//                         elevation: 2,
//                     }}
//                 >
//                     <Text
//                         style={{
//                             color: esSeleccionado
//                                 ? "#fff"
//                                 : theme === "dark"
//                                     ? colors.primaryForeground
//                                     : "#111827",
//                             fontWeight: esSeleccionado ? "700" : "500",
//                         }}
//                     >
//                         {day}
//                     </Text>

//                     {tieneEvento && !esSeleccionado && (
//                         <View
//                             style={{
//                                 width: 6,
//                                 height: 6,
//                                 borderRadius: 3,
//                                 backgroundColor: colors.primary,
//                                 marginTop: 3,
//                             }}
//                         />
//                     )}
//                 </TouchableOpacity>
//             );
//         }

//         return celdas;
//     }
// };