import { ProductType } from '../models/index.js';

// Obtener todas las categorías (productTypes)
export const getAllProductTypes = async (req, res) => {
  try {
    const types = await ProductType.findAll({
      attributes: ['id', 'name', 'description'],
    });
    return res.status(200).json({ result: 'success', data: types });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: 'error', msg: 'Error al obtener categorías', error: error.message });
  }
};

// Crear una categoría
export const createProductType = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ result: 'error', msg: 'Nombre y descripción son obligatorios' });
    }
    const existing = await ProductType.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ result: 'error', msg: 'Ya existe una categoría con ese nombre' });
    }
    const type = await ProductType.create({ name, description });
    return res.status(201).json({ result: 'success', msg: 'Categoría creada correctamente', data: type });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: 'error', msg: 'Error al crear categoría', error: error.message });
  }
};

// Actualizar una categoría
export const updateProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const type = await ProductType.findByPk(id);
    if (!type) return res.status(404).json({ result: 'error', msg: 'Categoría no encontrada' });
    if (typeof name !== 'undefined') type.name = name;
    if (typeof description !== 'undefined') type.description = description;
    await type.save();
    return res.status(200).json({ result: 'success', msg: 'Categoría actualizada correctamente', data: type });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: 'error', msg: 'Error al actualizar categoría', error: error.message });
  }
};

// Eliminar una categoría
export const deleteProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const type = await ProductType.findByPk(id);
    if (!type) return res.status(404).json({ result: 'error', msg: 'Categoría no encontrada' });
    await type.destroy();
    return res.status(200).json({ result: 'success', msg: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ result: 'error', msg: 'No se puede eliminar: hay productos asociados a esta categoría.' });
    }
    return res.status(500).json({ result: 'error', msg: 'Error al eliminar categoría', error: error.message });
  }
};
