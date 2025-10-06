const express = require('express');
const enrutador = express.Router();

const controlador_usuario = require('../controladores/controlador_usuario');
const verificarRol = require('../middlewares/verificar_rol');
const verificarToken = require('../middlewares/verificar_token');

// Rutas para clientes
enrutador.post('/registrar', controlador_usuario.registrarUsuario);
enrutador.post('/login', controlador_usuario.loginUsuario);
enrutador.get('/listar', controlador_usuario.listarUsuarios);
enrutador.put('/actualizar/:cliente_id', controlador_usuario.actualizarUsuario);
enrutador.delete('/borrar/:cliente_id', controlador_usuario.borrarUsuario);



// Ruta protegida, solo un ADMIN_DB puede asignar roles
enrutador.put(
  '/asignar-rol/:id_usuario',
  verificarToken,                // primero token
  verificarRol(['ADMIN']),    // después rol
  controlador_usuario.asignarRol // handler final
);
module.exports = enrutador;
