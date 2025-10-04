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

    // Actualizar saldo de la cuenta destino
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

const { Usuario, Cuenta } = require('../base_dato/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const iniciarSesion = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('cuerpo recibido:', req.body);

    const usuario = await Usuario.findOne({
      where: { username },
      include: [{ model: Cuenta, as: 'cuentas' }]
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado', resultado: null });
    }

    const validarPassword = await bcrypt.compare(password, usuario.password_hash);
    if (!validarPassword) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta', resultado: null });
    }

    const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Obtén la primera cuenta asociada al cliente
    const cuenta = usuario.cuentas && usuario.cuentas[0] ? usuario.cuentas[0] : null;

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      resultado: {
        token,
        usuario: {
          id_usuario: usuario.id_usuario,
          username: usuario.username,
          rol: usuario.rol,
          id_cliente: usuario.id_cliente,
          id_cuenta: cuenta ? cuenta.id_cuenta : null 
        }
      }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
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
