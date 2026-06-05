exports.getHome = (req, res) => {
    res.render('dashboard', { pageTitle: 'Feed Birmingham', pageId: 'home' });
};
