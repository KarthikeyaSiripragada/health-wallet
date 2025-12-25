import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Added Auth SDKs
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDZ0TXTf3w2FxXiAhhcw2WsNR8ZBga5MZc",
  authDomain: "healthwallet-b4f3d.firebaseapp.com",
  projectId: "healthwallet-b4f3d",
  storageBucket: "healthwallet-b4f3d.firebasestorage.app",
  messagingSenderId: "593336580394",
  appId: "1:593336580394:web:c55c3c9a260086e3a84653",
  measurementId: "G-WTS84G3C7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Auth services for use in Login.js
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();