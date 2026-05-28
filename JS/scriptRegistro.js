document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");

  // Detecta automáticamente tu IP actual (localhost en PC, 192.168.x.x en celular)
  const ipServidor = window.location.hostname;
  const urlBackend = `http://${ipServidor}:3000/usuarios`;

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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!nombre || !email || !telefono || !password) {
      mostrarMensaje("Todos los campos son obligatorios", true);
      return;
    }

    const usuario = { nombre, email, telefono, password };

    try {
      // Usamos la URL dinámica aquí
      const response = await fetch(urlBackend, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
      });

      const data = await response.json();

      if (response.ok) {
        mostrarMensaje("✅ Registro exitoso. Redirigiendo...");
        form.reset();
        
        setTimeout(() => {
            window.location.href = "IniciarSesion.html";
        }, 1500); 
      } else {
        mostrarMensaje("❌ Error: " + data.error, true);
      }
    } catch (error) {
      mostrarMensaje("No se pudo conectar con el servidor.", true);
    }
  });
});