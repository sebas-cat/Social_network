const express = require('express');
const Notification = require('../models/Notification');

const router = express.Router();

// GET /api/v1/notifications
router.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/notifications/:id
router.get('/notifications/:id', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notificación no encontrada' });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/notifications
router.post('/notifications', async (req, res) => {
    try {
        const newNotification = new Notification(req.body);
        const saved = await newNotification.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/notifications/:id
router.put('/notifications/:id', async (req, res) => {
    try {
        const updated = await Notification.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Notificación no encontrada' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/notifications/:id
router.delete('/notifications/:id', async (req, res) => {
    try {
        const deleted = await Notification.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Notificación no encontrada' });
        res.status(200).json({ message: 'Notificación eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
