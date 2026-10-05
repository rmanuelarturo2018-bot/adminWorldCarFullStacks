import { Role } from '../models/index.js';

// Obtener todos los roles
export const getAllRoles = async (req, res) => {
    try {

        const roles = await Role.findAll();
        return res.status(200).json({ result: 'success', data: roles });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: 'error', msg: 'Error al obtener roles', error: error.message });
    }
};

// Crear un rol
export const createRole = async (req, res) => {
    try {

        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ result: 'error', msg: 'El nombre del rol es obligatorio' });
        }

        const existing = await Role.findOne({ where: { name } });
        if (existing) {
            return res.status(409).json({ result: 'error', msg: 'Ya existe un rol con ese nombre' });
        }

        const role = await Role.create({ name, description });
        return res.status(201).json({ result: 'success', msg: 'Rol creado correctamente', data: role });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: 'error', msg: 'Error al crear rol', error: error.message });
    }
};

// Actualizar un rol
export const updateRole = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, description, isActive } = req.body;

        const role = await Role.findByPk(id);
        if (!role) return res.status(404).json({ result: 'error', msg: 'Rol no encontrado' });

        if (typeof name !== 'undefined') role.name = name;
        if (typeof description !== 'undefined') role.description = description;
        if (typeof isActive !== 'undefined') role.isActive = isActive;
        await role.save();

        return res.status(200).json({ result: 'success', msg: 'Rol actualizado correctamente', data: role });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: 'error', msg: 'Error al actualizar rol', error: error.message });
    }
};

// Eliminar un rol
export const deleteRole = async (req, res) => {
    try {

        const { id } = req.params;
        const role = await Role.findByPk(id);
        if (!role) return res.status(404).json({ result: 'error', msg: 'Rol no encontrado' });

        await role.destroy();
        return res.status(200).json({ result: 'success', msg: 'Rol eliminado correctamente' });
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ result: 'error', msg: 'No se puede eliminar: hay usuarios con este rol.' });
        }
        return res.status(500).json({ result: 'error', msg: 'Error al eliminar rol', error: error.message });
    }
};
