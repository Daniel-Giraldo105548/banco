const Joi = require('joi');
const { Cliente } = require('../base_dato/index');

// Validador para cliente
const validadorRegistro = Joi.object({
  nombre: Joi.string().min(2).max(50).required().messages({
    'string.base': 'El nombre debe ser un texto.',
    'string.empty': 'El nombre es obligatorio.',
    'string.min': 'El nombre debe tener al menos {#limit} caracteres.',
    'string.max': 'El nombre no puede tener más de {#limit} caracteres.',
    'any.required': 'El nombre es un campo obligatorio.'
  }),

  apellido: Joi.string().min(2).max(50).optional().messages({
    'string.base': 'El apellido debe ser un texto.',
    'string.min': 'El apellido debe tener al menos {#limit} caracteres.',
    'string.max': 'El apellido no puede tener más de {#limit} caracteres.'
  }),

  documento: Joi.string().min(6).max(50).required().messages({
    'string.base': 'El documento debe ser un texto.',
    'string.empty': 'El documento es obligatorio.',
    'string.min': 'El documento debe tener al menos {#limit} caracteres.',
    'string.max': 'El documento no puede tener más de {#limit} caracteres.',
    'any.required': 'El documento es un campo obligatorio.'
  }),

  telefono: Joi.string().pattern(/^[0-9]{7,12}$/).optional().messages({
    'string.base': 'El teléfono debe ser un texto.',
    'string.pattern.base': 'El teléfono debe tener entre 7 y 12 dígitos numéricos.'
  }),

  correo: Joi.string().email().optional().messages({
    'string.base': 'El correo debe ser un texto.',
    'string.email': 'El correo debe ser un correo electrónico válido.'
  }),

  direccion: Joi.string().max(100).optional().messages({
    'string.base': 'La dirección debe ser un texto.',
    'string.max': 'La dirección no puede tener más de {#limit} caracteres.'
  })
});

// POST - Registrar cliente
const registrarCliente = async (req, res) => {
  try {
    const { error } = validadorRegistro.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajesErrores = error.details.map(detail => detail.message).join('|');
      return res.status(400).json({
        mensaje: 'Errores en la validación',
        resultado: { erroresValidacion: mensajesErrores }
      });
    }

    const { documento, nombre, apellido = null, telefono = null, correo = null, direccion = null } = req.body;

    // verificar si ya existe el cliente
    const clienteExistente = await Cliente.findOne({ where: { documento } });
    if (clienteExistente) {
      return res.status(400).json({ mensaje: 'El cliente ya existe', resultado: null });
    }

    // crear cliente 
    const nuevoCliente = await Cliente.create({
      documento,
      nombre,
      apellido,
      telefono,
      correo,
      direccion
    });

    res.status(201).json({
      mensaje: 'Cliente creado',
      resultado: nuevoCliente
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// GET - Listar clientes
const listarCliente = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.status(200).json({ mensaje: 'Clientes listados', resultado: clientes });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};



// PUT - Actualizar cliente
const actualizarCliente = async (req, res) => {
  try {
    const { cliente_id } = req.params; 
    const { nombre, apellido, telefono, correo, direccion } = req.body;

    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado', resultado: null });
    }

    await Cliente.update(
      { nombre, apellido, telefono, correo, direccion },
      { where: { cliente_id } }
    );

    const clienteActualizado = await Cliente.findByPk(cliente_id);

    res.status(200).json({
      mensaje: 'Cliente actualizado',
      resultado: clienteActualizado,
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// DELETE - Borrar cliente
const borrarCliente = async (req, res) => {
  try {
    const { cliente_id } = req.params;

    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      return res
        .status(404)
        .json({ mensaje: 'Cliente no encontrado', resultado: null });
    }

    await Cliente.destroy({ where: { cliente_id } });
    res.status(200).json({ mensaje: 'Cliente eliminado', resultado: null });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// GET - Buscar cliente por ID
const obtenerCliente = async (req, res) => {
  try {
    const { cliente_id } = req.params;

    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado', resultado: null });
    }

    res.status(200).json({
      mensaje: 'Cliente encontrado',
      resultado: cliente
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};


module.exports = {
  registrarCliente,
  listarCliente,
  actualizarCliente,
  borrarCliente,
  obtenerCliente
};
