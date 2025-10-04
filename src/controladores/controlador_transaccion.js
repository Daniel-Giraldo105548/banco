const Joi = require('joi');
const { Transaccion, Cuenta, Corresponsal, TipoTransaccion } = require('../base_dato/index');

// Validador para Transaccion
const validadorTransaccion = Joi.object({
  tipo: Joi.string().min(2).max(50).required(),
  fecha: Joi.date().required(),
  monto: Joi.number().precision(2).required(),
  id_cuenta_origen: Joi.number().integer().required(),
  id_cuenta_destino: Joi.number().integer().required(),
  id_corresponsal: Joi.number().integer().required(),
  id_tipo_transaccion: Joi.number().integer().required()
});

// POST - Registrar transaccion
const registrarTransaccion = async (req, res) => {
  try {
    const { error } = validadorTransaccion.validate(req.body, { abortEarly: false });
    if (error) {
      const mensajesErrores = error.details.map(d => d.message).join('|');
      return res.status(400).json({ mensaje: 'Errores de validación', resultado: { erroresValidacion: mensajesErrores } });
    }

    const { id_cuenta_origen, id_cuenta_destino, id_corresponsal, id_tipo_transaccion } = req.body;

    // Validar existencia de llaves foráneas
    const cuentaOrigen = await Cuenta.findByPk(id_cuenta_origen);
    if (!cuentaOrigen) return res.status(400).json({ mensaje: 'La cuenta de origen no existe', resultado: null });

    const cuentaDestino = await Cuenta.findByPk(id_cuenta_destino);
    if (!cuentaDestino) return res.status(400).json({ mensaje: 'La cuenta de destino no existe', resultado: null });

    const corresponsal = await Corresponsal.findByPk(id_corresponsal);
    if (!corresponsal) return res.status(400).json({ mensaje: 'El corresponsal no existe', resultado: null });

    const tipoTransaccion = await TipoTransaccion.findByPk(id_tipo_transaccion);
    if (!tipoTransaccion) return res.status(400).json({ mensaje: 'El tipo de transacción no existe', resultado: null });

    // Crear transacción
    const nuevaTransaccion = await Transaccion.create(req.body);

    // Traer la transacción con relaciones
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

// GET - Listar transacciones
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

// PUT - Actualizar transaccion
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

// DELETE - Borrar transaccion
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

// POST - Depositar dinero en una cuenta
const depositarEnCuenta = async (req, res) => {
  try {
    const { id_cuenta_origen, id_cuenta_destino, monto, fecha, id_corresponsal, id_tipo_transaccion } = req.body;

    // Validaciones básicas
    if (!id_cuenta_destino || !monto || monto <= 0) {
      return res.status(400).json({ mensaje: 'Datos inválidos para el depósito', resultado: null });
    }

    // Buscar cuenta destino
    const cuentaDestino = await Cuenta.findByPk(id_cuenta_destino);
    if (!cuentaDestino) {
      return res.status(404).json({ mensaje: 'La cuenta destino no existe', resultado: null });
    }

    // Si la cuenta origen existe (puede ser la misma)
    let cuentaOrigen = null;
    if (id_cuenta_origen) {
      cuentaOrigen = await Cuenta.findByPk(id_cuenta_origen);
      if (!cuentaOrigen) {
        return res.status(404).json({ mensaje: 'La cuenta origen no existe', resultado: null });
      }
    }

    // 💰 Actualizar saldo de la cuenta destino
    cuentaDestino.saldo = parseFloat(cuentaDestino.saldo) + parseFloat(monto);
    await cuentaDestino.save();

    // Registrar la transacción
    const nuevaTransaccion = await Transaccion.create({
      tipo: 'Depósito',
      fecha,
      monto,
      id_cuenta_origen: id_cuenta_origen || id_cuenta_destino, // puede ser la misma
      id_cuenta_destino,
      id_corresponsal,
      id_tipo_transaccion
    });

    // Traer la transacción con relaciones
    const transaccionConRelaciones = await Transaccion.findByPk(nuevaTransaccion.id_transaccion, {
      include: [
        { model: Cuenta, as: 'cuentaOrigen' },
        { model: Cuenta, as: 'cuentaDestino' },
        { model: Corresponsal, as: 'corresponsal' },
        { model: TipoTransaccion, as: 'tipoTransaccion' }
      ]
    });

    res.status(201).json({
      mensaje: 'Depósito realizado correctamente',
      resultado: {
        transaccion: transaccionConRelaciones,
        nuevo_saldo: cuentaDestino.saldo
      }
    });

  } catch (error) {
    console.error('Error al realizar el depósito:', error);
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

 // POST - Retirar dinero desde el cliente
const retirarDeCuenta = async (req, res) => {
  try {
    console.log("cuerpo recibido:", req.body);

    const { id_cliente, monto } = req.body;

    if (!id_cliente || !monto || monto <= 0) {
      return res.status(400).json({ mensaje: 'Datos inválidos para el retiro', resultado: null });
    }

    // Buscar cuenta del cliente
    const cuenta = await Cuenta.findOne({ where: { id_cliente } });

    if (!cuenta) {
      return res.status(404).json({ mensaje: 'No se encontró una cuenta asociada al cliente', resultado: null });
    }

    // Verificar saldo suficiente
    if (parseFloat(cuenta.saldo) < parseFloat(monto)) {
      return res.status(400).json({ mensaje: 'Saldo insuficiente', resultado: null });
    }

    // Restar monto
    cuenta.saldo = parseFloat(cuenta.saldo) - parseFloat(monto);
    await cuenta.save();

    // Registrar la transacción
    const nuevaTransaccion = await Transaccion.create({
      tipo: 'Retiro',
      fecha: new Date(),
      monto,
      id_cuenta_origen: cuenta.id_cuenta,
      id_cuenta_destino: cuenta.id_cuenta, // retiro propio
      id_corresponsal: 2, // fijo o puedes ajustarlo
      id_tipo_transaccion: 3 // id del tipo “retiro” en tu base
    });

    res.status(201).json({
      mensaje: 'Retiro realizado correctamente',
      resultado: {
        transaccion: nuevaTransaccion,
        nuevo_saldo: cuenta.saldo
      }
    });

  } catch (error) {
    console.error('Error al realizar el retiro:', error);
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

module.exports = {
  registrarTransaccion,
  listarTransacciones,
  actualizarTransaccion,
  borrarTransaccion,
  depositarEnCuenta,
  retirarDeCuenta
};
