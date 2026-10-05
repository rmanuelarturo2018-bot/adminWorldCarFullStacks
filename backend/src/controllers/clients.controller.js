import { Client } from '../models/index.js';

export const getAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createClient = async (req, res) => {
    try {
        const { id, firstName, lastName, email, phoneNumber, documentId, address } = req.body;
        const newClient = await Client.create({
            id,
            firstName,
            lastName,
            email,
            phoneNumber,
            documentId,
            address
        });
        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id);
        if (!client) return res.status(404).json({ message: 'Client not found' });

        await client.update(req.body);
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id);
        if (!client) return res.status(404).json({ message: 'Client not found' });

        await client.update({ isActived: false });
        res.json({ message: 'Client deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
