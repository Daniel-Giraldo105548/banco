require('dotenv').config();
const express = require('express');
const app = express(); 
const cors = require('cors');

const cliente_ruta = require('./rutas/ruta_cliente');
const barrio_ruta = require('./rutas/ruta_barrio');
const usuario_ruta = require('./rutas/ruta_usuario');
const corresponsal_ruta = require('./rutas/ruta_correponsal');
const departamento_ruta = require('./rutas/ruta_departartamento');

app.use(express.json());
app.use(cors());

// Middleware para loguear el cuerpo de las solicitudes
app.use((req, res, next) => {
  console.log('cuerpo recibido:', req.body);
  next();
});

// ✅ Ruta raíz para Render (debe ir ANTES de las rutas /api)
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// Rutas
app.use('/api/cliente', cliente_ruta);
app.use('/api/barrio', barrio_ruta);
app.use('/api/usuario', usuario_ruta);
app.use('/api/corresponsal', corresponsal_ruta);
app.use('/api/departamento', departamento_ruta);

// Middleware para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: "Error interno del servidor" });
});

const PORT = process.env.PORT || 3000;

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
