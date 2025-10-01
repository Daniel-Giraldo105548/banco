const Joi = require("joi");
const { Cuenta, Cliente } = require("../base_dato/index");

// ============================
// Validador con Joi (ya no incluye numero_cuenta, estado, fecha_apertura)
// ============================
const validadorCuenta = Joi.object({
  saldo: Joi.number().precision(2).required().messages({
    "number.base": "El saldo debe ser un número.",
    "any.required": "El saldo es obligatorio.",
  }),
  tipo_cuenta: Joi.string().valid("Ahorros", "Corriente").required().messages({
    "string.base": "El tipo de cuenta debe ser un texto.",
    "any.required": "El tipo de cuenta es obligatorio.",
    "any.only": "El tipo de cuenta debe ser Ahorros o Corriente."
  }),
  id_cliente: Joi.number().integer().required().messages({
    "number.base": "El id_cliente debe ser un número entero.",
    "any.required": "El id_cliente es obligatorio.",
  }),
});

// ============================
// Función para generar número aleatorio de 7 dígitos
// ============================
function generarNumeroCuenta() {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
}

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

    const { saldo, tipo_cuenta, id_cliente } = req.body;

    // Validar cliente
    const cliente = await Cliente.findByPk(id_cliente);
    if (!cliente) {
      return res.status(404).json({
        mensaje: "El cliente no existe",
        resultado: null,
      });
    }

    // Generar número único de cuenta
    let numeroCuenta;
    let cuentaExistente;
    do {
      numeroCuenta = generarNumeroCuenta();
      cuentaExistente = await Cuenta.findOne({ where: { numero_cuenta: numeroCuenta } });
    } while (cuentaExistente);

    // Crear cuenta
    const nuevaCuenta = await Cuenta.create({
      numero_cuenta: numeroCuenta,
      saldo,
      tipo_cuenta,
      id_cliente,
      estado: true, // siempre activa
      fecha_apertura: new Date() // automática
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

module.exports = {
  registrarCuenta,
  listarCuentas,
};
