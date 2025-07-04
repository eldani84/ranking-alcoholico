// Configuración Firebase completa con databaseURL y sin imports

const firebaseConfig = {
  apiKey: "AIzaSyCP8o-aD7kqj7eqnziLSkDyLdek4AluV48",
  authDomain: "ranking-alcoholico.firebaseapp.com",
  databaseURL: "https://ranking-alcoholico-default-rtdb.firebaseio.com",  // **Agregado**
  projectId: "ranking-alcoholico",
  storageBucket: "ranking-alcoholico.firebasestorage.app",
  messagingSenderId: "852318834036",
  appId: "1:852318834036:web:169e1c4afbfa1627353021"
};

// Inicializa Firebase sin usar imports, con el SDK compat cargado por script
firebase.initializeApp(firebaseConfig);
