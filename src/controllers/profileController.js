const bcrypt = require('bcrypt');
const User = require('../models/User');

// ── GET /profile ──────────────────────────────────────────────
// Loads the full user record from DB (includes diet, allergies, mobility).
// Query params (accountUpdated, passwordUpdated, passwordError) are passed through
// so the template can show success/error banners on the correct tab.
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        res.render('profile', {
            pageTitle:       'My Profile – Feed Birmingham',
            pageId:          'profile',
            user,
            accountUpdated:  req.query.accountUpdated,
            passwordUpdated: req.query.passwordUpdated,
            passwordError:   req.query.passwordError
        });
    } catch (err) {
        console.error('Profile load error:', err);
        // Fall back to session data if the DB query fails
        res.render('profile', {
            pageTitle: 'My Profile – Feed Birmingham',
            pageId:    'profile',
            user:      req.session.user || null,
        });
    }
};

// ── POST /profile/update ──────────────────────────────────────
// Saves new username/email, then refreshes the session user object
// so the nav bar shows the updated name without requiring a re-login.
exports.postUpdateAccount = async (req, res) => {
    try {
        const { username, email } = req.body;

        await User.updateAccount(
            req.session.userId,
            username,
            email
        );

        // Refresh session so the nav bar reflects the new username/email on all pages immediately
        req.session.user = {
            ...req.session.user,
            username,
            email,
        };

        res.redirect('/profile?accountUpdated=1&tab=account');
    } catch (err) {
        console.error('Account update error:', err);
        res.redirect('/profile?error=1');
     }
};

// ── POST /profile/health ──────────────────────────────────────
// Saves dietary requirements, allergies, and mobility notes.
// &tab=health in the redirect keeps the user on the Health tab after saving.
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
// Full password change validation chain:
// 1. New passwords match
// 2. Minimum length (6 chars)
// 3. Current password is correct (bcrypt compare against DB hash)
// 4. New password is different from the current one
// Each failure redirects with a specific error code so the template shows the right message.
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

        // Get current user record to access the stored hash
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

        // Hash and save the new password (10 salt rounds matches registration)
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(req.session.userId, hashedPassword);

        res.redirect('/profile?passwordUpdated=1&tab=security');

    } catch (err) {
        console.error('Password update error:', err);
        res.redirect('/profile?passwordError=server&tab=security');
    }
};
