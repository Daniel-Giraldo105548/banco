const Joi = require('joi');
const { Corresponsal, Barrio } = require('../base_dato/index');

// ============================
// Validador con Joi
// ============================
const validadorCorresponsal = Joi.object({
  tipo: Joi.string().min(3).max(50).required().messages({
    'string.base': 'El tipo debe ser un texto.',
    'string.empty': 'El tipo es obligatorio.',
    'string.min': 'El tipo debe tener al menos {#limit} caracteres.',
    'string.max': 'El tipo no puede tener más de {#limit} caracteres.'
  }),

  direccion: Joi.string().max(200).optional().messages({
    'string.base': 'La dirección debe ser un texto.',
    'string.max': 'La dirección no puede tener más de {#limit} caracteres.'
  }),

  latitud: Joi.number().precision(8).optional().messages({
    'number.base': 'La latitud debe ser un número válido.'
  }),

  longitud: Joi.number().precision(8).optional().messages({
    'number.base': 'La longitud debe ser un número válido.'
  }),

  estado: Joi.boolean().optional().messages({
    'boolean.base': 'El estado debe ser verdadero o falso.'
  }),

  id_barrio: Joi.number().integer().required().messages({
    'number.base': 'El id_barrio debe ser un número.',
    'any.required': 'El id_barrio es obligatorio.'
  })
});

// ============================
// POST - Crear corresponsal
// ============================
const registrarCorresponsal = async (req, res) => {
  try {
    const { error } = validadorCorresponsal.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        mensaje: 'Errores en la validación',
        resultado: error.details.map(d => d.message)
      });
    }

    const { tipo, direccion, latitud, longitud, estado, id_barrio } = req.body;

    // validar barrio existe
    const barrio = await Barrio.findByPk(id_barrio);
    if (!barrio) {
      return res.status(404).json({ mensaje: 'El barrio no existe', resultado: null });
    }

    // validar que no exista tipo duplicado
    const existente = await Corresponsal.findOne({ where: { tipo } });
    if (existente) {
      return res.status(400).json({ mensaje: 'El corresponsal ya existe', resultado: null });
    }

    const nuevo = await Corresponsal.create({
      tipo, direccion, latitud, longitud, estado, id_barrio
    });

    res.status(201).json({ mensaje: 'Corresponsal creado', resultado: nuevo });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// GET - Listar corresponsales
// ============================
const listarCorresponsales = async (req, res) => {
  try {
    const corresponsales = await Corresponsal.findAll({ include: Barrio });
    res.status(200).json({ mensaje: 'Lista de corresponsales', resultado: corresponsales });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// PUT - Actualizar corresponsal
// ============================
const actualizarCorresponsal = async (req, res) => {
  try {
    const { id_corresponsal } = req.params;
    const { tipo, direccion, latitud, longitud, estado, id_barrio } = req.body;

    const corresponsal = await Corresponsal.findByPk(id_corresponsal);
    if (!corresponsal) {
      return res.status(404).json({ mensaje: 'Corresponsal no encontrado', resultado: null });
    }

    if (id_barrio) {
      const barrio = await Barrio.findByPk(id_barrio);
      if (!barrio) {
        return res.status(404).json({ mensaje: 'El barrio no existe', resultado: null });
      }
    }

    await Corresponsal.update(
      { tipo, direccion, latitud, longitud, estado, id_barrio },
      { where: { id_corresponsal } }
    );

    const actualizado = await Corresponsal.findByPk(id_corresponsal, { include: Barrio });
    res.status(200).json({ mensaje: 'Corresponsal actualizado', resultado: actualizado });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// DELETE - Borrar corresponsal
// ============================
const borrarCorresponsal = async (req, res) => {
  try {
    const { id_corresponsal } = req.params;
    const corresponsal = await Corresponsal.findByPk(id_corresponsal);
    if (!corresponsal) {
      return res.status(404).json({ mensaje: 'Corresponsal no encontrado', resultado: null });
    }
    await Corresponsal.destroy({ where: { id_corresponsal } });
    res.status(200).json({ mensaje: 'Corresponsal eliminado', resultado: null });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

module.exports = {
  registrarCorresponsal,
  listarCorresponsales,
  actualizarCorresponsal,
  borrarCorresponsal
};
