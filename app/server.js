const express = require('express');
const path = require('path');
const authRoutes = require('../routes/auth'); // Adjusted path if necessary
const server = express();

// Configuration du moteur de rendu
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, '../views'));

// Configuration des fichiers statiques
server.use(express.static(path.join(__dirname, '../public')));

// Middleware pour récupérer les données du formulaire
server.use(express.urlencoded({ extended: false }));


server.get('/', (req, res) => {
    res.render('index');
});

server.use(authRoutes);


server.use((req, res) => {
    res.status(404).send('Page introuvable');
});

// Démarrer le serveur
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});