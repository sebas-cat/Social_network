const express = require('express');
const Like = require('../models/Like');

const router = express.Router();

// GET /api/v1/likes
router.get('/likes', async (req, res) => {
    try {
        const likes = await Like.find();
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/likes/:id
router.get('/likes/:id', async (req, res) => {
    try {
        const like = await Like.findById(req.params.id);
        if (!like) return res.status(404).json({ message: 'Like no encontrado' });
        res.status(200).json(like);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/likes
router.post('/likes', async (req, res) => {
    try {
        const newLike = new Like(req.body);
        const saved = await newLike.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/likes/:id
router.put('/likes/:id', async (req, res) => {
    try {
        const updated = await Like.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Like no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/likes/:id
router.delete('/likes/:id', async (req, res) => {
    try {
        const deleted = await Like.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Like no encontrado' });
        res.status(200).json({ message: 'Like eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
