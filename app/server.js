// server.js
const express = require('express');
const app = express();
const path = require('path');

// Configuration du moteur de rendu
app.set('view engine', 'ejs');

// Configuration des vues
app.set('views', path.join(__dirname, '../views'));

// Configuration des fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Middleware pour récupérer les données du formulaire
app.use(express.urlencoded({ extended: true }));

app.get('/signup', (req, res) => {
    res.render('signup');
});

// tout les autres routes qui ne sont pas défini
app.get('*', (req, res) => {
    res.send('Page introuvable');
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    //Affiche dans la console les données du formulaire
    console.log(`Nom d'utilisateur: ${username}`);
    // Logique pour gérer les données d'inscription
    res.send('Inscription réussie!');
    res.render('signupOK');
});

// Démarrer le serveur
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});