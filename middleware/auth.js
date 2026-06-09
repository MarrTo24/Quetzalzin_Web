const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'quetzalzin-cambia-este-secreto-en-produccion';

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticación requerido' });
  }
  try {
    req.user = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { requireAuth, JWT_SECRET };
