const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Ejemplo de registro
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // Aquí guardarías el usuario en la BD (con Sequelize)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Ejemplo de respuesta
  res.json({ mensaje: "Usuario registrado", user: username });
});

// Ejemplo de login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Aquí buscarías al usuario en la BD
  const userFromDB = { username: "demo", password: await bcrypt.hash("1234", 10) };

  const valid = await bcrypt.compare(password, userFromDB.password);
  if (!valid) {
    return res.status(401).json({ mensaje: "Credenciales inválidas" });
  }

  const token = jwt.sign({ username: userFromDB.username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ mensaje: "Login exitoso", token });
});

module.exports = router;
