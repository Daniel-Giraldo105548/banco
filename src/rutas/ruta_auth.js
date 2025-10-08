const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔹 Importar modelos
const { Usuario, Cliente, Cuenta } = require("../base_dato/index");

// =======================
// LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Buscar usuario
    const user = await Usuario.findOne({ where: { username } });
    if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    // 2️⃣ Validar contraseña
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ mensaje: "Credenciales inválidas" });

    // 3️⃣ Si el usuario NO tiene cliente asociado, crearlo automáticamente
    let clienteId = user.id_cliente;
    if (!clienteId) {
      const nuevoCliente = await Cliente.create({
        nombre: user.username,
        apellido: "",
        documento: "0000000000",
        telefono: "",
        correo: "",
        direccion: "",
        id_barrio: null
      });

      clienteId = nuevoCliente.id_cliente;

      // Actualizar usuario con el nuevo id_cliente
      await user.update({ id_cliente: clienteId });
    }

    // 4️⃣ Buscar cuenta (si existe)
    let cuenta = await Cuenta.findOne({ where: { id_cliente: clienteId } });

    // 5️⃣ Generar token
    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        username: user.username,
        rol: user.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 6️⃣ Respuesta final
    res.json({
      mensaje: "Login exitoso",
      resultado: {
        token,
        usuario: {
          id_usuario: user.id_usuario,
          username: user.username,
          rol: user.rol,
          estado: user.estado,
          id_cliente: clienteId,
          id_cuenta: cuenta ? cuenta.id_cuenta : null,
          saldo: cuenta ? cuenta.saldo : null,
        },
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

// =======================
// EXPORTACIÓN
// =======================
module.exports = router;
