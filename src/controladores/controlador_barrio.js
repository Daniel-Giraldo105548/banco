const Joi = require('joi');
const { Barrio } = require('../base_dato/index'); 

// Validador para Barrio
const validadorBarrio = Joi.object({
  id_barrio: Joi.number().integer().required().messages({
    'number.base': 'El id_barrio debe ser un número entero.',
    'any.required': 'El id_barrio es obligatorio.'
  }),
  nombre: Joi.string().min(2).max(50).required().messages({
    'string.base': 'El nombre debe ser un texto.',
    'string.empty': 'El nombre es obligatorio.',
    'string.min': 'El nombre debe tener al menos {#limit} caracteres.',
    'string.max': 'El nombre no puede tener más de {#limit} caracteres.',
    'any.required': 'El nombre es un campo obligatorio.'
  }),
  id_comuna: Joi.number().integer().required().messages({
    'number.base': 'El id_comuna debe ser un número entero.',
    'any.required': 'El id_comuna es obligatorio.'
  })
});

// POST - Registrar barrio
const registrarBarrio = async (req, res) => {
  try {
    const { error } = validadorBarrio.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajesErrores = error.details.map(detail => detail.message).join('|');
      return res.status(400).json({
        mensaje: 'Errores en la validación',
        resultado: { erroresValidacion: mensajesErrores }
      });
    }

    const { id_barrio, nombre, id_comuna } = req.body; 

    // Verificar si ya existe el barrio
    const barrioExistente = await Barrio.findOne({ where: { id_barrio } });
    if (barrioExistente) {
      return res.status(400).json({ mensaje: 'El id_barrio ya existe', resultado: null });
    }

    const nombreExistente = await Barrio.findOne({ where: { nombre, id_comuna } });
    if (nombreExistente) {
      return res.status(400).json({ mensaje: 'El barrio ya existe en esta comuna', resultado: null });
    }

    // Crear barrio
    const nuevoBarrio = await Barrio.create({ id_barrio, nombre, id_comuna }); // ✅ se pasa el id_barrio

    res.status(201).json({
      mensaje: 'Barrio creado',
      resultado: nuevoBarrio
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// GET - Listar barrios
const listarBarrio = async (req, res) => {
  try {
    const barrios = await Barrio.findAll();
    res.status(200).json({ mensaje: 'Barrios listados', resultado: barrios });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// PUT - Actualizar barrio
const actualizarBarrio = async (req, res) => {
  try {
    const { id_barrio } = req.params;
    const { nombre, id_comuna } = req.body;

    const barrio = await Barrio.findByPk(id_barrio);
    if (!barrio) {
      return res.status(404).json({ mensaje: 'Barrio no encontrado', resultado: null });
    }

    await Barrio.update(
      { nombre, id_comuna },
      { where: { id_barrio } }
    );

    const barrioActualizado = await Barrio.findByPk(id_barrio);

    res.status(200).json({
      mensaje: 'Barrio actualizado',
      resultado: barrioActualizado
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// DELETE - Borrar barrio
const borrarBarrio = async (req, res) => {
  try {
    const { id_barrio } = req.params;

    const barrio = await Barrio.findByPk(id_barrio);
    if (!barrio) {
      return res.status(404).json({ mensaje: 'Barrio no encontrado', resultado: null });
    }

    await Barrio.destroy({ where: { id_barrio } });
    res.status(200).json({ mensaje: 'Barrio eliminado', resultado: null });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

module.exports = {
  registrarBarrio,
  listarBarrio,
  actualizarBarrio,
  borrarBarrio
};
