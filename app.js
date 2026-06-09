require('dotenv').config();
const express = require('express');
const path    = require('path');
const session = require('express-session');
const helmet  = require('helmet');
const app     = express();

// ── Security headers (Helmet) ─────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src':      ["'self'", "'unsafe-inline'", 'https://unpkg.com', 'https://cdnjs.cloudflare.com'],
      'script-src-attr': ["'unsafe-inline'"],
      'style-src':       ["'self'", "'unsafe-inline'", 'https://unpkg.com', 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'],
      'font-src':        ["'self'", 'https://cdnjs.cloudflare.com', 'https://fonts.gstatic.com'],
      'img-src':         ["'self'", 'data:', 'https://*.tile.openstreetmap.org'],
      'connect-src':     ["'self'", 'https://api.postcodes.io', 'https://router.project-osrm.org'],
    }
  }
}));

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

// Load locale files once at startup
const locales = {
  en: require('./src/locales/en.json'),
  pl: require('./src/locales/pl.json'),
  pu: require('./src/locales/pu.json'),
};
const SUPPORTED = ['en', 'pl', 'pu'];

// ── Auth locals (available in every view) ─────────────────────
app.use((req, res, next) => {
    res.locals.user       = req.session.user || null;
    res.locals.isLoggedIn = !!req.session.userId;
    res.locals.settings   = req.session.settings || null;

     // i18n
    const raw   = req.session.settings?.language || req.session.guestLang || 'en';
    const lang  = SUPPORTED.includes(raw) ? raw : 'en';
    const dict  = locales[lang] || locales.en;
    res.locals.t    = (key) => dict[key] || locales.en[key] || key;
    res.locals.lang = lang;
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
