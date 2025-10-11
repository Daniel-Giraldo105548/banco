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

    // 🔹 Verificar si el cliente existe
    const cliente = await Cliente.findByPk(id_cliente);
    if (!cliente) {
      return res.status(404).json({
        mensaje: "El cliente no existe",
        resultado: null,
      });
    }

    // 🔹 Verificar si el cliente ya tiene una cuenta
    const cuentaExistente = await Cuenta.findOne({ where: { id_cliente } });
    if (cuentaExistente) {
      return res.status(400).json({
        mensaje: "El cliente ya tiene una cuenta registrada",
        resultado: cuentaExistente.get({ plain: true }),
      });
    }

    // 🔹 Crear nueva cuenta
    const nuevaCuenta = await Cuenta.create({
      numero_cuenta,
      estado,
      saldo,
      fecha_apertura,
      tipo_cuenta,
      id_cliente,
    });

    return res.status(201).json({
      mensaje: "Cuenta creada correctamente",
      resultado: nuevaCuenta.get({ plain: true }),
    });
  } catch (err) {
    console.error("Error al registrar cuenta:", err);
    return res.status(500).json({ mensaje: err.message, resultado: null });
  }
};


// ============================
// GET - Listar cuentas
// ============================
const listarCuentas = async (req, res) => {
  try {
    const cuentas = await Cuenta.findAll({ include: Cliente });
    return res.status(200).json({
      mensaje: "Cuentas listadas",
      resultado: cuentas.map(c => c.get({ plain: true })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: err.message, resultado: null });
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

    return res.status(200).json({
      mensaje: "Cuenta encontrada",
      resultado: cuenta.get({ plain: true }),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: err.message, resultado: null });
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

    return res.status(200).json({
      mensaje: "Cuenta actualizada",
      resultado: cuentaActualizada.get({ plain: true }),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: err.message, resultado: null });
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

    return res.status(200).json({
      mensaje: "Cuenta eliminada",
      resultado: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: err.message, resultado: null });
  }
};

// ============================
// GET - Consultar saldo
// ============================
const consultarSaldo = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    console.log("ID Cliente recibido:", id_cliente);

    const cuenta = await Cuenta.findOne({
      where: { id_cliente },
      attributes: ["id_cuenta", "numero_cuenta", "saldo", "estado", "tipo_cuenta"]
    });

    if (!cuenta) {
      return res.status(404).json({
        mensaje: "No se encontró ninguna cuenta para este cliente",
        resultado: null
      });
    }

    const cuentaPlano = cuenta.get({ plain: true });
    cuentaPlano.saldo = parseFloat(cuentaPlano.saldo); // Asegurarse de que saldo sea número

    return res.status(200).json({
      mensaje: "Cuenta encontrada",
      resultado: cuentaPlano
    });

  } catch (error) {
    console.error("Error al consultar saldo:", error);
    if (!res.headersSent) {
      return res.status(500).json({ mensaje: "Error al consultar saldo", resultado: null });
    }
  }
};

// ============================
// POST - Depositar dinero
// ============================
const depositar = async (req, res) => {
  try {
    const { id_cliente, monto } = req.body;

    if (!id_cliente || !monto || monto <= 0) {
      return res.status(400).json({
        mensaje: "El id_cliente y un monto válido son obligatorios",
        resultado: null,
      });
    }

    const cuenta = await Cuenta.findOne({ where: { id_cliente } });

    if (!cuenta) {
      return res.status(404).json({
        mensaje: "Cuenta no encontrada para este cliente",
        resultado: null,
      });
    }

    cuenta.saldo += monto;
    await cuenta.save();

    return res.status(200).json({
      mensaje: "Depósito realizado",
      resultado: { saldo: parseFloat(cuenta.saldo) }
    });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      return res.status(500).json({ mensaje: err.message, resultado: null });
    }
  }
};

// ============================
// POST - Retirar dinero
// ============================
const retirar = async (req, res) => {
  try {
    const { id_cliente, monto } = req.body;

    if (!id_cliente || !monto || monto <= 0) {
      return res.status(400).json({
        mensaje: "El id_cliente y un monto válido son obligatorios",
        resultado: null,
      });
    }

    const cuenta = await Cuenta.findOne({ where: { id_cliente } });

    if (!cuenta) {
      return res.status(404).json({
        mensaje: "Cuenta no encontrada para este cliente",
        resultado: null,
      });
    }

    if (cuenta.saldo < monto) {
      return res.status(400).json({
        mensaje: "Saldo insuficiente",
        resultado: { saldo: parseFloat(cuenta.saldo) }
      });
    }

    cuenta.saldo -= monto;
    await cuenta.save();

    return res.status(200).json({
      mensaje: "Retiro realizado",
      resultado: { saldo: parseFloat(cuenta.saldo) }
    });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      return res.status(500).json({ mensaje: err.message, resultado: null });
    }
  }
};

module.exports = {
  registrarCuenta,
  listarCuentas,
  obtenerCuenta,
  actualizarCuenta,
  borrarCuenta,
  consultarSaldo,
  depositar,
  retirar
};
