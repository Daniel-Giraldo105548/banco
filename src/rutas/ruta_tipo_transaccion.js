const express = require('express');
const enrutador = express.Router();

const controlador_tipoTransaccion = require('../controladores/controlador_tipo_transaccion');

// Rutas para TipoTransaccion
enrutador.post('/registrar', controlador_tipoTransaccion.registrarTipoTransaccion);
enrutador.get('/listar', controlador_tipoTransaccion.listarTipoTransaccion);
enrutador.put('/actualizar/:id_tipo_transaccion', controlador_tipoTransaccion.actualizarTipoTransaccion);
enrutador.delete('/borrar/:id_tipo_transaccion', controlador_tipoTransaccion.borrarTipoTransaccion);

module.exports = enrutador;
