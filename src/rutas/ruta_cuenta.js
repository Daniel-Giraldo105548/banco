const express = require('express');
const enrutador = express.Router();

const controlador_cuenta = require('../controladores/controlador_cuenta');

// Rutas CRUD
enrutador.post('/registrar', controlador_cuenta.registrarCuenta);
enrutador.get('/listar', controlador_cuenta.listarCuentas);
enrutador.get('/obtener/:id_cuenta', controlador_cuenta.obtenerCuenta);
enrutador.put('/actualizar/:id_cuenta', controlador_cuenta.actualizarCuenta);
enrutador.delete('/borrar/:id_cuenta', controlador_cuenta.borrarCuenta);

// Rutas del cajero
enrutador.get('/saldo/:id_cliente', controlador_cuenta.obtenerSaldo);
enrutador.post('/depositar', controlador_cuenta.depositar);
enrutador.post('/retirar', controlador_cuenta.retirar);

module.exports = enrutador;
