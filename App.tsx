import { NavigationContainer } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import React from "react";
import { ActiveScreenProvider } from "./src/contexts/ActiveScreenContext";
import './src/styles/global.css';

export default function App() {
    return (
        <NavigationContainer>
            <ActiveScreenProvider>

                <Toast />
            </ActiveScreenProvider>
        </NavigationContainer>
    );
}
