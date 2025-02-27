require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { engine } = require('express-handlebars');
require('./config/passport');

const app = express();
const PORT = 3000;

//TODO Handlebars configuration
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//TODO Middleware configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'segredo_super_secreto',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//! login route
app.get('/login', (req, res) => {
    res.render('login', { message: req.session.message });
});

app.post('/login', passport.authenticate('login', {
    successRedirect: '/products',
    failureRedirect: '/login',
    failureFlash: true
})); // processar

//!Registro rota
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', passport.authenticate('register', {
    successRedirect: '/login',
    failureRedirect: '/register',
    failureFlash: true
})); // processar

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/products',
    failureRedirect: '/login'
})); //! Rota de Login via GitHub


app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
}); //!Logout

//! Products Routes
app.get('/products', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    
    res.render('products', { user: req.user });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
