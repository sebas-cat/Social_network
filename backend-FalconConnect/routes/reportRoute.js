const express = require('express');
const Report = require('../models/Report');

const router = express.Router();

// GET /api/v1/reports
router.get('/reports', async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/reports/:id
router.get('/reports/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Reporte no encontrado' });
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/reports
router.post('/reports', async (req, res) => {
    try {
        const newReport = new Report(req.body);
        const saved = await newReport.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/reports/:id
router.put('/reports/:id', async (req, res) => {
    try {
        const updated = await Report.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Reporte no encontrado' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/reports/:id
router.delete('/reports/:id', async (req, res) => {
    try {
        const deleted = await Report.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Reporte no encontrado' });
        res.status(200).json({ message: 'Reporte eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
