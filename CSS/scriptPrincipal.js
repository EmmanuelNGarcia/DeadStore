// Estado de sesión (false = no iniciada, true = iniciada)
let sesionActiva = false;

const userBtn = document.getElementById('userBtn');
const userMenu = document.getElementById('userMenu');

// Función para renderizar menú según estado
function renderMenu() {
  userMenu.innerHTML = ""; // limpiar menú

  if (!sesionActiva) {
    // Opciones sin sesión
    const registrarme = document.createElement("button");
    registrarme.textContent = "Registrarme";
    registrarme.onclick = () => window.location.href = "registro.html";

    const iniciar = document.createElement("button");
    iniciar.textContent = "Iniciar sesión";
    iniciar.onclick = () => window.location.href = "login.html";

    const cancelar = document.createElement("button");
    cancelar.textContent = "Cancelar";
    cancelar.onclick = () => userMenu.classList.remove("active");

    userMenu.append(registrarme, iniciar, cancelar);

  } else {
    // Opciones con sesión activa
    const compras = document.createElement("button");
    compras.textContent = "Compras";
    compras.onclick = () => alert("Seleccionaste Compras");

    const datos = document.createElement("button");
    datos.textContent = "Datos";
    datos.onclick = () => alert("Seleccionaste Datos");

    const cerrar = document.createElement("button");
    cerrar.textContent = "Cerrar sesión";
    cerrar.onclick = () => {
      sesionActiva = false;
      renderMenu();
    };

    const cancelar = document.createElement("button");
    cancelar.textContent = "Cancelar";
    cancelar.onclick = () => userMenu.classList.remove("active");

    userMenu.append(compras, datos, cerrar, cancelar);
  }
}

// Evento para mostrar/ocultar menú
userBtn.addEventListener("click", () => {
  userMenu.classList.toggle("active");
  renderMenu();
});
