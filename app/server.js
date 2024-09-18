const express = require('express');
const path = require('path');
const authenticate = require('../routes/auth');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose = require('../config/mongoose');
const server = express();

// Configuration du moteur de rendu
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, '../views'));

// Configuration des fichiers statiques
server.use(express.static(path.join(__dirname, '../public')));

// Middleware pour récupérer les données du formulaire
server.use(express.urlencoded({ extended: false }));

// Middleware pour récupérer les données en JSON
server.use(express.json());

// Middleware pour gérer les cookies
server.use(cookieParser());

server.get('/', (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, user) => {
            if (err) {
                return res.render('index', { authenticated: false });
            }
            return res.render('index', { authenticated: true, user: user.username });
        });
    } else {
        res.render('index', { authenticated: false });
    }
});

// Middleware pour gérer l'authentification
server.use(authenticate);

server.get('/dashboard', authenticate, (req, res) => {
    res.render('dashboard');
});

server.use((req, res) => {
    res.status(404).send('Page introuvable');
});

// Démarrer le serveur
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});