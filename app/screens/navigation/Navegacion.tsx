import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from "../auth/Login"
import Registro from "../auth/Registro"
import Perfil from "../auth/Perfil"
import Inicio from "../home/Inicio"
import AgregarNota from "../todoList/AgregarNota"
import ListaNotas from "../todoList/ListaNotas"
import EditarPerfil from "../auth/EditarPerfil"
import CalendarioCrud from "../calendario/CalendarioCrud"

// Stacks
const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Stack de Notas
function NotasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="ListaNotas" component={ListaNotas} options={{ headerTitle: "Notas" }} />
      <Stack.Screen name="AgregarNota" component={AgregarNota} options={{ headerTitle: "Agregar Nota" }} />
      <Stack.Screen name="EditarNota" component={AgregarNota} options={{ headerTitle: "Editar Nota" }} />
    </Stack.Navigator>
  )
}

// Stack de Perfil
function PerfilStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Perfil" component={Perfil} options={{ headerTitle: "Mi Perfil" }} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfil} options={{ headerTitle: "Editar Perfil" }} />
    </Stack.Navigator>
  )
}

// Stack de Calendario
function CalendarioStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="CalendarioCrud" component={CalendarioCrud} options={{ headerTitle: "Calendario" }} />
    </Stack.Navigator>
  )
}



// Tabs principales
function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={Inicio} />
      <Tab.Screen name="Notas" component={NotasStack} />
      <Tab.Screen name="Calendario" component={CalendarioStack} />
      <Tab.Screen name="Perfil" component={PerfilStack} />
    </Tab.Navigator>
  )
}

// Stack de Auth
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Registro" component={Registro} options={{ headerTitle: "Crear Cuenta", headerBackTitle: "Volver" }} />
    </Stack.Navigator>
  )
}

// Navegación principal
function Navegacion({ usuarioLogueado }: { usuarioLogueado: boolean }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {usuarioLogueado ? (
        <Stack.Screen name="App" component={AppTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  )
}

export default Navegacion