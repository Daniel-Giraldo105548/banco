const express = require('express');
const enrutador = express.Router();

const controlador_corresponsal = require('../controladores/controlador_corresponsal');

// Rutas para clientes
enrutador.post('/registrar', controlador_corresponsal.registrarCorresponsal);
enrutador.get('/listar', controlador_corresponsal.listarCorresponsales);
enrutador.put('/actualizar/:id_corresponsal', controlador_corresponsal.actualizarCorresponsal);
enrutador.delete('/borrar/:id_corresponsal', controlador_corresponsal.borrarCorresponsal);

module.exports = enrutador;
