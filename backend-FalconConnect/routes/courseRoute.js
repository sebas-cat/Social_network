const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

// GET /api/v1/courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/courses/:id
router.get('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/courses
router.post('/courses', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        const saved = await newCourse.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/courses/:id
router.put('/courses/:id', async (req, res) => {
    try {
        const updated = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Curso no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/courses/:id
router.delete('/courses/:id', async (req, res) => {
    try {
        const deleted = await Course.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Curso no encontrado' });
        res.status(200).json({ message: 'Curso eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
