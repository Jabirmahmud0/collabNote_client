import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDqQc4a6fDTwxJZRV2I5v0zGYa1XyZDdzg",
    authDomain: "simple-firebase-be35e.firebaseapp.com",
    projectId: "simple-firebase-be35e",
    storageBucket: "simple-firebase-be35e.firebasestorage.app",
    messagingSenderId: "966314283082",
    appId: "1:966314283082:web:eff25a83e121a5d4bc96b3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
