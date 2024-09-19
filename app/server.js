const express = require('express');
const path = require('path');
const authenticate = require('../routes/auth');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Sheet = require('../models/sheet');
const User = require('../models/user');
const server = express();

// Import the mongoose configuration
require('../config/mongoose');

// Configuration du moteur de rendu
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, '../views'));

// Configuration des fichiers statiques
server.use(express.static(path.join(__dirname, '../public')));

// Middleware pour récupérer les données du formulaire
server.use(express.urlencoded({extended: false}));

// Middleware pour récupérer les données en JSON
server.use(express.json());

// Middleware pour gérer les cookies
server.use(cookieParser());

server.get('/', (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, user) => {
            if (err) {
                return res.render('index', {authenticated: false});
            }
            return res.render('index', {authenticated: true, user: user.username});
        });
    } else {
        res.render('index', {authenticated: false});
    }
});

// Middleware pour gérer l'authentification
server.use(authenticate);

server.get('/dashboard', authenticate, async (req, res) => {
    try {
        const sheets = await Sheet.find({owner: req.user.username});
        res.render('dashboard', {authenticated: true, sheets});
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des feuilles');
    }
});

server.get('/sheet', authenticate, (req, res) => {
    res.render('sheet', {authenticated: true});
});

server.post('/sheet/save', authenticate, async (req, res) => {
    const {sheet_name, data} = req.body;
    const sheet = new Sheet({ owner: req.user.username, name: sheet_name, data });
    await sheet.save();
    res.status(201).send('Sauvegarde réussie');
});

//ouvrir une feuille
server.get('/sheet/:id', authenticate, async (req, res) => {
    const sheet = await Sheet.findById(req.params.id);
    if (!sheet) {
        return res.status(404).send('Feuille introuvable');
    }
    res.render('sheet', {authenticated: true, sheet});
});

/*
server.get('/sheet/load', authenticate, async (req, res) => {
    const sheets = await Sheet.find().populate('owner', 'username');
    res.json(sheets);
});
*/

server.use((req, res) => {
    res.status(404).send('Page introuvable');
});

// Démarrer le serveur
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});