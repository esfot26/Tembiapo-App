import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { FIREBASE_APP } from "./services/FirebaseConfig"
import Navegacion from "./app/screens/navigation/Navegacion"
import Navbar from "./app/components/Navbar"
import Toast from "react-native-toast-message"
import { ActiveScreenProvider, useActiveScreen } from "./app/contexts/ActiveScreenContext"

const auth = getAuth(FIREBASE_APP)

function NavigationWrapper({ usuarioLogueado }: { usuarioLogueado: boolean }) {
  const { setActiveScreen } = useActiveScreen()

  return (
    <NavigationContainer
      onStateChange={(state) => {
        const route = state?.routes[state.index]
        if (route?.name) {
          setActiveScreen(route.name) // ⚡ guardamos el nombre de la pantalla activa
        }
      }}
    >
      <Navegacion usuarioLogueado={usuarioLogueado} />
      {usuarioLogueado && <Navbar />}
      <Toast />
    </NavigationContainer>
  )
}

function Index() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuarioLogueado(!!user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return null // podrías poner un spinner aquí
  }

  return (
    <ActiveScreenProvider>
      <NavigationWrapper usuarioLogueado={usuarioLogueado} />
    </ActiveScreenProvider>
  )
}

export default Index
