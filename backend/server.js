const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Permite que tus archivos HTML se comuniquen con el servidor

// 1. Conexión o creación automática de la Base de Datos SQLite
const db = new sqlite3.Database('./tienda.db', (err) => {
    if (err) {
        console.error("Error al abrir la base de datos:", err.message);
    } else {
        console.log("Conectado con éxito a SQLite (tienda.db)");
    }
});

// 2. Crear la tabla de usuarios si no existe
// 2. Crear la tabla de usuarios (SENTENCIA CORREGIDA)
db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        email TEXT UNIQUE,
        telefono TEXT,
        password TEXT
    )
`);
// 3. RUTA DE REGISTRO: Inserta el usuario en la base de datos
app.post('/usuarios', (req, res) => {
    const { nombre, email, telefono, password } = req.body;

    if (!nombre || !email || !telefono || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?)`;
    db.run(sql, [nombre, email, telefono, password], function(err) {
        if (err) {
            if (err.message.includes("UNIQUE")) {
                return res.status(400).json({ error: "El correo electrónico ya está registrado" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            mensaje: "Usuario registrado con éxito", 
            usuario: { id: this.lastID, nombre, email } 
        });
    });
});

// 4. RUTA DE LOGIN: Compara las credenciales con la base de datos
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña requeridos" });
    }

    // Buscamos un registro donde coincidan tanto el email como la contraseña
    const sql = `SELECT * FROM usuarios WHERE email = ? AND password = ?`;
    db.get(sql, [email, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (row) {
            // Si encontró una fila, las credenciales son correctas
            res.status(200).json({ 
                mensaje: "Inicio de sesión exitoso", 
                usuario: { nombre: row.nombre, email: row.email } 
            });
        } else {
            // Si no encontró nada, el correo o la contraseña están mal
            res.status(401).json({ error: "Email o contraseña incorrectos" });
        }
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});