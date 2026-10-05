import { Router } from 'express';
import { getAllProductTypes, createProductType, updateProductType, deleteProductType } from '../controllers/productType.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

const checkInventario = requireRole('admin', 'inventario');

router.get('/', authenticate, checkInventario, getAllProductTypes);
router.post('/', authenticate, checkInventario, createProductType);
router.put('/:id', authenticate, checkInventario, updateProductType);
router.delete('/:id', authenticate, checkInventario, deleteProductType);

export default router;
