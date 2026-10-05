import { Router } from 'express';
import { getAllRoles, createRole, updateRole, deleteRole } from '../controllers/roles.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas de roles requieren token válido + rol admin
router.get('/', authenticate, requireAdmin, getAllRoles);
router.post('/', authenticate, requireAdmin, createRole);
router.put('/:id', authenticate, requireAdmin, updateRole);
router.delete('/:id', authenticate, requireAdmin, deleteRole);

export default router;
