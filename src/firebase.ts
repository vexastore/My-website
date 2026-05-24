import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhrOE6l4uGbrNcc3ivbDTLyC1IBd63TV8",
  authDomain: "vexa-store.firebaseapp.com",
  projectId: "vexa-store",
  storageBucket: "vexa-store.firebasestorage.app",
  messagingSenderId: "544255167668",
  appId: "1:544255167668:web:03eac2e352c45a64885be1"
};

const app = initializeApp(firebaseConfig);

let db: ReturnType<typeof getFirestore>;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });
} catch {
  db = getFirestore(app);
}

export { db };
