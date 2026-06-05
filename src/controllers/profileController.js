const User = require('../models/User');

// ── GET /profile ──────────────────────────────────────────────
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        res.render('profile', {
            pageTitle: 'My Profile – Feed Birmingham',
            pageId:    'profile',
            user,
        });
    } catch (err) {
        console.error('Profile load error:', err);
        res.render('profile', {
            pageTitle: 'My Profile – Feed Birmingham',
            pageId:    'profile',
            user:      req.session.user || null,
        });
    }
};

// ── POST /profile/update ──────────────────────────────────────
exports.postUpdateAccount = async (req, res) => {
    // Future: UPDATE users SET ... WHERE id = $1
    // For now, redirect back with a success flash
    res.redirect('/profile?updated=1');
};

// ── POST /profile/health ──────────────────────────────────────
exports.postUpdateHealth = async (req, res) => {
    // Future: UPDATE users SET diet=$1, allergies=$2 WHERE id = $3
    res.redirect('/profile?updated=1');
};
