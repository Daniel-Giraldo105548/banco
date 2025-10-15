const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Usuario, Cliente } = require('../base_dato/index');

// ============================
// Validador para usuario
// ============================
const validadorUsuario = Joi.object({
  username: Joi.string().min(4).max(50).required(),
  password: Joi.string().min(6).max(100).required(),
  rol: Joi.string()
    .valid('CLIENTE', 'ADMIN_DB', 'BACKOFFICE', 'ASESOR', 'AUDITOR', 'ADMIN')
    .optional(),
  estado: Joi.string().optional(),
  id_cliente: Joi.number().integer().optional(),
  cliente_id: Joi.number().integer().optional()
});

// ============================
// POST - Registrar usuario
// ============================
const registrarUsuario = async (req, res) => {
  try {
    const { username, password, rol, id_cliente, cliente_id } = req.body;

    // 1️⃣ Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { username } });
    if (usuarioExistente) {
      return res.status(400).json({
        mensaje: 'El usuario ya existe',
        resultado: null
      });
    }

    // ✅ Tomamos el ID del cliente si existe
    const clienteIdFinal = id_cliente || cliente_id;

    // ⚙️ 2️⃣ Solo verificar cliente si el rol es CLIENTE
    if ((rol === 'CLIENTE' || !rol) && !clienteIdFinal) {
      return res.status(400).json({
        mensaje: 'Debe asociar un cliente para el rol CLIENTE',
        resultado: null
      });
    }

    if (rol === 'CLIENTE') {
      const clienteExistente = await Cliente.findByPk(clienteIdFinal);
      if (!clienteExistente) {
        return res.status(400).json({
          mensaje: 'El cliente no existe',
          resultado: null
        });
      }
    }

    // 3️⃣ Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Crear usuario
    const nuevoUsuario = await Usuario.create({
      username,
      password_hash: hashedPassword,
      rol: rol || 'CLIENTE',
      estado: 'ACTIVO',
      id_cliente: clienteIdFinal || null
    });

    res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      resultado: nuevoUsuario
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

// ============================
// GET - Listar usuarios
// ============================
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ include: Cliente });
    res.status(200).json({
      mensaje: 'Usuarios listados correctamente',
      resultado: usuarios
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

// ============================
// PUT - Actualizar usuario
// ============================
const actualizarUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { username, password, rol, id_cliente, cliente_id } = req.body;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado',
        resultado: null
      });
    }

    const clienteIdFinal = id_cliente || cliente_id;

    let hashedPassword = usuario.password_hash;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await Usuario.update(
      {
        username,
        password_hash: hashedPassword,
        rol,
        id_cliente: clienteIdFinal
      },
      { where: { id_usuario } }
    );

    const usuarioActualizado = await Usuario.findByPk(id_usuario, {
      include: Cliente
    });

    res.status(200).json({
      mensaje: 'Usuario actualizado correctamente',
      resultado: usuarioActualizado
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

// ============================
// DELETE - Borrar usuario
// ============================
const borrarUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado',
        resultado: null
      });
    }

    await Usuario.destroy({ where: { id_usuario } });
    res.status(200).json({
      mensaje: 'Usuario eliminado correctamente',
      resultado: null
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

// ============================
// PUT - Asignar rol (solo ADMIN_DB o ADMIN)
// ============================
const asignarRol = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { rol } = req.body;

    const rolesPermitidos = [
      'CLIENTE',
      'ADMIN_DB',
      'BACKOFFICE',
      'ADMIN',
      'ASESOR',
      'AUDITOR'
    ];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({
        mensaje: 'Rol no válido',
        resultado: null
      });
    }

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado',
        resultado: null
      });
    }

    usuario.rol = rol;
    await usuario.save();

    res.status(200).json({
      mensaje: 'Rol asignado con éxito',
      resultado: usuario
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

module.exports = {
  registrarUsuario,
  listarUsuarios,
  actualizarUsuario,
  borrarUsuario,
  asignarRol
};
