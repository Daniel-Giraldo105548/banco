const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Transaccion, Cuenta, Corresponsal, TipoTransaccion, Usuario } = require('../base_dato/index');

// =======================
// Validación de transacción
// =======================
const validadorTransaccion = Joi.object({
  tipo: Joi.string().min(2).max(50).required(),
  fecha: Joi.date().required(),
  monto: Joi.number().precision(2).required(),
  id_cuenta_origen: Joi.number().integer().required(),
  id_cuenta_destino: Joi.number().integer().required(),
  id_corresponsal: Joi.number().integer().required(),
  id_tipo_transaccion: Joi.number().integer().required()
});

// =======================
// POST - Registrar transacción
// =======================
const registrarTransaccion = async (req, res) => {
  try {
    const { error } = validadorTransaccion.validate(req.body, { abortEarly: false });
    if (error) {
      const mensajesErrores = error.details.map(d => d.message).join('|');
      return res.status(400).json({ mensaje: 'Errores de validación', resultado: { erroresValidacion: mensajesErrores } });
    }

    const { id_cuenta_origen, id_cuenta_destino, id_corresponsal, id_tipo_transaccion } = req.body;

    const cuentaOrigen = await Cuenta.findByPk(id_cuenta_origen);
    const cuentaDestino = await Cuenta.findByPk(id_cuenta_destino);
    const corresponsal = await Corresponsal.findByPk(id_corresponsal);
    const tipoTransaccion = await TipoTransaccion.findByPk(id_tipo_transaccion);

    if (!cuentaOrigen) return res.status(400).json({ mensaje: 'La cuenta de origen no existe', resultado: null });
    if (!cuentaDestino) return res.status(400).json({ mensaje: 'La cuenta de destino no existe', resultado: null });
    if (!corresponsal) return res.status(400).json({ mensaje: 'El corresponsal no existe', resultado: null });
    if (!tipoTransaccion) return res.status(400).json({ mensaje: 'El tipo de transacción no existe', resultado: null });

    const nuevaTransaccion = await Transaccion.create(req.body);

    const transaccionConRelaciones = await Transaccion.findByPk(nuevaTransaccion.id_transaccion, {
      include: [
        { model: Cuenta, as: 'cuentaOrigen' },
        { model: Cuenta, as: 'cuentaDestino' },
        { model: Corresponsal, as: 'corresponsal' },
        { model: TipoTransaccion, as: 'tipoTransaccion' }
      ]
    });

    res.status(201).json({ mensaje: 'Transacción creada', resultado: transaccionConRelaciones });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// =======================
// GET - Listar transacciones
// =======================
const listarTransacciones = async (req, res) => {
  try {
    const transacciones = await Transaccion.findAll({
      include: [
        { model: Cuenta, as: 'cuentaOrigen' },
        { model: Cuenta, as: 'cuentaDestino' },
        { model: Corresponsal, as: 'corresponsal' },
        { model: TipoTransaccion, as: 'tipoTransaccion' }
      ]
    });

    res.status(200).json({ mensaje: 'Transacciones listadas', resultado: transacciones });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// =======================
// PUT - Actualizar transacción
// =======================
const actualizarTransaccion = async (req, res) => {
  try {
    const { id_transaccion } = req.params;
    const { error } = validadorTransaccion.validate(req.body, { abortEarly: false });
    if (error) {
      const mensajesErrores = error.details.map(d => d.message).join('|');
      return res.status(400).json({ mensaje: 'Errores de validación', resultado: { erroresValidacion: mensajesErrores } });
    }

    const transaccion = await Transaccion.findByPk(id_transaccion);
    if (!transaccion) return res.status(404).json({ mensaje: 'Transacción no encontrada', resultado: null });

    await Transaccion.update(req.body, { where: { id_transaccion } });

    const transaccionActualizada = await Transaccion.findByPk(id_transaccion, {
      include: [
        { model: Cuenta, as: 'cuentaOrigen' },
        { model: Cuenta, as: 'cuentaDestino' },
        { model: Corresponsal, as: 'corresponsal' },
        { model: TipoTransaccion, as: 'tipoTransaccion' }
      ]
    });

    res.status(200).json({ mensaje: 'Transacción actualizada', resultado: transaccionActualizada });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// =======================
// DELETE - Borrar transacción
// =======================
const borrarTransaccion = async (req, res) => {
  try {
    const { id_transaccion } = req.params;
    const transaccion = await Transaccion.findByPk(id_transaccion);
    if (!transaccion) return res.status(404).json({ mensaje: 'Transacción no encontrada', resultado: null });

    await Transaccion.destroy({ where: { id_transaccion } });
    res.status(200).json({ mensaje: 'Transacción eliminada', resultado: null });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// =======================
// POST - Depositar dinero
// =======================
const depositarEnCuenta = async (req, res) => {
  try {
    const { id_cuenta_destino, monto, fecha, id_corresponsal, id_tipo_transaccion } = req.body;

    if (!id_cuenta_destino || !monto || monto <= 0) {
      return res.status(400).json({ mensaje: 'Datos inválidos para el depósito', resultado: null });
    }

    const cuentaDestino = await Cuenta.findByPk(id_cuenta_destino);
    if (!cuentaDestino) return res.status(404).json({ mensaje: 'La cuenta destino no existe', resultado: null });

    cuentaDestino.saldo = parseFloat(cuentaDestino.saldo) + parseFloat(monto);
    await cuentaDestino.save();

    const nuevaTransaccion = await Transaccion.create({
      tipo: 'Depósito',
      fecha,
      monto,
      id_cuenta_origen: id_cuenta_destino,
      id_cuenta_destino,
      id_corresponsal,
      id_tipo_transaccion
    });

    const transaccionConRelaciones = await Transaccion.findByPk(nuevaTransaccion.id_transaccion, {
      include: [
        { model: Cuenta, as: 'cuentaDestino' },
        { model: Corresponsal, as: 'corresponsal' },
        { model: TipoTransaccion, as: 'tipoTransaccion' }
      ]
    });

    res.status(201).json({
      mensaje: 'Depósito realizado correctamente',
      resultado: { transaccion: transaccionConRelaciones, nuevo_saldo: cuentaDestino.saldo }
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// =======================
// POST - Retirar dinero
// =======================
const retirarDeCuenta = async (req, res) => {
  try {
    const { id_cuenta_origen, monto, fecha, id_corresponsal, id_tipo_transaccion } = req.body;

    if (!id_cuenta_origen || !monto || monto <= 0) {
      return res.status(400).json({ mensaje: 'Datos inválidos para el retiro', resultado: null });
    }

    const cuentaOrigen = await Cuenta.findByPk(id_cuenta_origen);
    if (!cuentaOrigen) return res.status(404).json({ mensaje: 'La cuenta origen no existe', resultado: null });

    if (parseFloat(cuentaOrigen.saldo) < parseFloat(monto)) {
      return res.status(400).json({ mensaje: 'Saldo insuficiente', resultado: null });
    }

    cuentaOrigen.saldo = parseFloat(cuentaOrigen.saldo) - parseFloat(monto);
    await cuentaOrigen.save();

    const nuevaTransaccion = await Transaccion.create({
      tipo: 'Retiro',
      fecha,
      monto,
      id_cuenta_origen,
      id_cuenta_destino: id_cuenta_origen,
      id_corresponsal,
      id_tipo_transaccion
    });

    const transaccionConRelaciones = await Transaccion.findByPk(nuevaTransaccion.id_transaccion, {
      include: [
        { model: Cuenta, as: 'cuentaOrigen' },
        { model: Corresponsal, as: 'corresponsal' },
        { model: TipoTransaccion, as: 'tipoTransaccion' }
      ]
    });

    res.status(201).json({
      mensaje: 'Retiro realizado correctamente',
      resultado: { transaccion: transaccionConRelaciones, nuevo_saldo: cuentaOrigen.saldo }
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};


module.exports = {
  registrarTransaccion,
  listarTransacciones,
  actualizarTransaccion,
  borrarTransaccion,
  depositarEnCuenta,
  retirarDeCuenta,
};
