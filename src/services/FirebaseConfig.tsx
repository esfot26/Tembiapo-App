import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";




const firebaseConfig = {
  apiKey: "AIzaSyCV8f59lcCduotEqHfaVTYDv0h1CFraPww",
  authDomain: "tembiapoapp.firebaseapp.com",
  projectId: "tembiapoapp",
  storageBucket: "tembiapoapp.firebasestorage.app",
  messagingSenderId: "983107385937",
  appId: "1:983107385937:web:ba1c5f3577f4c9a5fc5670"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const FIREBASE_DB = initializeFirestore(FIREBASE_APP, {
  experimentalForceLongPolling: true,
});

export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
