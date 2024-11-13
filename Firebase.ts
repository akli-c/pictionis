import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyD2Jm63mTh2mZpQ8y5jQ614bhUArUbl2WM",
  authDomain: "pictionis-e2f9d.firebaseapp.com",
  projectId: "pictionis-e2f9d",
  storageBucket: "pictionis-e2f9d.appspot.com",
  messagingSenderId: "731244985414",
  appId: "1:731244985414:web:e53604f2ce6d1140ff9e47"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(FIREBASE_APP);

