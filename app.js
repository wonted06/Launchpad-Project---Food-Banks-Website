require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

// ── Body parsers ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Static files ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'src', 'public')));

// ── View engine ───────────────────────────────────────────────
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'pug');

// ── Session ───────────────────────────────────────────────────
app.use(session({
    secret: process.env.SESSION_SECRET || 'feedbirmingham-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 7 days
}));

// ── Auth locals (available in every view) ─────────────────────
app.use((req, res, next) => {
    res.locals.user       = req.session.user || null;
    res.locals.isLoggedIn = !!req.session.userId;
    next();
});

// ── Routes ────────────────────────────────────────────────────
const homeCtrl = require('./src/controllers/homeController');
app.get('/', homeCtrl.getHome);

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/pages'));
app.use('/locations', require('./routes/locations'));
app.use('/delivery', require('./routes/delivery'));
app.use('/inventory', require('./routes/inventory'));
app.use('/profile', require('./routes/profile'));

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).render('dashboard', {
        pageTitle: 'Page Not Found – Feed Birmingham',
        pageId: 'home',
    });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
    console.log('Visit http://localhost:3001 to see your app');
});
