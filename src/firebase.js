// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ** YOUR ACTUAL FIREBASE CONFIGURATION **
const firebaseConfig = {
  apiKey: "AIzaSyAhBLX4RrIl2nRM3SIWAx_8nbMosuDqmDc",
  authDomain: "bus-booking-application-aa7e5.firebaseapp.com",
  projectId: "bus-booking-application-aa7e5",
  storageBucket: "bus-booking-application-aa7e5.appspot.com",
  messagingSenderId: "121392168783",
  appId: "1:121392168783:web:799e27981065ae36144f3a",
  measurementId: "G-PP7GJYKYR8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and get a reference to the service
const db = getFirestore(app);

// Export the db instance so it can be used in other components
export { db };