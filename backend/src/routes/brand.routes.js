import {Router} from 'express';
import {getAllBrands,updateBrand } from '../controllers/brand.controller.js';
import { createBrand } from '../controllers/brand.controller.js';
import { deleteBrand } from '../controllers/brand.controller.js';

const router = Router();

//definir endpoints
router.get('/getAll', getAllBrands); // endpoint para obtener todas las marcas
router.put('/update/:id', updateBrand); // endpoint para actualizar una marca
router.post('/create', createBrand); // endpoint para crear una marca
router.delete('/delete/:id', deleteBrand); // endpoint para eliminar una marca
//  /update/54647
export default router;