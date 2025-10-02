const express = require('express');
const enrutador = express.Router();

const controlador_cuenta = require('../controladores/controlador_cuenta');

// Rutas para cuentas
enrutador.post('/registrar', controlador_cuenta.registrarCuenta);
enrutador.get('/listar', controlador_cuenta.listarCuentas);
enrutador.get('/obtener/:id_cuenta', controlador_cuenta.obtenerCuenta);
enrutador.put('/actualizar/:id_cuenta', controlador_cuenta.actualizarCuenta);
enrutador.delete('/borrar/:id_cuenta', controlador_cuenta.borrarCuenta);
router.get("/cliente/:cliente_id", controlador_cuenta.obtenerCuentaPorCliente);
module.exports = enrutador;
