const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.ownedSheets = [];
        this.sharedSheets = [];
    }

    static async save(username, password, res) {
        const saltRounds = 10;
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
    }

    static async login(username, password, res) {
        try {
            const user = await User.findOne(username);
            if (!user) {
                return res.status(401).json({message: 'Paire login/mot de passe incorrecte 1'});
            }
            const valid = await bcrypt.compare(password, user.motDePasse);
            if (!valid) {
                return res.status(401).json({message: 'Paire login/mot de passe incorrecte 2'});
            }
            console.log('Utilisateur connecté:', user.nom);
            res.status(200).json({
                user_name: user.nom,
                token: jwt.sign(
                    { username: user.nom },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            });
        } catch (error) {
            res.status(500).json({error});
        }
    }

    static async findOne(username) {
        const query = 'SELECT * FROM users WHERE nom = ?';
        try {
            const results = await new Promise((resolve, reject) => {
                db.query(query, [username], (err, results) => {
                    if (err) {
                        console.error('Erreur lors de la recherche de l\'utilisateur:', err);
                        return reject(err);
                    }
                    resolve(results);
                });
            });
            return results[0];
        } catch (err) {
            throw err;
        }
    }

}

module.exports = User;