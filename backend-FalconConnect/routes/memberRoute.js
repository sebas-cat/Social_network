const express = require('express');
const Member = require('../models/Member');

const router = express.Router();

// GET /api/v1/members
router.get('/members', async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/members/:id
router.get('/members/:id', async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: 'Miembro no encontrado' });
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/members
router.post('/members', async (req, res) => {
    try {
        const newMember = new Member(req.body);
        const saved = await newMember.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/members/:id
router.put('/members/:id', async (req, res) => {
    try {
        const updated = await Member.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Miembro no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/members/:id
router.delete('/members/:id', async (req, res) => {
    try {
        const deleted = await Member.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Miembro no encontrado' });
        res.status(200).json({ message: 'Miembro eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
