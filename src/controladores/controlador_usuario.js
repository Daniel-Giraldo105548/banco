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
  cliente_id: Joi.number().integer().optional()
});

// ============================
// POST - Registrar usuario
// ============================
const registrarUsuario = async (req, res) => {
  try {
    const { error } = validadorUsuario.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        mensaje: 'Errores en la validación',
        resultado: error.details.map(d => d.message)
      });
    }

    const { username, password, rol, cliente_id } = req.body;

    // Verificar si ya existe el usuario
    const usuarioExistente = await Usuario.findOne({ where: { username } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El usuario ya existe', resultado: null });
    }

    // Si se proporcionó cliente_id, validar que exista
    if (cliente_id) {
      const cliente = await Cliente.findByPk(cliente_id);
      if (!cliente) {
        return res.status(404).json({ mensaje: 'El cliente asociado no existe', resultado: null });
      }
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con rol por defecto CLIENTE si no viene
    const nuevoUsuario = await Usuario.create({
      username,
      password_hash: hashedPassword,
      rol: rol || 'CLIENTE', // asignar CLIENTE por defecto
      cliente_id,
    });

    res.status(201).json({ mensaje: 'Usuario creado', resultado: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// ============================
// GET - Listar usuarios
// ============================
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ include: Cliente });
    res.status(200).json({ mensaje: 'Usuarios listados', resultado: usuarios });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// ============================
// PUT - Actualizar usuario
// ============================
const actualizarUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { username, password, rol, cliente_id } = req.body;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado', resultado: null });
    }

    let hashedPassword = usuario.password_hash;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await Usuario.update(
      { username, password_hash: hashedPassword, rol, cliente_id },
      { where: { id_usuario } }
    );

    const usuarioActualizado = await Usuario.findByPk(id_usuario, { include: Cliente });

    res.status(200).json({ mensaje: 'Usuario actualizado', resultado: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
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
      return res.status(404).json({ mensaje: 'Usuario no encontrado', resultado: null });
    }

    await Usuario.destroy({ where: { id_usuario } });
    res.status(200).json({ mensaje: 'Usuario eliminado', resultado: null });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// ============================
// POST - Login usuario
// ============================
const jwt = require('jsonwebtoken');

// POST - Login usuario con JWT
const loginUsuario = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario en la BD
    const usuarioSequelize = await Usuario.findOne({ where: { username } });
    if (!usuarioSequelize) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado', resultado: null });
    }

    // Convertir a objeto plano para acceder a todas las propiedades
    const usuario = usuarioSequelize.get({ plain: true });

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, usuario.password_hash);
    if (!isMatch) {
      return res.status(401).json({ mensaje: 'Clave incorrecta', resultado: null });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol }, // payload
      process.env.JWT_SECRET,                       // clave secreta
      { expiresIn: '1h' }                           // duración del token
    );

    // Respuesta con token y datos del usuario
    res.status(200).json({
      mensaje: 'Login exitoso',
      resultado: {
        token,
        usuario: {
          id_usuario: usuario.id_usuario,
          username: usuario.username,
          rol: usuario.rol,
          cliente_id: usuario.cliente_id // <-- ahora siempre se envía
        }
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};


// ============================
// PUT - Asignar rol (solo ADMIN_DB)
// ============================
const asignarRol = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { rol } = req.body;

    // validar rol permitido
    const rolesPermitidos = ['CLIENTE', 'ADMIN_DB', 'BACKOFFICE', 'ADMIN', 'ASESOR', 'AUDITOR'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ mensaje: 'Rol no válido', resultado: null });
    }

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado', resultado: null });
    }

    usuario.rol = rol;
    await usuario.save();

    res.status(200).json({ mensaje: 'Rol asignado con éxito', resultado: usuario });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

module.exports = {
  registrarUsuario,
  listarUsuarios,
  actualizarUsuario,
  borrarUsuario,
  loginUsuario, 
  asignarRol
};
