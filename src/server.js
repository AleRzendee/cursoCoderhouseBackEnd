const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const USERS_FILE = 'users.json';

//TODO Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//TODO Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'segredo_super_secreto',
    resave: false,
    saveUninitialized: true
}));

// Read files //
const getUsers = async () => {
    try {
        const data = await fs.promises.readFile(USERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

//!Login routes //
app.get('/login', (req, res) => {
    res.render('login', { message: req.session.message });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const users = await getUsers();

    
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user = { email, role: 'admin' };
        return res.redirect('/products'); // Verifica se o usuário é admin
    }

    const user = users.find(u => u.email === email && bcrypt.compareSync(password, u.password));
    if (!user) {
        req.session.message = 'Usuário ou senha inválidos!';
        return res.redirect('/login');
    } // Verifica usuários cadastrados

    req.session.user = { email: user.email, role: 'user' };
    res.redirect('/products');
});

//rotaderegistro
app.get('/register', (req, res) => {
    res.render('register', { message: req.session.message });
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const users = await getUsers();

    if (users.find(u => u.email === email)) {
        req.session.message = 'Este e-mail já está registrado!';
        return res.redirect('/register');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ email, password: hashedPassword });

    await fs.promises.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

    req.session.message = 'Registro bem-sucedido! Faça login.';
    res.redirect('/login');
});

//logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

app.get('/products', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    res.render('products', { user: req.session.user });
}); //! Rota de produtos (!somente para usuários logados)

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
