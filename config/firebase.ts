import {
  APIKEY,
  APPID,
  AUTHDOMAIN,
  MESSAGINGSENDERID,
  PROJECTID,
  STORAGEBUCKET,
} from "@/constants/envVariables";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  projectId: PROJECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
};

// Initialize firebase
const app = initializeApp(firebaseConfig);

// Authentication
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Database
export const firestore = getFirestore(app);
