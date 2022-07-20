
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBPaLBF7GC0s91qSuAruXdBNeMCLgx3Rd0",
  authDomain: "dak-system-ce98e.firebaseapp.com",
  projectId: "dak-system-ce98e",
  storageBucket: "dak-system-ce98e.appspot.com",
  messagingSenderId: "1063930347302",
  appId: "1:1063930347302:web:d2a9dd263904c743214be7",
  measurementId: "G-QXHDQEJMLN"
};

// Initialize Firebase
export const firebaseAuth = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseAuth);