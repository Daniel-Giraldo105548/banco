const express = require('express');
const enrutador = express.Router();

const controlador_departamento = require('../controladores/controlador_departamento');

// Rutas para departamento
enrutador.post('/registrar', controlador_departamento.registrarDepartamento);
enrutador.get('/listar', controlador_departamento.listarDepartamento);
enrutador.put('/actualizar/:id_corresponsal', controlador_departamento.actualizarDepartamento);
enrutador.delete('/borrar/:id_corresponsal', controlador_departamento.borrarDepartamento);

module.exports = enrutador;