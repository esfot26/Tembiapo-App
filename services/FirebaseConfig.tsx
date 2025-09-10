import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
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
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);