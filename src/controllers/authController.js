const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User   = require('../models/User');
const pool   = require('../../db');

// ── GET /login ────────────────────────────────────────────────
// If already logged in, skip to home. Otherwise render the login page.
exports.getLogin = (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.render('login', {
        pageTitle: 'Login – Feed Birmingham',
        pageId:    'login',
        error:     req.query.error || null,
    });
};

// ── POST /login ───────────────────────────────────────────────
// Validates the submitted email and password using express-validator,
// looks up the user in the DB, and compares the password with bcrypt.
// On success, stores user ID and info in the session and redirects home.
exports.postLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
  async (req, res) => {
    // Return early if validation failed (e.g. empty fields, invalid email format)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login', {
            pageTitle: 'Login – Feed Birmingham',
            pageId:    'login',
            error:     errors.array()[0].msg,
        });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);

        // Use a generic error message to avoid revealing whether the email exists
        if (!user) {
            return res.render('login', {
                pageTitle: 'Login – Feed Birmingham',
                pageId:    'login',
                error:     'Incorrect email or password.',
            });
        }

        // bcrypt.compare rehashes the entered password and checks it against the stored hash
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.render('login', {
                pageTitle: 'Login – Feed Birmingham',
                pageId:    'login',
                error:     'Incorrect email or password.',
            });
        }

        // Store minimal user data in the session (used by nav bar and profile page)
        req.session.userId = user.id;
        req.session.user   = {
            id:         user.id,
            username:   user.username,
            email:      user.email,
            created_at: user.created_at,
        };

        // Load saved preferences (theme, language, etc.) into the session
        // so they apply immediately without visiting settings first
        try {
            const sr = await pool.query(
                'SELECT theme, text_size, colour_blind, text_to_speech, language FROM foodbank.users WHERE id = $1',
                [user.id]
            );
            if (sr.rows.length) {
                const r = sr.rows[0];
                req.session.settings = { theme: r.theme, textSize: r.text_size, colourBlind: r.colour_blind, textToSpeech: r.text_to_speech, language: r.language };
            }
        } catch (_) {}

        // Redirect to the page the user originally tried to visit (if any)
        const next = req.query.next || '/';
        res.redirect(next);

    } catch (err) {
        console.error('Login error:', err);
        res.render('login', {
            pageTitle: 'Login – Feed Birmingham',
            pageId:    'login',
            error:     'Something went wrong. Please try again.',
        });
    }
  }
];

// ── GET /register ─────────────────────────────────────────────
// If already logged in, skip to home. Otherwise render the register page.
exports.getRegister = (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.render('register', {
        pageTitle: 'Register – Feed Birmingham',
        pageId:    'register',
        error:     null,
    });
};

// ── POST /register ────────────────────────────────────────────
// Validates input fields, checks for duplicate username/email,
// creates the user (password is hashed inside User.create),
// and auto-logs them in after successful registration.
exports.postRegister = [
  body('username')
    .notEmpty().withMessage('Username is required.')
    .isAlphanumeric().withMessage('Username must contain only letters and numbers.')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters.'),
  body('email')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  body('password2')
    .custom((val, { req }) => val === req.body.password)
    .withMessage('Passwords do not match.'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', {
            pageTitle: 'Register – Feed Birmingham',
            pageId:    'register',
            error:     errors.array()[0].msg,
        });
    }

    const { username, email, password } = req.body;

    try {
        // Check uniqueness before inserting to give a helpful error message
        const usernameTaken = await User.usernameExists(username);
        if (usernameTaken) {
            return res.render('register', {
                pageTitle: 'Register – Feed Birmingham',
                pageId:    'register',
                error:     'That username is already taken.',
            });
        }

        const emailTaken = await User.emailExists(email);
        if (emailTaken) {
            return res.render('register', {
                pageTitle: 'Register – Feed Birmingham',
                pageId:    'register',
                error:     'An account with that email already exists.',
            });
        }

        // User.create hashes the password with bcrypt before inserting
        const newUser = await User.create({ username, email, password });

        // Auto-login: set session so the user lands on their profile straight away
        req.session.userId = newUser.id;
        req.session.user   = {
            id:         newUser.id,
            username:   newUser.username,
            email:      newUser.email,
            created_at: newUser.created_at,
        };

        // New users start with default settings
        req.session.settings = { theme: 'light', textSize: 15, colourBlind: false, textToSpeech: false };

        res.redirect('/profile');

    } catch (err) {
        console.error('Registration error:', err);
        res.render('register', {
            pageTitle: 'Register – Feed Birmingham',
            pageId:    'register',
            error:     'Something went wrong. Please try again.',
        });
    }
  }
];

// ── GET /logout ───────────────────────────────────────────────
// Destroys the server-side session (clears login state) and redirects home.
exports.getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error('Logout error:', err);
        res.redirect('/');
    });
};
