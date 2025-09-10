// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-9992208726-1ce3f",
  "appId": "1:382990015899:web:411344bb0834cc94f7d53e",
  "storageBucket": "studio-9992208726-1ce3f.firebasestorage.app",
  "apiKey": "AIzaSyB21vHM_Tscjdyh_bQvs2-rhFlZgBM4Waw",
  "authDomain": "studio-9992208726-1ce3f.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "382990015899"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
