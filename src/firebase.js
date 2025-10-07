// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAhBLX4RrIl2nRM3SIWAx_8nbMosuDqmDc",
  authDomain: "bus-booking-application-aa7e5.firebaseapp.com",
  projectId: "bus-booking-application-aa7e5",
  storageBucket: "bus-booking-application-aa7e5.appspot.com",
  messagingSenderId: "121392168783",
  appId: "1:121392168783:web:d4fc748467fa3ca4144f3a",
  measurementId: "G-QYW2G8MNBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore, Auth, Storage
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Optional: attach to window for debugging
window.__FIREBASE_DB = db;
window.__FIREBASE_AUTH = auth;

// Export modules
export { db, auth, storage };
export default app;
