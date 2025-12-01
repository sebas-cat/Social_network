const express = require('express');
const Project = require('../models/Project');

const router = express.Router();

// GET /api/v1/projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/projects/:id
router.get('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/projects
router.post('/projects', async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const saved = await newProject.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/projects/:id
router.put('/projects/:id', async (req, res) => {
    try {
        const updated = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Proyecto no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/projects/:id
router.delete('/projects/:id', async (req, res) => {
    try {
        const deleted = await Project.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Proyecto no encontrado' });
        res.status(200).json({ message: 'Proyecto eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
