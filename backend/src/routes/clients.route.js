import { Router } from 'express';
import {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
} from '../controllers/clients.controller.js';

const router = Router();

// Definir endpoints para clientes
router.get('/', getAllClients); // Obtener todos los clientes
router.get('/:id', getClientById); // Obtener un cliente por ID
router.post('/', createClient); // Crear un nuevo cliente
router.put('/:id', updateClient); // Actualizar un cliente
router.delete('/:id', deleteClient); // Desactivar un cliente (borrado lógico)

export default router;
