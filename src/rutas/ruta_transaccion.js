const express = require('express');
const enrutador = express.Router();

const controlador_transaccion = require('../controladores/controlador_transaccion');

// Rutas para Transaccion
enrutador.post('/registrar', controlador_transaccion.registrarTransaccion);
enrutador.get('/listar', controlador_transaccion.listarTransacciones);
enrutador.put('/actualizar/:id_transaccion', controlador_transaccion.actualizarTransaccion);
enrutador.delete('/borrar/:id_transaccion', controlador_transaccion.borrarTransaccion);

router.post('/deposito', controlador_transaccion.depositarEnCuenta);

module.exports = enrutador;
