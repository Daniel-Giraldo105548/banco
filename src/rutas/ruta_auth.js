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

    // 1️⃣ Buscar usuario por username
    const user = await Usuario.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // 2️⃣ Validar contraseña
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // 3️⃣ Generar token de autenticación
    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        username: user.username,
        rol: user.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4️⃣ Buscar cuenta asociada (si el usuario tiene cliente)
    let cuenta = null;
    if (user.id_cliente) {
      cuenta = await Cuenta.findOne({ where: { id_cliente: user.id_cliente } });
    }

    // 5️⃣ Respuesta con toda la información necesaria
    res.status(200).json({
      mensaje: "Login exitoso",
      resultado: {
        token,
        usuario: {
          id_usuario: user.id_usuario,
          username: user.username,
          rol: user.rol,
          estado: user.estado,
          id_cliente: user.id_cliente,  // 🔹 Importante para crear cuenta
          id_cuenta: cuenta ? cuenta.id_cuenta : null,
          saldo: cuenta ? parseFloat(cuenta.saldo) : null,
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
