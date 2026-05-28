let sesionActiva = localStorage.getItem("sesionActiva") === "true";

const userBtn = document.getElementById('userBtn');
const userMenu = document.getElementById('userMenu');

function renderMenu() {
  if (!userMenu) return; 
  userMenu.innerHTML = ""; 

  if (!sesionActiva) {
    const opciones = [
      { texto: "Registrarme", link: "Registro.html" },
      { texto: "Iniciar sesión", link: "IniciarSesion.html" },
      { texto: "Cancelar", accion: "cerrar" }
    ];

    opciones.forEach(op => {
      const btn = document.createElement("button");
      btn.textContent = op.texto;
      btn.onclick = () => {
        if (op.accion === "cerrar") userMenu.classList.remove("active");
        else window.location.href = op.link;
      };
      userMenu.appendChild(btn);
    });
  } else {
    const opciones = [
      { texto: "Mi Cesta", link: "carrito.html" },
      { texto: "Datos", accion: "datos" },
      { texto: "Cerrar sesión", accion: "logout" },
      { texto: "Cancelar", accion: "cerrar" }
    ];

    opciones.forEach(op => {
      const btn = document.createElement("button");
      btn.textContent = op.texto;
      btn.onclick = () => {
        switch (op.accion) {
          case "logout":
            localStorage.setItem("sesionActiva", "false");
            sesionActiva = false;
            renderMenu();
            mostrarNotificacion("Sesión cerrada");
            break;
          case "cerrar":
            userMenu.classList.remove("active");
            break;
          case "datos":
            mostrarNotificacion("Sección de datos en construcción");
            break;
          default:
            if(op.link) window.location.href = op.link;
        }
      };
      userMenu.appendChild(btn);
    });
  }
}

if (userBtn) {
  userBtn.addEventListener("click", () => {
    userMenu.classList.toggle("active");
    renderMenu();
  });
}

// SISTEMA DE NOTIFICACIONES
function mostrarNotificacion(mensaje, esError = false) {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.style.backgroundColor = esError ? "#d32f2f" : "#000000";
    toast.textContent = mensaje;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// LÓGICA DEL CARRITO (AHORA INCLUYE TALLA)
function agregarAlCarrito(nombre, precio, idSelectorTalla) {
    const selector = document.getElementById(idSelectorTalla);
    const tallaSeleccionada = selector.value;

    if (!tallaSeleccionada) {
        mostrarNotificacion("Por favor, selecciona una talla", true);
        return; 
    }

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push({ nombre: nombre, precio: precio, talla: tallaSeleccionada });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    mostrarNotificacion(`Añadido: ${nombre} (${tallaSeleccionada})`);
}