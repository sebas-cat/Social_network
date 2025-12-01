const express = require('express');
const Community = require('../models/Community');

const router = express.Router();

// GET /api/v1/communities
router.get('/communities', async (req, res) => {
    try {
        const communities = await Community.find();
        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/communities/:id
router.get('/communities/:id', async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);
        if (!community) return res.status(404).json({ message: 'Comunidad no encontrada' });
        res.status(200).json(community);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/communities
router.post('/communities', async (req, res) => {
    try {
        const newCommunity = new Community(req.body);
        const saved = await newCommunity.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/communities/:id
router.put('/communities/:id', async (req, res) => {
    try {
        const updated = await Community.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Comunidad no encontrada' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/communities/:id
router.delete('/communities/:id', async (req, res) => {
    try {
        const deleted = await Community.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Comunidad no encontrada' });
        res.status(200).json({ message: 'Comunidad eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
