/**
 * requireLogin middleware
 * Redirects unauthenticated users to /login.
 * Preserves the originally requested path as a ?next= query param
 * so the user can be sent back after logging in.
 */
exports.requireLogin = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/login?next=' + encodeURIComponent(req.originalUrl));
};
