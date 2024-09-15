const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Configuration du moteur de rendu
app.set('view engine', 'ejs');

// Configuration des vues
app.set('views', path.join(__dirname, '../views'));

// Configuration des fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Middleware pour récupérer les données du formulaire
app.use(express.urlencoded({ extended: false }));

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

const saltRounds = 10;

app.post('/signup', async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Validation des entrées
    if (!username || !password || !confirmPassword) {
        return res.status(400).send('Nom d\'utilisateur ou mot de passe manquant');
    }

    // Vérification que les mots de passe correspondent
    if (password !== confirmPassword) {
        return res.status(400).send('Les mots de passe ne correspondent pas');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const query = 'INSERT INTO users (nom, motDePasse) VALUES (?, ?)';
        db.query(query, [username, hashedPassword], (err) => {
            if (err) {
                console.error('Erreur lors de l\'insertion des données:', err);
                return res.status(404).send('Erreur lors de l\'inscription');
            }
            console.log("utilisateur ajouté");
            res.render('success');
        });
    } catch (err) {
        console.error('Erreur lors du hashage du mot de passe:', err);
        res.status(500).send('Erreur interne du serveur');
    }
});
// toutes les autres routes qui ne sont pas défini
app.get('*', (req, res) => {
    res.send('Page introuvable');
});

// Démarrer le serveur
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});