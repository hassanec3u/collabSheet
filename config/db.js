const mysql = require('mysql2');

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

module.exports = db;