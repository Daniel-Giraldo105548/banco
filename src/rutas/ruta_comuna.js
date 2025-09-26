const express = require("express");
const enrutador = express.Router();

const controlador_comuna = require("../controladores/controlador_comuna");

// POST - Registrar comuna
enrutador.post("/registrar", controlador_comuna.registrarComuna);

// GET - Listar comunas
enrutador.get("/listar", controlador_comuna.listarComunas);

// GET - Obtener comuna por ID
enrutador.get("/:id_comuna", controlador_comuna.obtenerComuna);

// PUT - Actualizar comuna
enrutador.put("/actualizar/:id_comuna", controlador_comuna.actualizarComuna);

// DELETE - Eliminar comuna
enrutador.delete("/borrar/:id_comuna", controlador_comuna.borrarComuna);

module.exports = enrutador;
