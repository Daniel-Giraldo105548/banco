const Joi = require("joi");
const { Municipio, Departamento } = require("../base_dato/index");

// ============================
// Validador con Joi
// ============================
const validadorMunicipio = Joi.object({
  nombre: Joi.string().min(2).max(50).required().messages({
    "string.base": "El nombre debe ser un texto.",
    "string.empty": "El nombre es obligatorio.",
    "string.min": "El nombre debe tener al menos {#limit} caracteres.",
    "string.max": "El nombre no puede tener más de {#limit} caracteres.",
    "any.required": "El nombre es obligatorio.",
  }),
  id_departamento: Joi.number().integer().required().messages({
    "number.base": "El id_departamento debe ser un número entero.",
    "any.required": "El id_departamento es obligatorio.",
  }),
});

// ============================
// POST - Registrar municipio
// ============================
const registrarMunicipio = async (req, res) => {
  try {
    console.log("cuerpo recibido:", req.body);
    const { error } = validadorMunicipio.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        mensaje: "Errores en la validación",
        resultado: error.details.map((d) => d.message),
      });
    }

    const { nombre, id_departamento } = req.body;

    // Validar departamento
    const departamento = await Departamento.findByPk(id_departamento);
    if (!departamento) {
      return res.status(404).json({
        mensaje: "El departamento no existe",
        resultado: null,
      });
    }

    // Crear municipio
    const nuevoMunicipio = await Municipio.create({ nombre, id_departamento });

    res.status(201).json({
      mensaje: "Municipio creado",
      resultado: nuevoMunicipio,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// GET - Listar municipios
// ============================
const listarMunicipios = async (req, res) => {
  try {
    const municipios = await Municipio.findAll({ include: Departamento });
    res.status(200).json({
      mensaje: "Municipios listados",
      resultado: municipios,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// GET - Obtener municipio por ID
// ============================
const obtenerMunicipio = async (req, res) => {
  try {
    const { id_municipio } = req.params;
    const municipio = await Municipio.findByPk(id_municipio, { include: Departamento });

    if (!municipio) {
      return res.status(404).json({
        mensaje: "Municipio no encontrado",
        resultado: null,
      });
    }

    res.status(200).json({
      mensaje: "Municipio encontrado",
      resultado: municipio,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// PUT - Actualizar municipio
// ============================
const actualizarMunicipio = async (req, res) => {
  try {
    const { id_municipio } = req.params;
    const { nombre, id_departamento } = req.body;

    const municipio = await Municipio.findByPk(id_municipio);
    if (!municipio) {
      return res.status(404).json({
        mensaje: "Municipio no encontrado",
        resultado: null,
      });
    }

    if (id_departamento) {
      const departamento = await Departamento.findByPk(id_departamento);
      if (!departamento) {
        return res.status(404).json({
          mensaje: "El departamento no existe",
          resultado: null,
        });
      }
    }

    await Municipio.update({ nombre, id_departamento }, { where: { id_municipio } });
    const municipioActualizado = await Municipio.findByPk(id_municipio, { include: Departamento });

    res.status(200).json({
      mensaje: "Municipio actualizado",
      resultado: municipioActualizado,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// DELETE - Borrar municipio
// ============================
const borrarMunicipio = async (req, res) => {
  try {
    const { id_municipio } = req.params;

    const municipio = await Municipio.findByPk(id_municipio);
    if (!municipio) {
      return res.status(404).json({
        mensaje: "Municipio no encontrado",
        resultado: null,
      });
    }

    await Municipio.destroy({ where: { id_municipio } });

    res.status(200).json({
      mensaje: "Municipio eliminado",
      resultado: null,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

module.exports = {
  registrarMunicipio,
  listarMunicipios,
  obtenerMunicipio,
  actualizarMunicipio,
  borrarMunicipio,
};
