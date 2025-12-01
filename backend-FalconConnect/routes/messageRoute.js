const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// GET /api/v1/messages
router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/messages/:id
router.get('/messages/:id', async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: 'Mensaje no encontrado' });
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/messages
router.post('/messages', async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        const saved = await newMessage.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/messages/:id
router.put('/messages/:id', async (req, res) => {
    try {
        const updated = await Message.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Mensaje no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/messages/:id
router.delete('/messages/:id', async (req, res) => {
    try {
        const deleted = await Message.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Mensaje no encontrado' });
        res.status(200).json({ message: 'Mensaje eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
