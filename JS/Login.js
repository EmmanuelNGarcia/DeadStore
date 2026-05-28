document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  // Detecta automáticamente tu IP actual
  const ipServidor = window.location.hostname;
  const urlBackend = `http://${ipServidor}:3000/login`;

  function mostrarMensaje(mensaje, esError = false) {
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
    
    setTimeout(() => toast.remove(), 3000);
  }

  form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      mostrarMensaje("Por favor rellena todos los campos", true);
      return;
    }

    try {
      // Usamos la URL dinámica aquí
      const response = await fetch(urlBackend, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        mostrarMensaje("¡Bienvenido, " + data.usuario.nombre + "! Entrando...");
        
        localStorage.setItem("sesionActiva", "true");
        localStorage.setItem("nombreUsuario", data.usuario.nombre);

        setTimeout(() => {
            window.location.href = "inicio.html";
        }, 1500);
      } else {
        mostrarMensaje("❌ " + data.error, true);
      }
    } catch (error) {
      mostrarMensaje("Error al conectar con la base de datos.", true);
    }
  });
});