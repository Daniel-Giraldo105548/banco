const express = require("express");
const router = express.Router();


// =======================
// LOGIN (corregido)
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

    // 4️⃣ Si es cliente, buscar su cuenta asociada
    let cuenta = null;
    if (user.id_cliente || user.cliente_id) {
      const { Cuenta } = require("../base_dato/index");
      cuenta = await Cuenta.findOne({
        where: { id_cliente: user.id_cliente || user.cliente_id }
      });
    }

    // 5️⃣ Respuesta final con cuenta incluida
    res.json({
      mensaje: "Login exitoso",
      resultado: {
        token,
        usuario: {
          id_usuario: user.id_usuario,
          username: user.username,
          rol: user.rol,
          estado: user.estado,
          id_cliente: user.id_cliente || user.cliente_id,
          id_cuenta: cuenta ? cuenta.id_cuenta : null,
          saldo: cuenta ? cuenta.saldo : null
        },
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});
