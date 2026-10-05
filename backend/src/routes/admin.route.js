import { Router } from 'express';
import { adminGetAllUsers, adminCreateUser, adminUpdateUser, adminDeleteUser } from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas admin requieren token válido + rol admin
router.get('/users', authenticate, requireAdmin, adminGetAllUsers);
router.post('/users', authenticate, requireAdmin, adminCreateUser);
router.put('/users/:id', authenticate, requireAdmin, adminUpdateUser);
router.delete('/users/:id', authenticate, requireAdmin, adminDeleteUser);

export default router;
