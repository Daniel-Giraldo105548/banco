const express = require('express');
const enrutador = express.Router();

const controlador_barrio = require('../controladores/controlador_barrio');

// Rutas para barrios
enrutador.post('/registrar', controlador_barrio.registrarBarrio);
enrutador.get('/listar', controlador_barrio.listarBarrio);
enrutador.put('/actualizar/:id_barrio', controlador_barrio.actualizarBarrio);
enrutador.delete('/borrar/:id_barrio', controlador_barrio.borrarBarrio);

module.exports = enrutador;
