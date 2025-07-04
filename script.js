// firebase-config.js ya importa e inicializa Firebase y 'database' está disponible

import { getDatabase, ref, set, get, child, onValue, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

let usuarioLogueado = "";
const db = getDatabase();

const claves = {
  "Dani Eberhardt": "123",
  "Juampi Comba": "123",
  "Martin Mariano": "123",
  "Martin Donnet": "123",
  "Fer Lorenz": "123",
  "Gordi Ruso": "123",
  "Adri Garau": "123"
};

function login() {
  const user = document.getElementById("userSelect").value;
  const pass = document.getElementById("password").value;

  if (claves[user] === pass) {
    usuarioLogueado = user;
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("bienvenida").innerText = "Hola " + user + " 👋";
    cargarRanking();
  } else {
    alert("Contraseña incorrecta");
  }
}

function registrarConsumo() {
  const bebida = document.getElementById("bebida").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);

  if (!usuarioLogueado) {
    alert("Debés iniciar sesión primero");
    return;
  }
  if (cantidad < 1 || isNaN(cantidad)) {
    alert("Ingresá una cantidad válida");
    return;
  }

  const userRef = ref(db, 'usuarios/' + usuarioLogueado + '/consumo/' + bebida);

  get(userRef).then((snapshot) => {
    const actual = snapshot.exists() ? snapshot.val() : 0;
    const nuevoValor = actual + cantidad;
    set(userRef, nuevoValor)
      .then(() => {
        alert("Consumo registrado");
        cargarRanking();
      })
      .catch((error) => {
        alert("Error al guardar: " + error);
      });
  });
}

function cargarRanking() {
  const rankingUl = document.getElementById("ranking");
  rankingUl.innerHTML = "Cargando...";

  const usuariosRef = ref(db, 'usuarios');

  onValue(usuariosRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      rankingUl.innerHTML = "<li>No hay datos aún</li>";
      return;
    }
    // Construimos array para ordenar
    const rankingArray = [];

    for (const user in data) {
      const consumos = data[user].consumo || {};
      let total = 0;
      for (const bebida in consumos) {
        total += consumos[bebida];
      }
      rankingArray.push({ user, total });
    }

    rankingArray.sort((a, b) => b.total - a.total);

    // Mostrar en la lista
    rankingUl.innerHTML = "";
    rankingArray.forEach((entry, index) => {
      rankingUl.innerHTML += `<li>${index + 1}. ${entry.user} — ${entry.total} vasos</li>`;
    });
  }, { onlyOnce: true });
}
