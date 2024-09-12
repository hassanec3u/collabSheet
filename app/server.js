const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');

// Configuration du moteur de rendu
app.set('view engine', 'ejs');

// Configuration des vues
app.set('views', path.join(__dirname, '../views'));

// Configuration des fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Middleware pour récupérer les données du formulaire
app.use(express.urlencoded({ extended: true }));

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'phpmyadmin',
    password: 'abou',
    database: 'collabSheet'
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
    } else {
        console.log('Connecté à la base de données MySQL');
    }
});

// Page d'accueil
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

// Route pour gérer l'inscription
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (nom, motDePasse) VALUES (?, ?)';
    db.query(query, [username, password], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion des données:', err);
            res.status(404).send('Erreur lors de l\'inscription');
        } else {
            console.log("utilisateur ajouté");
            res.render('success');
        }
    });
});

// toutes les autres routes qui ne sont pas défini
app.get('*', (req, res) => {
    res.send('Page introuvable');
});

// Démarrer le serveur
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});