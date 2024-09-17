const express = require('express');
const User = require('../app/user');
const jwt = require('jsonwebtoken');
const router = express.Router();

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
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
        return res.status(400).send('Nom d\'utilisateur ou mot de passe manquant');
    }

    if (password !== confirmPassword) {
        return res.status(400).send('Les mots de passe ne correspondent pas');
    }

    await User.save(username, password, res)
});

router.post('/check-username', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne(username);
    if (user) {
        return res.status(400).send('Nom d\'utilisateur déjà pris');
    }
    res.status(200).send('Nom d\'utilisateur disponible');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    await User.login(username, password, res)
});

//logout
router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
});

router.use(authenticate);

module.exports = router;