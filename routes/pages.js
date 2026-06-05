const express = require('express');
const router = express.Router();
const pages = require('../src/controllers/pagesController');

router.get('/about', pages.getAbout);
router.get('/contact', pages.getContact);
router.post('/contact', pages.postContact);
router.get('/donate', pages.getDonate);
router.get('/settings', pages.getSettings);
router.post('/settings', pages.postSettings);
router.get('/feedback', pages.getFeedback);
router.post('/feedback', pages.postFeedback);
router.get('/news', pages.getNews);
router.get('/hot-meals', pages.getHotMeals);

module.exports = router;
