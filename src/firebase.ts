import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8",
  authDomain: "vexa-store.firebaseapp.com",
  projectId: "vexa-store",
  storageBucket: "vexa-store.firebasestorage.app",
  messagingSenderId: "544255167668",
  appId: "1:544255167668:web:03eac2e352c45a64885be1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Sign in anonymously so Firestore security rules that require
// request.auth != null allow customers to write orders and admins
// to read them. Without this, any rule requiring authentication
// silently drops writes — orders appear for the current session
// but disappear from the Admin panel after a refresh.
signInAnonymously(auth).catch(() => {});
