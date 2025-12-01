const express = require('express');
const Comment = require('../models/Comment');

const router = express.Router();

// GET /api/v1/comments
router.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/comments/:id
router.get('/comments/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/comments
router.post('/comments', async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        const saved = await newComment.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/comments/:id
router.put('/comments/:id', async (req, res) => {
    try {
        const updated = await Comment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Comentario no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/comments/:id
router.delete('/comments/:id', async (req, res) => {
    try {
        const deleted = await Comment.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Comentario no encontrado' });
        res.status(200).json({ message: 'Comentario eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
