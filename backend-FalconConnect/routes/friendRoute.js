const express = require('express');
const Friend = require('../models/Friend');

const router = express.Router();

// GET /api/v1/friends
router.get('/friends', async (req, res) => {
    try {
        const friends = await Friend.find();
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/friends/:id
router.get('/friends/:id', async (req, res) => {
    try {
        const friend = await Friend.findById(req.params.id);
        if (!friend) return res.status(404).json({ message: 'Amigo no encontrado' });
        res.status(200).json(friend);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/friends
router.post('/friends', async (req, res) => {
    try {
        const newFriend = new Friend(req.body);
        const saved = await newFriend.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/friends/:id
router.put('/friends/:id', async (req, res) => {
    try {
        const updated = await Friend.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Amigo no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/friends/:id
router.delete('/friends/:id', async (req, res) => {
    try {
        const deleted = await Friend.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Amigo no encontrado' });
        res.status(200).json({ message: 'Amigo eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
