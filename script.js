// Usuarios y contraseñas simples
const claves = {
  "Dani Eberhardt": "123",
  "Juampi Comba": "123",
  "Martin Mariano": "123",
  "Martin Donnet": "123",
  "Fer Lorenz": "123",
  "Gordi Ruso": "123",
  "Adri Garau": "123"
};

let usuarioActual = null;

// Tabla de puntos por bebida y horario
const tablaPuntos = {
  "Aperitivo": { "Medio día": 15, "Tarde": 12, "Noche": 10 },
  "Fernet": { "Medio día": 10, "Tarde": 10, "Noche": 8 },
  "Cerveza": { "Medio día": 12, "Tarde": 10, "Noche": 6 },
  "Vino": { "Medio día": 8, "Tarde": 10, "Noche": 15 },
  "Whisky": { "Medio día": 5, "Tarde": 7, "Noche": 10 }
};

function login() {
  const user = document.getElementById("userSelect").value;
  const pass = document.getElementById("password").value;

  if (claves[user] && claves[user] === pass) {
    usuarioActual = user;
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("bienvenida").textContent = `Bienvenido, ${usuarioActual}`;
    cargarRanking();
    cargarTablaDeConsumos();
  } else {
    alert("Usuario o contraseña incorrecta");
  }
}

function registrarConsumo() {
  const bebida = document.getElementById("bebida").value;
  const horario = document.getElementById("horario").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);

  if (!bebida || !horario || !cantidad || cantidad < 1) {
    alert("Completa todos los campos correctamente.");
    return;
  }

  const puntosBase = tablaPuntos[bebida][horario] || 0;
  const puntos = puntosBase * cantidad;


const nuevoConsumo = {
  usuario: usuarioActual,
  bebida,
  horario,
  cantidad,
  puntos,
  timestamp: Date.now() // 👈 Esto guarda la fecha y hora
};




  const consumosRef = firebase.database().ref("consumos");
  consumosRef.push(nuevoConsumo)
    .then(() => {
      alert("Consumo registrado con éxito.");
      document.getElementById("cantidad").value = 1;
      cargarRanking();
      cargarTablaDeConsumos();
    })
    .catch(err => {
      alert("Error al guardar consumo: " + err.message);
    });
}

function cargarRanking() {
  const consumosRef = firebase.database().ref("consumos");
  consumosRef.on("value", snapshot => {
    const data = snapshot.val() || {};
    const ranking = {};

    Object.values(data).forEach(consumo => {
      if (!ranking[consumo.usuario]) ranking[consumo.usuario] = 0;
      ranking[consumo.usuario] += consumo.puntos;
    });

    const rankingArray = Object.entries(ranking)
      .map(([usuario, puntos]) => ({ usuario, puntos }))
      .sort((a, b) => b.puntos - a.puntos);

    const rankingUL = document.getElementById("ranking");
    rankingUL.innerHTML = "";

    rankingArray.forEach(({ usuario, puntos }) => {
      const li = document.createElement("li");
      li.textContent = `${usuario}: ${puntos} puntos`;
      rankingUL.appendChild(li);
    });
  });
}

function cargarTablaDeConsumos() {
  const consumosRef = firebase.database().ref("consumos");
  consumosRef.once("value", snapshot => {
    const data = snapshot.val() || {};
    const tbody = document.querySelector("#tablaConsumos tbody");
    tbody.innerHTML = "";

    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = ahora.getFullYear();

    Object.values(data).forEach(consumo => {
      const fecha = new Date(consumo.timestamp);
      const mesConsumo = fecha.getMonth();
      const anioConsumo = fecha.getFullYear();

      if (mesConsumo === mesActual && anioConsumo === anioActual) {
        const tr = document.createElement("tr");
        const nombre = consumo.usuario === usuarioActual ? consumo.usuario : "Anónimo";

        tr.innerHTML = `
          <td>${nombre}</td>
          <td>${consumo.bebida}</td>
          <td>${consumo.horario}</td>
          <td>${consumo.cantidad}</td>
          <td>${consumo.puntos}</td>
        `;

        tbody.appendChild(tr);
      }
    });
  });
}

