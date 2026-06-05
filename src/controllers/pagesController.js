exports.getAbout = (req, res) => {
    res.render('about', { pageTitle: 'About Us – Feed Birmingham', pageId: 'about' });
};

exports.getContact = (req, res) => {
    res.render('contact', { pageTitle: 'Contact – Feed Birmingham', pageId: 'contact' });
};

exports.postContact = (req, res) => {
    // TODO: send email / store message
    res.render('contact', { pageTitle: 'Contact – Feed Birmingham', pageId: 'contact', success: true });
};

exports.getDonate = (req, res) => {
    res.render('donate', { pageTitle: 'Donate – Feed Birmingham', pageId: 'donate' });
};

exports.getSettings = (req, res) => {
    res.render('settings', { pageTitle: 'Settings – Feed Birmingham', pageId: 'settings' });
};

exports.postSettings = (req, res) => {
    // TODO: persist settings to session / DB
    res.redirect('/settings');
};

exports.getFeedback = (req, res) => {
    res.render('feedback', { pageTitle: 'Feedback – Feed Birmingham', pageId: 'feedback' });
};

exports.postFeedback = (req, res) => {
    // TODO: store feedback in DB
    res.render('feedback', { pageTitle: 'Feedback – Feed Birmingham', pageId: 'feedback', success: true });
};

exports.getNews = (req, res) => {
    res.render('news', { pageTitle: 'News – Feed Birmingham', pageId: 'news' });
};

exports.getHotMeals = (req, res) => {
    res.render('hot-meals', { pageTitle: 'Hot Meal Schedule – Feed Birmingham', pageId: 'hot-meals' });
};
