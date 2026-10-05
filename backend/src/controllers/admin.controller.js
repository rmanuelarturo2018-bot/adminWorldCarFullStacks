import { Account, Role } from '../models/index.js';
import bcrypt from 'bcrypt';

// Crear usuario desde el panel admin
export const adminCreateUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ result: 'error', msg: 'Todos los campos son obligatorios (email, password, firstName, lastName)' });
    }

    // Verificar que el email no exista
    const existing = await Account.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ result: 'error', msg: 'El email ya está registrado' });
    }

    const user = await Account.create({ email, password, firstName, lastName });

    return res.status(201).json({
      result: 'success',
      msg: 'Usuario creado correctamente',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActived: user.isActived
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: 'error', msg: 'Error al crear usuario', error: error.message });
  }
};

// Obtener todos los usuarios para la administración
export const adminGetAllUsers = async (req, res) => {
  const { id, isActived } = req.query;
  try {
    const users = await Account.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'isActived', 'name', 'roleId'],
      include: [{
        model: Role,
        attributes: ['id', 'name'],
        required: false
      }],
      where: {
        isActived: true,
        ...(id && { id })
      }
    });

    // Formatear la respuesta para que el frontend tenga el rol plano
    const formatted = users.map(u => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      isActived: u.isActived,
      name: u.name,
      roleId: u.roleId,
      roleName: u.Role ? u.Role.name : null
    }));

    return res.status(200).json({ data: formatted });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: 'error', msg: 'Error al obtener usuarios', error: error.message });
  }
};

// Actualizar usuario (admin)
export const adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, firstName, lastName, email, roleId } = req.body;

    const user = await Account.findByPk(id);
    if (!user) return res.status(404).json({ result: 'error', msg: 'Usuario no encontrado' });

    const updates = {};
    if (typeof email !== 'undefined') updates.email = email;
    if (typeof roleId !== 'undefined') updates.roleId = roleId;
    if (typeof firstName !== 'undefined') updates.firstName = firstName;
    if (typeof lastName !== 'undefined') updates.lastName = lastName;
    if (typeof name !== 'undefined') {
      // dividir el nombre en firstName y lastName (si hay espacio)
      const parts = String(name).trim().split(/\s+/);
      updates.firstName = parts.shift() || '';
      updates.lastName = parts.join(' ') || '';
    }

    await user.update(updates);

    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActived: user.isActived,
      roleId: user.roleId
    };

    return res.status(200).json({ result: 'success', msg: 'Usuario actualizado correctamente (admin)', data: userWithoutPassword });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: 'error', msg: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar usuario (admin) — borrado físico por defecto
export const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Account.findByPk(id);
    if (!user) return res.status(404).json({ result: 'error', msg: 'Usuario no encontrado' });

    // Borrado físico: elimina la fila de la DB
    await user.destroy();
    return res.status(200).json({ result: 'success', msg: 'Usuario eliminado permanentemente' });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({
        result: 'error',
        msg: 'No se puede eliminar: el usuario tiene registros asociados en otras tablas.',
        error: error.message
      });
    }
    return res.status(500).json({ result: 'error', msg: 'Error al eliminar usuario', error: error.message });
  }
};
