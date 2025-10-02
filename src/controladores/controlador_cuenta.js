const Joi = require("joi");
const { Cuenta, Cliente } = require("../base_dato/index");

// ============================
// Validador con Joi
// ============================
const validadorCuenta = Joi.object({
  numero_cuenta: Joi.string().max(50).required().messages({
    "string.base": "El número de cuenta debe ser un texto.",
    "string.empty": "El número de cuenta es obligatorio.",
    "string.max": "El número de cuenta no puede tener más de {#limit} caracteres.",
    "any.required": "El número de cuenta es obligatorio.",
  }),
  estado: Joi.boolean().required().messages({
    "boolean.base": "El estado debe ser verdadero o falso.",
    "any.required": "El estado es obligatorio.",
  }),
  saldo: Joi.number().precision(2).required().messages({
    "number.base": "El saldo debe ser un número.",
    "any.required": "El saldo es obligatorio.",
  }),
  fecha_apertura: Joi.date().required().messages({
    "date.base": "La fecha de apertura debe ser una fecha válida.",
    "any.required": "La fecha de apertura es obligatoria.",
  }),
  tipo_cuenta: Joi.string().max(50).required().messages({
    "string.base": "El tipo de cuenta debe ser un texto.",
    "string.empty": "El tipo de cuenta es obligatorio.",
    "string.max": "El tipo de cuenta no puede tener más de {#limit} caracteres.",
    "any.required": "El tipo de cuenta es obligatorio.",
  }),
  id_cliente: Joi.number().integer().required().messages({
    "number.base": "El id_cliente debe ser un número entero.",
    "any.required": "El id_cliente es obligatorio.",
  }),
});

// ============================
// POST - Registrar cuenta
// ============================
const registrarCuenta = async (req, res) => {
  try {
    const { error } = validadorCuenta.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        mensaje: "Errores en la validación",
        resultado: error.details.map((d) => d.message),
      });
    }

    const { numero_cuenta, estado, saldo, fecha_apertura, tipo_cuenta, id_cliente } = req.body;

    console.log("Creando cuenta con id_cliente:", id_cliente);

    // Validar cliente
    const cliente = await Cliente.findByPk(id_cliente);
    if (!cliente) {
      return res.status(404).json({
        mensaje: "El cliente no existe",
        resultado: null,
      });
    }

    // Crear cuenta
    const nuevaCuenta = await Cuenta.create({
      numero_cuenta,
      estado,
      saldo,
      fecha_apertura,
      tipo_cuenta,
      id_cliente,
    });

    res.status(201).json({
      mensaje: "Cuenta creada",
      resultado: nuevaCuenta,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// GET - Listar cuentas
// ============================
const listarCuentas = async (req, res) => {
  try {
    const cuentas = await Cuenta.findAll({ include: Cliente });
    res.status(200).json({
      mensaje: "Cuentas listadas",
      resultado: cuentas,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// GET - Obtener cuenta por ID
// ============================
const obtenerCuenta = async (req, res) => {
  try {
    const { id_cuenta } = req.params;
    const cuenta = await Cuenta.findByPk(id_cuenta, { include: Cliente });

    if (!cuenta) {
      return res.status(404).json({
        mensaje: "Cuenta no encontrada",
        resultado: null,
      });
    }

    res.status(200).json({
      mensaje: "Cuenta encontrada",
      resultado: cuenta,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// PUT - Actualizar cuenta
// ============================
const actualizarCuenta = async (req, res) => {
  try {
    const { id_cuenta } = req.params;
    const { numero_cuenta, estado, saldo, fecha_apertura, tipo_cuenta, id_cliente } = req.body;

    const cuenta = await Cuenta.findByPk(id_cuenta);
    if (!cuenta) {
      return res.status(404).json({
        mensaje: "Cuenta no encontrada",
        resultado: null,
      });
    }

    if (id_cliente) {
      const cliente = await Cliente.findByPk(id_cliente);
      if (!cliente) {
        return res.status(404).json({
          mensaje: "El cliente no existe",
          resultado: null,
        });
      }
    }

    await Cuenta.update(
      { numero_cuenta, estado, saldo, fecha_apertura, tipo_cuenta, id_cliente },
      { where: { id_cuenta } }
    );

    const cuentaActualizada = await Cuenta.findByPk(id_cuenta, { include: Cliente });

    res.status(200).json({
      mensaje: "Cuenta actualizada",
      resultado: cuentaActualizada,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// DELETE - Borrar cuenta
// ============================
const borrarCuenta = async (req, res) => {
  try {
    const { id_cuenta } = req.params;

    const cuenta = await Cuenta.findByPk(id_cuenta);
    if (!cuenta) {
      return res.status(404).json({
        mensaje: "Cuenta no encontrada",
        resultado: null,
      });
    }

    await Cuenta.destroy({ where: { id_cuenta } });

    res.status(200).json({
      mensaje: "Cuenta eliminada",
      resultado: null,
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// Obtener cuenta por cliente_id
const obtenerCuentaPorCliente = async (req, res) => {
  try {
    const cliente_id = req.params.cliente_id;

    const cuenta = await Cuenta.findOne({ where: { id_cliente: cliente_id } });

    if (!cuenta) {
      return res.status(404).json({ mensaje: "Cuenta no encontrada", resultado: null });
    }

    res.status(200).json({
      mensaje: "Cuenta encontrada",
      resultado: cuenta
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

module.exports = {
  registrarCuenta,
  listarCuentas,
  obtenerCuenta,
  actualizarCuenta,
  borrarCuenta,
  obtenerCuentaPorCliente
};
