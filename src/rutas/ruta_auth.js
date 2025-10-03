const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Importa tus modelos desde la conexión
const { Usuario, Cliente } = require("../base_dato/index");

// =======================
// LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Buscar usuario en la BD
    const user = await Usuario.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // 2. Validar contraseña
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // 3. Generar token
    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        username: user.username,
        rol: user.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4. Respuesta
    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id_usuario: user.id_usuario,
        username: user.username,
        rol: user.rol,
        estado: user.estado,
        id_cliente: user.id_cliente, // ✅ ahora usa el campo correcto
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

// =======================
// REGISTER
// =======================
router.post("/register", async (req, res) => {
  try {
    const { username, password, rol } = req.body;

    // 1. Verificar si el usuario ya existe
    const existente = await Usuario.findOne({ where: { username } });
    if (existente) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // 2. Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    let id_cliente = null;

    // 3. Si el rol es CLIENTE, primero crea un cliente
    if (rol === "CLIENTE") {
      const nuevoCliente = await Cliente.create({
        nombre: username, // 👈 aquí pon los campos que realmente necesita tu tabla Cliente
        estado: "ACTIVO",
      });
      id_cliente = nuevoCliente.id_cliente; // ✅ columna correcta
    }

    // 4. Crear usuario
    const nuevoUsuario = await Usuario.create({
      username,
      password_hash: hashedPassword,
      rol,
      estado: "ACTIVO",
      id_cliente, // ✅ corregido
    });

    // 5. Respuesta
    res.json({
      mensaje: "Usuario registrado",
      usuario: {
        id_usuario: nuevoUsuario.id_usuario,
        username: nuevoUsuario.username,
        rol: nuevoUsuario.rol,
        estado: nuevoUsuario.estado,
        id_cliente: nuevoUsuario.id_cliente, // ✅ corregido
      },
    });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ mensaje: "Error al registrar usuario" });
  }
});

module.exports = router;
