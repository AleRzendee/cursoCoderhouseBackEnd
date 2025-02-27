const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcryptjs');
const fs = require('fs');

const USERS_FILE = 'users.json';

const getUsers = async () => {
    try {
        const data = await fs.promises.readFile(USERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}; //! Função para ler usuários do arquivo

const saveUsers = async (users) => {
    await fs.promises.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}; //! Função para salvar usuários no arquivo

passport.use('register', new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
    const users = await getUsers();

    if (users.find(u => u.email === email)) {
        return done(null, false, { message: 'E-mail já registrado!' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { email, password: hashedPassword, role: 'user' };
    users.push(newUser);
    await saveUsers(users);

    return done(null, newUser);
})); //! Estratégia de Registro

passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const users = await getUsers();
    const user = users.find(u => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'Usuário ou senha inválidos!' });
    }

    return done(null, user);
})); //! Estratégia de Login

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    const users = await getUsers();
    let user = users.find(u => u.email === profile.username);

    if (!user) {
        user = { email: profile.username, password: null, role: 'user' };
        users.push(user);
        await saveUsers(users);
    }

    return done(null, user);
})); //! Estratégia de Login via GitHub

passport.serializeUser((user, done) => done(null, user.email)); //!Serializar usuário
passport.deserializeUser(async (email, done) => {
    const users = await getUsers();
    const user = users.find(u => u.email === email);
    done(null, user);
}); //!Deserializar usuário

