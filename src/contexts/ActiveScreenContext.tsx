import { createContext, useContext, useState, type ReactNode } from "react"

type ActiveScreenContextType = {
  activeScreen: string
  setActiveScreen: (screen: string) => void
  // Opcional: función helper para navegación
  navigateToTab: (tabName: string) => void
}

const ActiveScreenContext = createContext<ActiveScreenContextType | undefined>(undefined)

export const ActiveScreenProvider = ({ children }: { children: ReactNode }) => {
  const [activeScreen, setActiveScreen] = useState("Inicio")

  // Opcional: función helper que actualiza ambos, el contexto y podría manejar navegación
  const navigateToTab = (tabName: string) => {
    setActiveScreen(tabName);
    // Aquí podrías añadir lógica de navegación si es necesario
  }

  return (
    <ActiveScreenContext.Provider value={{
      activeScreen,
      setActiveScreen,
      navigateToTab
    }}>
      {children}
    </ActiveScreenContext.Provider>
  )
}

export const useActiveScreen = () => {
  const context = useContext(ActiveScreenContext)
  if (context === undefined) {
    throw new Error("useActiveScreen must be used within an ActiveScreenProvider")
  }
  return context
}