let usuarioLogueado = "";

function login() {
  const user = document.getElementById("userSelect").value;
  const pass = document.getElementById("password").value;

  // Autenticación simple
  const claves = {
    "Dani Eberhardt": "123",
    "Juampi Comba": "123",
    "Martin Mariano": "123",
    "Martin Donnet": "123",
    "Fer Lorenz": "123",
    "Gordi Ruso": "123",
    "Adri Garau": "123"
  };

  if (claves[user] === pass) {
    usuarioLogueado = user;
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("bienvenida").innerText = "Hola " + user + " 👋";
  } else {
    alert("Contraseña incorrecta");
  }
}

function registrarConsumo() {
  const bebida = document.getElementById("bebida").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);

  alert(`${usuarioLogueado} tomó ${cantidad} ${bebida}(s)`);

  // Aquí luego vamos a guardar en Firebase
}
