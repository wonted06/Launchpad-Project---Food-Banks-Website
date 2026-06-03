const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Register both template engines
app.engine('ejs', require('ejs').renderFile);
app.engine('pug', require('pug').__express);

// Look in src/ (for .ejs) and src/views/ (for .pug)
app.set('views', [
    path.join(__dirname, 'src'),
    path.join(__dirname, 'src', 'views'),
]);
app.set('view engine', 'pug');

// ─── Public pages ────────────────────────────────────────────

app.get('/', (_req, res) => {
    res.render('index');
});

// Legacy EJS dashboard (Nike-styled)
app.get('/main', (_req, res) => {
    res.render('main.ejs');
});

// ─── Auth ────────────────────────────────────────────────────

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.render('login', { error: 'Username and password are required.' });
    }
    // TODO: look up user in DB, verify bcrypt hash, set session
    res.render('login', { error: 'Login not yet implemented.' });
});

app.get('/register', (req, res) => {
    res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
    const { name, username, email, password, password2 } = req.body;
    if (!name || !username || !email || !password) {
        return res.render('register', { error: 'All fields are required.' });
    }
    if (password !== password2) {
        return res.render('register', { error: 'Passwords do not match.' });
    }
    // TODO: hash password, insert user into DB, redirect to /dashboard
    res.render('register', { error: 'Registration not yet implemented.' });
});

app.get('/forgot-password', (req, res) => {
    res.render('forgotpassword', { message: null });
});

app.post('/forgot-password', (req, res) => {
    // TODO: look up email in DB, send reset link
    res.render('forgotpassword', { message: 'If that email exists, a reset link has been sent.' });
});

app.get('/logout', (_req, res) => {
    // TODO: destroy session
    res.redirect('/');
});

// ─── Dashboard ───────────────────────────────────────────────

app.get('/dashboard', (_req, res) => {
    // TODO: add auth middleware to protect this route
    res.render('dashboard');
});

// ─── Error handlers ──────────────────────────────────────────

app.use((_req, res) => {
    res.status(404).render('error', {
        message: 'Page not found',
        error: { status: 404, stack: '' },
    });
});

app.use((err, _req, res, _next) => {
    res.status(err.status || 500).render('error', {
        message: err.message,
        error: { status: err.status || 500, stack: err.stack },
    });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
    console.log('Visit http://localhost:3001 to see your app');
});
