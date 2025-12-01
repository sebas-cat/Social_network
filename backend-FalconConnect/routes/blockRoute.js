const express = require('express');
const Block = require('../models/Block');

const router = express.Router();

// GET /api/v1/blocks
router.get('/blocks', async (req, res) => {
    try {
        const blocks = await Block.find();
        res.status(200).json(blocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/blocks/:id
router.get('/blocks/:id', async (req, res) => {
    try {
        const block = await Block.findById(req.params.id);
        if (!block) return res.status(404).json({ message: 'Block no encontrado' });
        res.status(200).json(block);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/blocks
router.post('/blocks', async (req, res) => {
    try {
        const newBlock = new Block(req.body);
        const saved = await newBlock.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/blocks/:id
router.put('/blocks/:id', async (req, res) => {
    try {
        const updated = await Block.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Block no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/blocks/:id
router.delete('/blocks/:id', async (req, res) => {
    try {
        const deleted = await Block.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Block no encontrado' });
        res.status(200).json({ message: 'Block eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;











