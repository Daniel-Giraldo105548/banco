const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // El token viene como: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado', resultado: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mi_secreto'); 
    req.usuario = decoded; // Guardamos los datos del usuario en la request
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado', resultado: null });
  }
};

module.exports = verificarToken;
