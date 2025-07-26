import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDLdAIX-GdzZUCRNPCvXOudRVC6N1ISPUQ",
  authDomain: "doctor-appointment-app-96fb2.firebaseapp.com",
  projectId: "doctor-appointment-app-96fb2",
  storageBucket: "doctor-appointment-app-96fb2.firebasestorage.app",
  messagingSenderId: "419139387081",
  appId: "1:419139387081:android:9580402095cc4dccbed718"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
let auth: Auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialize Firestore
export const db = getFirestore(app);
export { auth };
export default app;