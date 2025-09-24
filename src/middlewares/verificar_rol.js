const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    const usuario = req.usuario; // Este usuario lo pones en req después del login

    if (!usuario) {
      return res.status(401).json({ mensaje: 'No autenticado', resultado: null });
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ mensaje: 'Acceso denegado: rol no autorizado', resultado: null });
    }

    next();
  };
};

module.exports = verificarRol;