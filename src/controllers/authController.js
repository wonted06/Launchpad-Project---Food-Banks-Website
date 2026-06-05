const bcrypt = require('bcrypt');
const User   = require('../models/User');

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
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.render('login', {
                pageTitle: 'Login – Feed Birmingham',
                pageId:    'login',
                error:     'No account found with that email address.',
            });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.render('login', {
                pageTitle: 'Login – Feed Birmingham',
                pageId:    'login',
                error:     'Incorrect password. Please try again.',
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
};

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
exports.postRegister = async (req, res) => {
    const { username, email, password, password2 } = req.body;

    // Basic validation
    if (!username || !email || !password || !password2) {
        return res.render('register', {
            pageTitle: 'Register – Feed Birmingham',
            pageId:    'register',
            error:     'Please fill in all fields.',
        });
    }

    if (password !== password2) {
        return res.render('register', {
            pageTitle: 'Register – Feed Birmingham',
            pageId:    'register',
            error:     'Passwords do not match.',
        });
    }

    if (password.length < 6) {
        return res.render('register', {
            pageTitle: 'Register – Feed Birmingham',
            pageId:    'register',
            error:     'Password must be at least 6 characters.',
        });
    }

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

        res.redirect('/profile');

    } catch (err) {
        console.error('Registration error:', err);
        res.render('register', {
            pageTitle: 'Register – Feed Birmingham',
            pageId:    'register',
            error:     'Something went wrong. Please try again.',
        });
    }
};

// ── GET /logout ───────────────────────────────────────────────
exports.getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error('Logout error:', err);
        res.redirect('/');
    });
};
