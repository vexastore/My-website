import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8",
  authDomain: "vexa-store.firebaseapp.com",
  projectId: "vexa-store",
  storageBucket: "vexa-store.firebasestorage.app",
  messagingSenderId: "544255167668",
  appId: "1:544255167668:web:03eac2e352c45a64885be1"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
export const storage = getStorage(app);
