import { Products, Brand, ProductType } from '../models/index.js';

// Obtener todos los productos con marca y categoría
export const getAllProducts = async (req, res) => {
  try {
    const products = await Products.findAll({
      attributes: ['id', 'name', 'price', 'brandId', 'typeId'],
      include: [
        { model: Brand, attributes: ['id', 'name'] },
        { model: ProductType, attributes: ['id', 'name'] },
      ],
    });
    const formatted = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      brandId: p.brandId,
      brandName: p.Brand ? p.Brand.name : null,
      typeId: p.typeId,
      typeName: p.ProductType ? p.ProductType.name : null,
    }));
    return res.status(200).json({ result: 'success', data: formatted });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: 'error', msg: 'Error al obtener productos', error: error.message });
  }
};

// Crear un producto
export const createProduct = async (req, res) => {
  try {
    const { name, price, brandId, typeId } = req.body;
    if (!name || price === undefined || !brandId || !typeId) {
      return res.status(400).json({ result: 'error', msg: 'Todos los campos son obligatorios (name, price, brandId, typeId)' });
    }
    const product = await Products.create({ name, price, brandId, typeId });
    return res.status(201).json({ result: 'success', msg: 'Producto creado correctamente', data: product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: 'error', msg: 'Error al crear producto', error: error.message });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, brandId, typeId } = req.body;
    const product = await Products.findByPk(id);
    if (!product) return res.status(404).json({ result: 'error', msg: 'Producto no encontrado' });
    if (typeof name !== 'undefined') product.name = name;
    if (typeof price !== 'undefined') product.price = price;
    if (typeof brandId !== 'undefined') product.brandId = brandId;
    if (typeof typeId !== 'undefined') product.typeId = typeId;
    await product.save();
    return res.status(200).json({ result: 'success', msg: 'Producto actualizado correctamente', data: product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: 'error', msg: 'Error al actualizar producto', error: error.message });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);
    if (!product) return res.status(404).json({ result: 'error', msg: 'Producto no encontrado' });
    await product.destroy();
    return res.status(200).json({ result: 'success', msg: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: 'error', msg: 'Error al eliminar producto', error: error.message });
  }
};
