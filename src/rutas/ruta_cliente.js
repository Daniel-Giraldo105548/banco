const express = require('express');
const enrutador = express.Router();

const controlador_cliente = require('../controladores/controlador_cliente');

// Rutas para clientes
enrutador.post('/registrar', controlador_cliente.registrarCliente);
enrutador.get('/listar', controlador_cliente.listarCliente);
enrutador.put('/actualizar/:cliente_id', controlador_cliente.actualizarCliente);
enrutador.delete('/borrar/:cliente_id', controlador_cliente.borrarCliente);
enrutador.get('/:cliente_id', controlador_cliente.obtenerCliente);


module.exports = enrutador;
