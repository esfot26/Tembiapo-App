import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-ignore
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCV8f59lcCduotEqHfaVTYDv0h1CFraPww",
  authDomain: "tembiapoapp.firebaseapp.com",
  databaseURL: "https://tembiapoapp-default-rtdb.firebaseio.com",
  projectId: "tembiapoapp",
  storageBucket: "tembiapoapp.firebasestorage.app",
  messagingSenderId: "983107385937",
  appId: "1:983107385937:web:ba1c5f3577f4c9a5fc5670"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  console.error("Fallo initializeAuth, usando getAuth como fallback:", e);
  auth = getAuth(FIREBASE_APP);
}
export const FIREBASE_AUTH = auth;

export const FIREBASE_DB = initializeFirestore(FIREBASE_APP, {
  experimentalForceLongPolling: true,
  cacheSizeBytes: 100 * 1024 * 1024,
});
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);