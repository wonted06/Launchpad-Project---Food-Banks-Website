const bcrypt = require('bcrypt');
const User = require('../models/User');

// ── GET /profile ──────────────────────────────────────────────
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        res.render('profile', {
            pageTitle:       'My Profile – Feed Birmingham',
            pageId:          'profile',
            user,
            updated:         req.query.updated,
            passwordUpdated: req.query.passwordUpdated,
            passwordError:   req.query.passwordError
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
    try {
        const {username, email} = req.body;

        await User.updateAccount(
            req.session.userId,
            username,
            email
        );

        res.direct('/profile?updated=1');
    } catch (err) {
        console.error('Account update error:', err);
        res.redirect('/profile?error=1');
     }
};


// ── POST /profile/health ──────────────────────────────────────
exports.postUpdateHealth = async (req, res) => {
    try {
        const { diet, allergies, mobility } = req.body;

        // Convert checkbox field to comma-separated string (handles array, single string, or nothing)
        const dietValue = Array.isArray(diet)
            ? diet.join(', ')
            : diet || null;

        await User.updateHealth(
            req.session.userId,
            dietValue,
            allergies || null,
            mobility  || null
        );

        res.redirect('/profile?updated=health&tab=health');
    } catch (err) {
        console.error('Health update error:', err);
        res.redirect('/profile?error=1&tab=health');
    }
};

// ── POST /profile/password ────────────────────────────────────
exports.postUpdatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        // New passwords must match
        if (newPassword !== confirmNewPassword) {
            return res.redirect('/profile?passwordError=nomatch&tab=security');
        }

        // Minimum password length
        if (!newPassword || newPassword.length < 6) {
            return res.redirect('/profile?passwordError=short&tab=security');
        }

        // Get current user record
        const user = await User.findById(req.session.userId);

        // Verify the supplied current password is correct
        const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
        if (!validPassword) {
            return res.redirect('/profile?passwordError=incorrect&tab=security');
        }

        // New password cannot be the same as the old one
        const samePassword = await bcrypt.compare(newPassword, user.password_hash);
        if (samePassword) {
            return res.redirect('/profile?passwordError=same&tab=security');
        }

        // Hash and save the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(req.session.userId, hashedPassword);

        res.redirect('/profile?passwordUpdated=1&tab=security');

    } catch (err) {
        console.error('Password update error:', err);
        res.redirect('/profile?passwordError=server&tab=security');
    }
};
