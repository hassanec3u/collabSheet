const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');


const authenticate = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).send('Accès refusé 401, pas de token');
    }

    jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, user) => {
        if (err) {
            return res.status(403).send('Accès refusé 403');
        }
        req.user = user;
        next();
    });
};

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    const {username, password, confirmPassword} = req.body;

    if (!username || !password || !confirmPassword) {
        return res.status(400).send('Nom d\'utilisateur ou mot de passe manquant');
    }

    if (password !== confirmPassword) {
        return res.status(400).send('Les mots de passe ne correspondent pas');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)
        .catch(err => console.error('Erreur lors du hashage du mot de passe:', err,
            res.status(500).send('Erreur interne du serveur'))
        )
    ;

    try {
        const newUser = new User({username, password: hashedPassword});
        await newUser.save();
        console.log("utilisateur ajouté");
        res.render('success');
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        res.status(500).send('Erreur lors de la création de l\'utilisateur');
    }
})
;

router.post('/check-username', async (req, res) => {
    const {username} = req.body;
    const user = await User.findOne({username});
    if (user) {
        return res.status(400).send('Nom d\'utilisateur déjà pris');
    }
    res.status(200).send('Nom d\'utilisateur disponible');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if (!user) {
        return res.status(401).render('login', {errorMessage: 'Paire login/mot de passe incorrecte'});
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).render('login', {errorMessage: 'Paire login/mot de passe incorrecte'});
    }

    const token = jwt.sign({username: user.username}, 'RANDOM_TOKEN_SECRET', {expiresIn: '1h'});

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    });
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
});

router.use(authenticate);

module.exports = router;