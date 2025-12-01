const express = require('express')
const User = require('../models/User')

const router = express.Router()

// GET /api/v1/users -> todos los usuarios
router.get('/users', async (req, res) => 
{
    try 
    {
        const users = await User.find();
        res.status(200).json(users);
    } 
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/v1/users/:id -> usuario por ID
router.get('/users/:id', async (req, res) =>
{
    try
    {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json(user);
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/v1/users -> crear usuario
router.post('/users', async (req, res) => 
{
    try 
    {
        const newUser = new User(req.body);
        const saved = await newUser.save();
        res.status(201).json(saved);
    } 
    catch (error)
    {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/v1/users/:id -> actualizar usuario
router.put('/users/:id', async (req, res) => 
{
    try 
    {
        const updated = await User.findByIdAndUpdate
        (
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json(updated);
    } 
    catch (error)
    {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/v1/users/:id -> borrar usuario
router.delete('/users/:id', async (req, res) => 
{
    try 
    {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json({ message: 'Usuario eliminado' });
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;


















