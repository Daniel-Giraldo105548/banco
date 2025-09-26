const express = require("express");
const enrutador = express.Router();

const controlador_municipio = require("../controladores/controlador_municipio");

// ============================
// Rutas de Municipios
// ============================

// POST - Registrar municipio
enrutador.post("/registrar", controlador_municipio.registrarMunicipio);

// GET - Listar todos los municipios
enrutador.get("/listar", controlador_municipio.listarMunicipios);

// GET - Obtener municipio por ID
enrutador.get("/:id_municipio", controlador_municipio.obtenerMunicipio);

// PUT - Actualizar municipio
enrutador.put("/actualizar/:id_municipio", controlador_municipio.actualizarMunicipio);

// DELETE - Borrar municipio
enrutador.delete("/borrar/:id_municipio", controlador_municipio.borrarMunicipio);

module.exports = enrutador;
