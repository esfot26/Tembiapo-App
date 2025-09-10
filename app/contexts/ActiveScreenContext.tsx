import { createContext, useContext, useState, type ReactNode } from "react"

type ActiveScreenContextType = {
  activeScreen: string
  setActiveScreen: (screen: string) => void
}

const ActiveScreenContext = createContext<ActiveScreenContextType | undefined>(undefined)

export const ActiveScreenProvider = ({ children }: { children: ReactNode }) => {
  const [activeScreen, setActiveScreen] = useState("Inicio")

  return (
    <ActiveScreenContext.Provider value={{ activeScreen, setActiveScreen }}>
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