import { Brand } from '../models/index.js';

export const getAllBrands = async (req, res) => {
    const { id } = req.query;
    try {
        const brands = await Brand.findAll({
            attributes: ['id', 'name'],
            where: id ? { id } : undefined, 
        });
        res.status(200).json({
            result: "success",
            msg: 'Marcas obtenidas correctamente',
            data: brands
        });
    } catch (error) {
        res.status(400).json({
            result: "error",
            msg: 'Error al obtener las marcas'
        });
    }
}

export const updateBrand = async (req, res) => {
    // 1. Aquí obtienes el ID de la URL (ej: /brands/5)
    const { id } = req.params;
    
    // CORRECCIÓN: Eliminamos ', id' de req.body para evitar el SyntaxError
    const { nameBrand } = req.body;
    
    try {
        // Validar que la marca exista usando el id de req.params
        const brand = await Brand.findByPk(id);
        if (!brand) {
            return res.status(404).json({
                result: "error",
                msg: 'Marca no encontrada'
            });
        }
        // Actualizar la marca
        brand.name = nameBrand;
        await brand.save();
        res.status(200).json({
            result: "success",
            msg: 'Marca actualizada correctamente'
        });
    } catch(error) {
        console.error(error);
        res.status(400).json({
            result: "error",
            msg: 'Error al actualizar la marca'
        });
    }
}

//controller para crear una marca 
export const createBrand = async (req, res) => {
    const { nameBrand } = req.body;
    //validar que el nombre de la marca no esté vacío
    if (!nameBrand || nameBrand.trim() === '') {
        return res.status(400).json({       
            result: "error",    
           msg: 'El nombre de la marca no puede estar vacío'
        });
    }
    //validar que la marca exista en la base de datos
    try {
        const existingBrand = await Brand.findAndCountAll({ where: { name: nameBrand } });
        if (existingBrand.count > 0) {
            return res.status(400).json({
                result: "error",
                msg: 'La marca ya existe'
                
            });
            console.log('La marca ya existe');
        }
        //crear la marca
        const newBrand = await Brand.create({ name: nameBrand });
        res.status(201).json({
            result: "success",
            msg: 'Marca creada correctamente',
            data: newBrand
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            result: "error",
            msg: 'Error al crear la marca'
        });
    }
}

//findAndCountAll
export const getBrandsWithCount = async (req, res) => {
    try {
        const brands = await Brand.findAndCountAll({
            attributes: ['id', 'name'],
        });
        res.status(200).json({
            result: "success",
            msg: 'Marcas obtenidas correctamente',
            data: brands
        });
    } catch (error) {
        res.status(400).json({
            result: "error",
            msg: 'Error al obtener las marcas'
        });
    }
}

//.count() para obtener el número de marcas existen con ese nombre 
export const countBrandsByName = async (req, res) => {
    const { nameBrand } = req.query;
    try {
        const count = await Brand.findAndCountAll({ where: { name: nameBrand } });
        res.status(200).json({
            result: "success",
            msg: 'Conteo de marcas obtenido correctamente',
            data: count
        });
    } catch (error) {
        res.status(400).json({
            result: "error",
            msg: 'Error al obtener el conteo de las marcas'
        });
    }
}
// eliminar Marca 
export const deleteBrand = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.findByPk(id);
        if (!brand) {
            return res.status(404).json({
                result: "error",
                msg: 'Marca no encontrada'
            });
        }
        await brand.destroy();
        res.status(200).json({
            result: "success",
            msg: 'Marca eliminada correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            result: "error",
            msg: 'Error al eliminar la marca'
        });
    }
}
