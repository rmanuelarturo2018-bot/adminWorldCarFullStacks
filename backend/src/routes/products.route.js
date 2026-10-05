import { Router } from 'express';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

const checkInventario = requireRole('admin', 'inventario');

router.get('/', authenticate, checkInventario, getAllProducts);
router.post('/', authenticate, checkInventario, createProduct);
router.put('/:id', authenticate, checkInventario, updateProduct);
router.delete('/:id', authenticate, checkInventario, deleteProduct);

export default router;
