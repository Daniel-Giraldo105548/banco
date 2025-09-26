// ============================
// controlador_comuna.js
// ============================
const Joi = require("joi");
const { Comuna, Municipio } = require("../base_dato/index");

// ============================
// Validador con Joi
// ============================
const validadorComuna = Joi.object({
  id_comuna: Joi.number().integer().required().messages({
    "number.base": "El id_comuna debe ser un número entero.",
    "any.required": "El id_comuna es obligatorio."
  }),
  nombre: Joi.string().min(2).max(50).required().messages({
    "string.base": "El nombre debe ser un texto.",
    "string.empty": "El nombre es obligatorio.",
    "string.min": "El nombre debe tener al menos {#limit} caracteres.",
    "string.max": "El nombre no puede tener más de {#limit} caracteres.",
    "any.required": "El nombre es obligatorio.",
  }),
  id_municipio: Joi.number().integer().required().messages({
    "number.base": "El id_municipio debe ser un número entero.",
    "any.required": "El id_municipio es obligatorio.",
  }),
});

// ============================
// POST - Registrar comuna
// ============================
const registrarComuna = async (req, res) => {
  try {
    console.log("cuerpo recibido:", req.body);
    const { error } = validadorComuna.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        mensaje: "Errores en la validación",
        resultado: error.details.map((d) => d.message),
      });
    }

    const { id_comuna, nombre, id_municipio } = req.body;

    // Validar municipio
    const municipio = await Municipio.findByPk(id_municipio);
    if (!municipio) {
      return res.status(404).json({
        mensaje: "El municipio no existe",
        resultado: null,
      });
    }

    // Validar que no se repita el id_comuna
    const existente = await Comuna.findByPk(id_comuna);
    if (existente) {
      return res.status(400).json({
        mensaje: "El id_comuna ya existe",
        resultado: null,
      });
    }

    // Crear comuna
    const nuevaComuna = await Comuna.create({ id_comuna, nombre, id_municipio });

    res.status(201).json({
      mensaje: "Comuna creada",
      resultado: nuevaComuna,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// GET - Listar todas las comunas
// ============================
const listarComunas = async (req, res) => {
  try {
    const comunas = await Comuna.findAll({ include: Municipio });
    res.status(200).json({
      mensaje: "Comunas listadas",
      resultado: comunas,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// GET - Obtener comuna por ID
// ============================
const obtenerComuna = async (req, res) => {
  try {
    const { id_comuna } = req.params;
    const comuna = await Comuna.findByPk(id_comuna, { include: Municipio });

    if (!comuna) {
      return res.status(404).json({
        mensaje: "Comuna no encontrada",
        resultado: null,
      });
    }

    res.status(200).json({
      mensaje: "Comuna encontrada",
      resultado: comuna,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// PUT - Actualizar comuna
// ============================
const actualizarComuna = async (req, res) => {
  try {
    const { id_comuna } = req.params;
    const { nombre, id_municipio } = req.body;

    const comuna = await Comuna.findByPk(id_comuna);
    if (!comuna) {
      return res.status(404).json({
        mensaje: "Comuna no encontrada",
        resultado: null,
      });
    }

    if (id_municipio) {
      const municipio = await Municipio.findByPk(id_municipio);
      if (!municipio) {
        return res.status(404).json({
          mensaje: "El municipio no existe",
          resultado: null,
        });
      }
    }

    await Comuna.update({ nombre, id_municipio }, { where: { id_comuna } });
    const comunaActualizada = await Comuna.findByPk(id_comuna, { include: Municipio });

    res.status(200).json({
      mensaje: "Comuna actualizada",
      resultado: comunaActualizada,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// DELETE - Eliminar comuna
// ============================
const borrarComuna = async (req, res) => {
  try {
    const { id_comuna } = req.params;

    const comuna = await Comuna.findByPk(id_comuna);
    if (!comuna) {
      return res.status(404).json({
        mensaje: "Comuna no encontrada",
        resultado: null,
      });
    }

    await Comuna.destroy({ where: { id_comuna } });

    res.status(200).json({
      mensaje: "Comuna eliminada",
      resultado: null,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

module.exports = {
  registrarComuna,
  listarComunas,
  obtenerComuna,
  actualizarComuna,
  borrarComuna,
};
