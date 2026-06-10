const bcrypt = require('bcrypt');
const User = require('../models/User');

// ── GET /profile ──────────────────────────────────────────────
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        res.render('profile', {
            pageTitle: 'My Profile – Feed Birmingham',
            pageId:    'profile',
            user,
            passwordUpdated: req.query.passwordUpdated,
            passwordError: req.query.passwordError
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
    try {
        const { diet, allergies, mobility } = req.body;

        // Convert checkbox array into a string
        const dietValue = Array.isArray(diet)
            ? diet.join(', ')
            : diet || null;

        await User.updateHealth(
            req.session.userId,
            dietValue,
            allergies,
            mobility
        );

        res.redirect('/profile?updated=1');
    } catch (err) {
        console.error('Health update error:', err);
        res.redirect('/profile?error=1');
    }
};

// ── POST /profile/security ──────────────────────────────────────
exports.postUpdatePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword,
            confirmNewPassword
        } = req.body;

        // Check new passwords match
        if (newPassword !== confirmNewPassword) {
            return res.redirect('/profile?passwordError=nomatch');
        }

        // Minimum password length
        if (newPassword.length < 6) {
            return res.redirect('/profile?passwordError=short');
        }

        // Get current user
        const user = await User.findById(req.session.userId);

        // Verify current password is correct
        const validPassword = await bcrypt.compare(
            currentPassword,
            user.password_hash
        );
        if (!validPassword) {
            return res.redirect('/profile?passwordError=incorrect');
        }

        // Shows an error if new password is the same as the old password
        const samePassword = await bcrypt.compare(
            newPassword,
            user.password_hash
        );
        if (samePassword) {
            return res.redirect('/profile?passwordError=same');
        }

        // Hash the user's new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // Save new password to 'users' table
        await User.updatePassword(
            req.session.userId,
            hashedPassword
        );

        res.redirect('/profile?passwordUpdated=1');

    } catch (err) {
        console.error('Password update error:', err);
        res.redirect('/profile?passwordError=server');
    }
};

