import { validatetoken } from '../token.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.status(401).json({ result: 'error', msg: 'Authorization header missing' });

    const parts = String(authHeader).split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ result: 'error', msg: 'Authorization header malformed' });
    }

    const token = parts[1];
    const payload = validatetoken(token);
    if (!payload) return res.status(401).json({ result: 'error', msg: 'Invalid or expired token' });

    // payload shape: { name, iduser, email, role }
    req.user = {
      id: payload.iduser,
      email: payload.email,
      name: payload.name,
      role: payload.role || null
    };

    return next();
  } catch (error) {
    console.error('authenticate middleware error', error);
    return res.status(500).json({ result: 'error', msg: 'Authentication error' });
  }
};

export const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ result: 'error', msg: 'Not authenticated' });
    const role = typeof req.user.role === 'string' ? req.user.role.trim().toLowerCase() : '';
    if (!role || (!role.includes('admin') && role !== 'administrador')) {
      return res.status(401).json({ result: 'error', msg: 'No autorizado' });
    }
    return next();
  } catch (error) {
    console.error('requireAdmin middleware error', error);
    return res.status(500).json({ result: 'error', msg: 'Authorization error' });
  }
};

/**
 * Middleware que acepta múltiples roles.
 * Uso: requireRole('admin', 'inventario') o requireRole(['admin', 'inventario'])
 */
export function requireRole(...allowedRoles) {
  const flat = allowedRoles.flat().map(r => r.trim().toLowerCase());
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ result: 'error', msg: 'Not authenticated' });
      const role = typeof req.user.role === 'string' ? req.user.role.trim().toLowerCase() : '';
      if (!role || !flat.some(r => role.includes(r) || role === r)) {
        return res.status(401).json({ result: 'error', msg: 'No autorizado' });
      }
      return next();
    } catch (error) {
      console.error('requireRole middleware error', error);
      return res.status(500).json({ result: 'error', msg: 'Authorization error' });
    }
  };
}
