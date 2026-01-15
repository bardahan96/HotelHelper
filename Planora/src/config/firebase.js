import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDj89HYfBz9eSmf2Emhw8lPcQ8q9g0Ijj4",
  authDomain: "planora-2a8ba.firebaseapp.com",
  projectId: "planora-2a8ba",
  storageBucket: "planora-2a8ba.firebasestorage.app",
  messagingSenderId: "1027527235016",
  appId: "1:1027527235016:web:75caad16164aa14c28dcfd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;

