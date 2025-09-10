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

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// 📌 Stack de Notas
function NotasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListaNotas" component={ListaNotas} />
      <Stack.Screen name="AgregarNota" component={AgregarNota} options={{ headerTitle: "Agregar Nota" }} />
      <Stack.Screen name="EditarNota" component={AgregarNota} options={{ headerTitle: "Editar Nota" }} />
    </Stack.Navigator>
  )
}

// 📌 Stack de Perfil
function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfil} options={{ headerShown: true, headerTitle: "Editar Perfil" }} />
      <Stack.Screen name="Registro" component={Registro} />
    </Stack.Navigator>
  )
}



// 📌 Tabs principales
function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Inicio" component={Inicio} options={{ headerShown: false }} />
      <Tab.Screen name="Notas" component={NotasStack} options={{ headerShown: false }} />
      <Tab.Screen name="Perfil" component={PerfilStack} options={{ headerShown: false }} />
      <Tab.Screen name="Calendario" component={CalendarioStack} options={{ headerShown: false }} />
      <Tab.Screen name="ListaNotas" component={ListaNotas} options={{ headerShown: false }} />
      
    </Tab.Navigator>
  )
}



function CalendarioStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Calendario" component={CalendarioCrud}  options={{ headerShown: false }} />
      
    </Stack.Navigator>
  )
}

// 📌 Stack de autenticación
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen
        name="Registro"
        component={Registro}
        options={{
          headerTitle: "Crear Cuenta",
          headerBackTitle: "Volver",
        }}
      />
    </Stack.Navigator>
  )
}

// 📌 Navegador principal
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
