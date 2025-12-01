const express = require('express');
const Follow = require('../models/Follow');

const router = express.Router();

// GET /api/v1/follows
router.get('/follows', async (req, res) => {
    try {
        const follows = await Follow.find();
        res.status(200).json(follows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/follows/:id
router.get('/follows/:id', async (req, res) => {
    try {
        const follow = await Follow.findById(req.params.id);
        if (!follow) return res.status(404).json({ message: 'Follow no encontrado' });
        res.status(200).json(follow);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/follows
router.post('/follows', async (req, res) => {
    try {
        const newFollow = new Follow(req.body);
        const saved = await newFollow.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/follows/:id
router.put('/follows/:id', async (req, res) => {
    try {
        const updated = await Follow.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Follow no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/follows/:id
router.delete('/follows/:id', async (req, res) => {
    try {
        const deleted = await Follow.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Follow no encontrado' });
        res.status(200).json({ message: 'Follow eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
