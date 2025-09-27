const Joi = require('joi');
const { TipoTransaccion } = require('../base_dato/index'); 

// ✅ Validador para TipoTransaccion
const validadorTipoTransaccion = Joi.object({
  id_tipo_transaccion: Joi.number().integer().optional().messages({
    'number.base': 'El id_tipo_transaccion debe ser un número entero.'
  }),
  nombre: Joi.string().min(2).max(50).required().messages({
    'string.base': 'El nombre debe ser un texto.',
    'string.empty': 'El nombre es obligatorio.',
    'string.min': 'El nombre debe tener al menos {#limit} caracteres.',
    'string.max': 'El nombre no puede tener más de {#limit} caracteres.',
    'any.required': 'El nombre es un campo obligatorio.'
  })
});

// POST - Registrar tipo de transacción
const registrarTipoTransaccion = async (req, res) => {
  try {
    const { error } = validadorTipoTransaccion.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajesErrores = error.details.map(detail => detail.message).join('|');
      return res.status(400).json({
        mensaje: 'Errores en la validación',
        resultado: { erroresValidacion: mensajesErrores }
      });
    }

    const { id_tipo_transaccion, nombre } = req.body;

    // Verificar si ya existe por nombre
    const nombreExistente = await TipoTransaccion.findOne({ where: { nombre } });
    if (nombreExistente) {
      return res.status(400).json({ mensaje: 'El tipo de transacción ya existe', resultado: null });
    }

    // Crear tipo de transacción
    const nuevoTipo = await TipoTransaccion.create({ id_tipo_transaccion, nombre });

    res.status(201).json({
      mensaje: 'Tipo de transacción creado',
      resultado: nuevoTipo
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// GET - Listar tipos de transacción
const listarTipoTransaccion = async (req, res) => {
  try {
    const tipos = await TipoTransaccion.findAll();
    res.status(200).json({ mensaje: 'Tipos de transacción listados', resultado: tipos });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// PUT - Actualizar tipo de transacción
const actualizarTipoTransaccion = async (req, res) => {
  try {
    const { id_tipo_transaccion } = req.params;
    const { nombre } = req.body;

    const tipo = await TipoTransaccion.findByPk(id_tipo_transaccion);
    if (!tipo) {
      return res.status(404).json({ mensaje: 'Tipo de transacción no encontrado', resultado: null });
    }

    await TipoTransaccion.update(
      { nombre },
      { where: { id_tipo_transaccion } }
    );

    const tipoActualizado = await TipoTransaccion.findByPk(id_tipo_transaccion);

    res.status(200).json({
      mensaje: 'Tipo de transacción actualizado',
      resultado: tipoActualizado
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// DELETE - Borrar tipo de transacción
const borrarTipoTransaccion = async (req, res) => {
  try {
    const { id_tipo_transaccion } = req.params;

    const tipo = await TipoTransaccion.findByPk(id_tipo_transaccion);
    if (!tipo) {
      return res.status(404).json({ mensaje: 'Tipo de transacción no encontrado', resultado: null });
    }

    await TipoTransaccion.destroy({ where: { id_tipo_transaccion } });
    res.status(200).json({ mensaje: 'Tipo de transacción eliminado', resultado: null });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

module.exports = {
  registrarTipoTransaccion,
  listarTipoTransaccion,
  actualizarTipoTransaccion,
  borrarTipoTransaccion
};
