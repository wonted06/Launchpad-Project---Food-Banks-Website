const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User   = require('../models/User');
const pool   = require('../../db');

// ── GET /login ────────────────────────────────────────────────
exports.getLogin = (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.render('login', {
        pageTitle: 'Login – Feed Birmingham',
        pageId:    'login',
        error:     req.query.error || null,
    });
};

// ── POST /login ───────────────────────────────────────────────
exports.postLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
  async (req, res) => {
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

        if (!user) {
            return res.render('login', {
                pageTitle: 'Login – Feed Birmingham',
                pageId:    'login',
                error:     'Incorrect email or password.',
            });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.render('login', {
                pageTitle: 'Login – Feed Birmingham',
                pageId:    'login',
                error:     'Incorrect email or password.',
            });
        }

        // Store session
        req.session.userId = user.id;
        req.session.user   = {
            id:         user.id,
            username:   user.username,
            email:      user.email,
            created_at: user.created_at,
        };

        // Load user settings into session
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
exports.getRegister = (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.render('register', {
        pageTitle: 'Register – Feed Birmingham',
        pageId:    'register',
        error:     null,
    });
};

// ── POST /register ────────────────────────────────────────────
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
        // Check for existing username / email
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

        // Create user
        const newUser = await User.create({ username, email, password });

        // Auto-login after registration
        req.session.userId = newUser.id;
        req.session.user   = {
            id:         newUser.id,
            username:   newUser.username,
            email:      newUser.email,
            created_at: newUser.created_at,
        };

        // New users get default settings in session
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
exports.getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error('Logout error:', err);
        res.redirect('/');
    });
};
