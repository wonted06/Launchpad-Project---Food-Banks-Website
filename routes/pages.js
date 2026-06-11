const express = require('express');
const router  = express.Router();
const pages   = require('../src/controllers/pagesController');

// Static and form-based pages — no authentication required
router.get('/about',          pages.getAbout);
router.get('/contact',        pages.getContact);
router.post('/contact',       pages.postContact);      // saves message to DB
router.get('/donate',         pages.getDonate);
router.get('/settings',       pages.getSettings);
router.post('/settings',      pages.postSettings);     // saves preferences to DB/session
router.get('/feedback',       pages.getFeedback);
router.post('/feedback',      pages.postFeedback);     // saves rating to DB
router.get('/news',           pages.getNews);
router.get('/hot-meals',      pages.getHotMeals);
router.get('/food-education', pages.getFoodEducation);

module.exports = router;
