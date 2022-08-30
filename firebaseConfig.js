
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "dak-system-892d7.firebaseapp.com",
  projectId: "dak-system-892d7",
  storageBucket: "dak-system-892d7.appspot.com",
  messagingSenderId: "177414777091",
  appId: "1:177414777091:web:024aaebd57caf321942136"
};

// Initialize Firebase
export const application = initializeApp(firebaseConfig);
export const database = getFirestore(application);
// const analytics = getAnalytics(firebaseAuth);