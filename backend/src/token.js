import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Leer la clave desde la variable de entorno
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  if (process.env.NODE_ENV === 'production') {
    // Fail fast en producción
    throw new Error('JWT_SECRET must be defined in production environment');
  } else {
    // Sólo usar fallback inseguro en desarrollo con warning
    console.warn('Warning: JWT_SECRET not defined. Using insecure fallback for development only.');
  }
}
const SECRET_KEY = SECRET || 'change_this_secret_in_development';

/**
 * Genera un JWT.
 * @param {string|number} expiracion - Tiempo de expiración aceptado por jsonwebtoken (ej: '1h', '30m', 3600)
 * @param {Array} payload - Arreglo posicional [name, iduser, email]
 * @returns {string} token firmado
 */
export function genToken(expiracion, payload) {
  if (!Array.isArray(payload) || payload.length < 3) {
    throw new TypeError('payload debe ser un arreglo [name, iduser, email, role?]');
  }
  const [name, iduser, email, role] = payload;
  const tokenPayload = { name, iduser, email, role: role || null };
  const options = {};
  if (expiracion) options.expiresIn = expiracion;
  return jwt.sign(tokenPayload, SECRET_KEY, options);
}

// Alias con nombre solicitado 'gentoken' (minúsculas) para compatibilidad con diferentes estilos
export const gentoken = (expiracion, payload) => genToken(expiracion, payload);

/**
 * Verifica un JWT y devuelve el payload decodificado si es válido.
 * @param {string} token - Token JWT a verificar
 * @returns {Object|null} payload decodificado o null si el token no es válido
 */
export function validateToken(token) {
  try {
    if (!token || typeof token !== 'string') {
      console.warn('validateToken: token no válido');
      return null;
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    console.warn('validateToken: token inválido o expirado -', err.message);
    return null;
  }
}

// Alias en minúsculas
export const validatetoken = (token) => validateToken(token);
