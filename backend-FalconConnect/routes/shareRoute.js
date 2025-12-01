const express = require('express');
const Share = require('../models/Share');

const router = express.Router();

// GET /api/v1/shares
router.get('/shares', async (req, res) => {
    try {
        const shares = await Share.find();
        res.status(200).json(shares);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/shares/:id
router.get('/shares/:id', async (req, res) => {
    try {
        const share = await Share.findById(req.params.id);
        if (!share) return res.status(404).json({ message: 'Share no encontrado' });
        res.status(200).json(share);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/shares
router.post('/shares', async (req, res) => {
    try {
        const newShare = new Share(req.body);
        const saved = await newShare.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/shares/:id
router.put('/shares/:id', async (req, res) => {
    try {
        const updated = await Share.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Share no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/shares/:id
router.delete('/shares/:id', async (req, res) => {
    try {
        const deleted = await Share.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Share no encontrado' });
        res.status(200).json({ message: 'Share eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
