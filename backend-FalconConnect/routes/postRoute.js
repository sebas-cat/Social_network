const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

// GET /api/v1/posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/posts/:id
router.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post no encontrado' });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/posts
router.post('/posts', async (req, res) => {
    try {
        const newPost = new Post(req.body);
        const saved = await newPost.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/posts/:id
router.put('/posts/:id', async (req, res) => {
    try {
        const updated = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Post no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/posts/:id
router.delete('/posts/:id', async (req, res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Post no encontrado' });
        res.status(200).json({ message: 'Post eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
