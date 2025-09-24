require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path'); // <<< necesario para sendFile

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

/* -------------------------
   Servir archivos estáticos
   ------------------------- */
// Sirve cualquier archivo dentro de la carpeta 'publica'
app.use(express.static(path.join(__dirname, '../publica')));

// Ruta raíz: devuelve tu HTML específico
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../publica/vista_municipio/inicio.html'));
});

/*  Opcional: si usas client-side routing (SPA),
    añade tambien una ruta catch-all para devolver index (si fuera necesario):
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../publica/vista_municipio/inicio.html'));
});
*/

// Rutas API (se mantienen)
app.use('/api/cliente', cliente_ruta);
app.use('/api/barrio', barrio_ruta);
app.use('/api/usuario', usuario_ruta);
app.use('/api/corresponsal', corresponsal_ruta);
app.use('/api/departamento', departamento_ruta);

// Middleware para rutas no encontradas (aplicará a /api/... que no existan)
app.use((req, res, next) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: "Error interno del servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
