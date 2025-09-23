import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfcRytlsnrLEfANB1iV2bOlKkSmuKnla8",
  authDomain: "webavancada2.firebaseapp.com",
  projectId: "webavancada2",
  storageBucket: "webavancada2.firebasestorage.app",
  messagingSenderId: "65429472783",
  appId: "1:65429472783:web:a259d3c58bdcecf74b457a"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };