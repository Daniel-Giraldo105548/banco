const Joi = require('joi');
const { Departamento } = require('../base_dato/index'); 

// ============================
// Validador para Departamento
// ============================
const validadorDepartamento = Joi.object({
  id_departamento: Joi.number().integer().required().messages({
    'number.base': 'El id_departamento debe ser un número entero.',
    'any.required': 'El id_departamento es obligatorio.'
  }),
  nombre: Joi.string().min(2).max(100).required().messages({
    'string.base': 'El nombre debe ser un texto.',
    'string.empty': 'El nombre es obligatorio.',
    'string.min': 'El nombre debe tener al menos {#limit} caracteres.',
    'string.max': 'El nombre no puede tener más de {#limit} caracteres.',
    'any.required': 'El nombre es un campo obligatorio.'
  })
});

// ============================
// POST - Registrar departamento
// ============================
const registrarDepartamento = async (req, res) => {
  try {
    const { error } = validadorDepartamento.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajesErrores = error.details.map(detail => detail.message).join('|');
      return res.status(400).json({
        mensaje: 'Errores en la validación',
        resultado: { erroresValidacion: mensajesErrores }
      });
    }

    const { id_departamento, nombre } = req.body; 

    // Verificar si ya existe el departamento
    const depExistente = await Departamento.findOne({ where: { id_departamento } });
    if (depExistente) {
      return res.status(400).json({ mensaje: 'El id_departamento ya existe', resultado: null });
    }

    const nombreExistente = await Departamento.findOne({ where: { nombre } });
    if (nombreExistente) {
      return res.status(400).json({ mensaje: 'El departamento ya existe con ese nombre', resultado: null });
    }

    // Crear departamento
    const nuevoDepartamento = await Departamento.create({ id_departamento, nombre });

    res.status(201).json({
      mensaje: 'Departamento creado',
      resultado: nuevoDepartamento
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// ============================
// GET - Listar departamentos
// ============================
const listarDepartamento = async (req, res) => {
  try {
    const departamentos = await Departamento.findAll();
    res.status(200).json({ mensaje: 'Departamentos listados', resultado: departamentos });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// ============================
// PUT - Actualizar departamento
// ============================
const actualizarDepartamento = async (req, res) => {
  try {
    const { id_departamento } = req.params;
    const { nombre } = req.body;

    const dep = await Departamento.findByPk(id_departamento);
    if (!dep) {
      return res.status(404).json({ mensaje: 'Departamento no encontrado', resultado: null });
    }

    await Departamento.update(
      { nombre },
      { where: { id_departamento } }
    );

    const depActualizado = await Departamento.findByPk(id_departamento);

    res.status(200).json({
      mensaje: 'Departamento actualizado',
      resultado: depActualizado
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// ============================
// DELETE - Borrar departamento
// ============================
const borrarDepartamento = async (req, res) => {
  try {
    const { id_departamento } = req.params;

    const dep = await Departamento.findByPk(id_departamento);
    if (!dep) {
      return res.status(404).json({ mensaje: 'Departamento no encontrado', resultado: null });
    }

    await Departamento.destroy({ where: { id_departamento } });
    res.status(200).json({ mensaje: 'Departamento eliminado', resultado: null });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

module.exports = {
  registrarDepartamento,
  listarDepartamento,
  actualizarDepartamento,
  borrarDepartamento
};
