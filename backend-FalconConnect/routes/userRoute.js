const express = require('express')
const User = require('../models/User') //importa el modelo 

const router = express.Router()
// Roue¿ter que contiene todas todas las rutas relacionadas con users para luego exportarlos

//GET de users 
router.get('/users', async (req, res) => 
{
    try 
    {
        const users = await User.find(); //Busca a los usaurios en la colección
        res.status(200).json(users); //Devuelve la lista de usuarios en formato JSON
    } 
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
});

// GET por ID 
router.get('/users/:id', async (req, res) =>
{
    try
    {
        const user = await User.findById(req.params.id); // Obtiene el valor ID del usuario a traves del URL
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' }); //Busca al usuario que coincida
        res.status(200).json(user);
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
});

// POST de users
router.post('/users', async (req, res) => 
{
    try 
    {
        const newUser = new User(req.body); //Crea una nueva instancia de user con los datos que vienen de req.body
        const saved = await newUser.save(); //Crea el usuario en la base de datos
        res.status(201).json(saved);  //devuelve al usuario
    } 
    catch (error)
    {
        res.status(400).json({ message: error.message });
    }
});

// PUT de Users
router.put('/users/:id', async (req, res) => 
{
    try 
    {
        const updated = await User.findByIdAndUpdate
        (
            req.params.id, //busca a través del id
            req.body, // datos a actualizar 
            { new: true }, // documento actualizado
        );
        if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json(updated);
    } 
    catch (error)
    {
        res.status(400).json({ message: error.message });
    }
});

// DELETE  de User 
router.delete('/users/:id', async (req, res) => 
{
    try 
    {
        const deleted = await User.findByIdAndDelete(req.params.id); //borra usuario por id
        if (!deleted) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json({ message: 'Usuario eliminado' });
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router; //exporta el router para que index.js lo utilice


















