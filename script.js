// Importaciones desde firebase-config.js
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  onValue,
  update,
  push
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const db = getDatabase();
let usuarioLogueado = "";

// Contraseñas simples
const claves = {
  "Dani Eberhardt": "123",
  "Juampi Comba": "123",
  "Martin Mariano": "123",
  "Martin Donnet": "123",
  "Fer Lorenz": "123",
  "Gordi Ruso": "123",
  "Adri Garau": "123"
};

// Iniciar sesión
function login() {
  const user = document.getElementById("userSelect").value;
  const pass = document.getElementById("password").value;

  if (claves[user] === pass) {
    usuarioLogueado = user;
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("bienvenida").innerText = "Hola " + user + " 👋";
    cargarRanking();
    cargarFeed(); // Mostrar lista anónima
  } else {
    alert("Contraseña incorrecta");
  }
}

// Registrar consumo
function registrarConsumo() {
  const bebida = document.getElementById("bebida").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const ahora = new Date().toISOString();

  if (!usuarioLogueado) return alert("Debés iniciar sesión primero");
  if (cantidad < 1 || isNaN(cantidad)) return alert("Cantidad inválida");

  // 1. Guardar en consumo personal
  const userRef = ref(db, 'usuarios/' + usuarioLogueado + '/consumo/' + bebida);
  get(userRef).then((snapshot) => {
    const actual = snapshot.exists() ? snapshot.val() : 0;
    set(userRef, actual + cantidad);
  });

  // 2. Guardar en feed general (anónimo)
  const feedRef = ref(db, 'feed-consumos');
  push(feedRef, {
    bebida: bebida,
    cantidad: cantidad,
    autor: usuarioLogueado,
    timestamp: ahora
  }).then(() => {
    alert("Consumo registrado");
    cargarRanking();
    cargarFeed();
  });
}

// Mostrar ranking
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

    rankingUl.innerHTML = "";
    rankingArray.forEach((entry, index) => {
      rankingUl.innerHTML += `<li>${index + 1}. ${entry.user} — ${entry.total} vasos</li>`;
    });
  }, { onlyOnce: true });
}

// Mostrar lista anónima de consumos
function cargarFeed() {
  const feedDiv = document.getElementById("feed");
  feedDiv.innerHTML = "<h3>Lo que se está tomando 🍻</h3>";

  const tabla = document.createElement("table");
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Bebida</th>
        <th>Cantidad</th>
        <th>¿Quién?</th>
      </tr>
    </thead>
    <tbody id="feed-body"></tbody>
  `;
  feedDiv.appendChild(tabla);

  const feedBody = tabla.querySelector("#feed-body");
  const feedRef = ref(db, 'feed-consumos');

  onValue(feedRef, (snapshot) => {
    feedBody.innerHTML = "";

    const data = snapshot.val();
    if (!data) {
      feedBody.innerHTML = "<tr><td colspan='4'>Sin registros</td></tr>";
      return;
    }

    const registros = Object.entries(data).map(([id, item]) => item);
    registros.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    registros.forEach((item) => {
      const fecha = new Date(item.timestamp);
      const formateado = fecha.toLocaleString("es-AR", { hour12: false });
      const quien = item.autor === usuarioLogueado ? "Vos" : "—";

      feedBody.innerHTML += `
        <tr>
          <td>${formateado}</td>
          <td>${item.bebida}</td>
          <td>${item.cantidad}</td>
          <td>${quien}</td>
        </tr>
      `;
    });
  });
}
