// Renders the home page (dashboard.pug).
// No database calls needed — the hot meal schedule on the home page is static HTML.
exports.getHome = (req, res) => {
    res.render('dashboard', { pageTitle: 'Feed Birmingham', pageId: 'home' });
};
