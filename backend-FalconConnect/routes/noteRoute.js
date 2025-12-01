const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

// GET /api/v1/notes
router.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/notes/:id
router.get('/notes/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Nota no encontrada' });
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/notes
router.post('/notes', async (req, res) => {
    try {
        const newNote = new Note(req.body);
        const saved = await newNote.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/notes/:id
router.put('/notes/:id', async (req, res) => {
    try {
        const updated = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Nota no encontrada' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/notes/:id
router.delete('/notes/:id', async (req, res) => {
    try {
        const deleted = await Note.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Nota no encontrada' });
        res.status(200).json({ message: 'Nota eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
