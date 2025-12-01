const express = require('express');
const CalendarEvent = require('../models/CalendarEvent');

const router = express.Router();

// GET /api/v1/calendar-events
router.get('/calendar-events', async (req, res) => {
    try {
        const events = await CalendarEvent.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/calendar-events/:id
router.get('/calendar-events/:id', async (req, res) => {
    try {
        const event = await CalendarEvent.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/calendar-events
router.post('/calendar-events', async (req, res) => {
    try {
        const newEvent = new CalendarEvent(req.body);
        const saved = await newEvent.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/calendar-events/:id
router.put('/calendar-events/:id', async (req, res) => {
    try {
        const updated = await CalendarEvent.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Evento no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/calendar-events/:id
router.delete('/calendar-events/:id', async (req, res) => {
    try {
        const deleted = await CalendarEvent.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Evento no encontrado' });
        res.status(200).json({ message: 'Evento eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
