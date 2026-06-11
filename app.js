require('dotenv').config();
const express = require('express');
const path    = require('path');
const session = require('express-session');
const helmet  = require('helmet');
const app     = express();

// ── Security headers (Helmet) ─────────────────────────────────
// Sets secure HTTP response headers to protect against common attacks.
// referrerPolicy is overridden so OpenStreetMap tile requests aren't blocked.
// CSP allowlist covers Leaflet (unpkg), Font Awesome (cdnjs), Google Fonts,
// postcodes.io and OSRM (used client-side for map features).
app.use(helmet({
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
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
// Parses incoming JSON and URL-encoded form data (e.g. POST form submissions).
// extended: false uses the built-in querystring module.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Static files ──────────────────────────────────────────────
// Serves CSS, images, and client-side JS from the src/public folder.
app.use(express.static(path.join(__dirname, 'src', 'public')));

// ── View engine ───────────────────────────────────────────────
// Pug is the templating engine. Templates live in src/views.
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'pug');

// ── Session ───────────────────────────────────────────────────
// Stores session data server-side (e.g. logged-in user ID, settings).
// Sessions expire after 7 days.
app.use(session({
    secret: process.env.SESSION_SECRET || 'feedbirmingham-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 7 days
}));

// ── i18n: load locale files once at startup ───────────────────
// JSON files containing all translated strings for each supported language.
// Loading at startup avoids reading files on every request.
const locales = {
  en: require('./src/locales/en.json'),
  pl: require('./src/locales/pl.json'),
  pu: require('./src/locales/pu.json'),
};
const SUPPORTED = ['en', 'pl', 'pu'];

// ── Global middleware: runs on every request ──────────────────
// Exposes user, login status, settings and the t() translation function
// to every Pug template without controllers needing to pass them manually.
app.use((req, res, next) => {
    res.locals.user       = req.session.user || null;
    res.locals.isLoggedIn = !!req.session.userId;
    res.locals.settings   = req.session.settings || null;

    // Determine active language; fall back to English if unsupported
    const raw   = req.session.settings?.language || req.session.guestLang || 'en';
    const lang  = SUPPORTED.includes(raw) ? raw : 'en';
    const dict  = locales[lang] || locales.en;
    // t('key') looks up the translation, falling back to English then the raw key
    res.locals.t    = (key) => dict[key] || locales.en[key] || key;
    res.locals.lang = lang;
    next();
});

// ── Routes ────────────────────────────────────────────────────
// Home page handled directly; all other routes loaded from /routes folder.
const homeCtrl = require('./src/controllers/homeController');
app.get('/', homeCtrl.getHome);

app.use('/', require('./routes/auth'));           // login, register, logout
app.use('/', require('./routes/pages'));          // about, contact, donate, settings, etc.
app.use('/locations', require('./routes/locations')); // food bank list + detail
app.use('/delivery', require('./routes/delivery'));   // request and track delivery
app.use('/inventory', require('./routes/inventory')); // stock levels
app.use('/profile', require('./routes/profile'));     // user profile (auth required)

// ── 404 handler ───────────────────────────────────────────────
// Catches any request that didn't match a route above.
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
