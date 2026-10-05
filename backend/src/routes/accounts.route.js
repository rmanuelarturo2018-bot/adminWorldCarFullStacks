import { Router } from 'express';

import { login, register, getAllUsers, updateUser, deleteUser, getProfile, updateCurrentUser, changePassword, resetPassword } from '../controllers/account.controller.js';

import { authenticate,requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

//definir endpoints
router.post('/login', login); // endpoint para login 

router.post('/register', requireAdmin, register); // endpoint para registro de usuario

router.get('/users', getAllUsers); // endpoint para obtener todos los usuarios

// endpoint para actualizar un usuario (modificar)
router.put('/users/:id', authenticate, updateUser);

// ─── FIX PROBLEMA 2: endpoint para eliminar usuario ───
// DELETE /api/accounts/users/:id -> soft delete (isActived=false)
// DELETE /api/accounts/users/:id?force=true -> hard delete (borrado físico)
router.delete('/users/:id', authenticate, deleteUser);

// Perfil del usuario autenticado
router.get('/profile', getProfile);
router.put('/profile', updateCurrentUser);
router.put('/change-password', changePassword);

// endpoint para reiniciar contraseña por email
router.post('/reset-password', resetPassword);



export default router;
