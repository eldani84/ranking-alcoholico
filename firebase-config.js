// Importa solo lo que usaremos (por simplicidad)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCP8o-aD7kqj7eqnziLSkDyLdek4AluV48",
  authDomain: "ranking-alcoholico.firebaseapp.com",
  databaseURL: "https://ranking-alcoholico-default-rtdb.firebaseio.com/",
  projectId: "ranking-alcoholico",
  storageBucket: "ranking-alcoholico.firebasestorage.app",
  messagingSenderId: "852318834036",
  appId: "1:852318834036:web:169e1c4afbfa1627353021"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
