const { body, validationResult } = require('express-validator');
const ContactSubmission = require('../models/ContactSubmission');
const Feedback          = require('../models/Feedback');
const pool              = require('../../db');

// ── Static page renders ───────────────────────────────────────
// These pages have no DB calls — content is static HTML/Pug.

exports.getAbout = (req, res) => {
    res.render('about', { pageTitle: 'About Us – Feed Birmingham', pageId: 'about' });
};

exports.getDonate = (req, res) => {
    res.render('donate', { pageTitle: 'Donate – Feed Birmingham', pageId: 'donate' });
};

exports.getNews = (req, res) => {
    res.render('news', { pageTitle: 'News – Feed Birmingham', pageId: 'news' });
};

exports.getHotMeals = (req, res) => {
    res.render('hot-meals', { pageTitle: 'Hot Meal Schedule – Feed Birmingham', pageId: 'hot-meals' });
};

exports.getFoodEducation = (req, res) => {
    res.render('food-education', { pageTitle: 'Food Education – Feed Birmingham', pageId: 'food-education' });
};

// ── GET /settings ─────────────────────────────────────────────
// Loads the user's saved settings from the DB (logged-in users only).
// Guests see the default values until they save.
exports.getSettings = async (req, res) => {
    // Default settings used for guests or if the DB query fails
    let settings = { theme: 'light', textSize: 15, colourBlind: false, textToSpeech: false };
    if (req.session.userId) {
        try {
            const result = await pool.query(
                'SELECT theme, text_size, colour_blind, text_to_speech, language FROM foodbank.users WHERE id = $1',
                [req.session.userId]
            );
            if (result.rows.length) {
                const r = result.rows[0];
                settings = {
                    theme:        r.theme,
                    textSize:     r.text_size,
                    colourBlind:  r.colour_blind,
                    textToSpeech: r.text_to_speech,
                    language:     r.language || 'en',
                };
            }
        } catch (err) {
            console.error('getSettings DB error:', err);
        }
    }
    res.render('settings', { pageTitle: 'Settings – Feed Birmingham', pageId: 'settings', settings });
};

// ── POST /settings ────────────────────────────────────────────
// Saves theme, text size, accessibility flags, and language.
// Logged-in users: persisted to DB and written to session.
// Guests: language stored in session only (other settings apply via session too).
exports.postSettings = async (req, res) => {
    const { theme, textSize, colourBlind, textToSpeech, language } = req.body;

    // Sanitise and clamp values before saving
    const settings = {
        theme:        theme === 'dark' ? 'dark' : 'light',
        textSize:     Math.min(20, Math.max(12, parseInt(textSize) || 15)),
        colourBlind:  colourBlind  === 'on',
        textToSpeech: textToSpeech === 'on',
        language:     language || 'en',
    };
    if (req.session.userId) {
        try {
            await pool.query(
                'UPDATE foodbank.users SET theme=$1, text_size=$2, colour_blind=$3, text_to_speech=$4, language=$5 WHERE id=$6',
                [settings.theme, settings.textSize, settings.colourBlind, settings.textToSpeech, settings.language, req.session.userId]
            );
            // Update session so changes take effect immediately without re-logging in
            req.session.settings = settings;
        } catch (err) {
            console.error('postSettings DB error:', err);
        }
    } else {
        // Guests: store language in session so it applies sitewide for this visit
        req.session.guestLang = settings.language;
    }
    res.redirect('/settings');
};

// ── GET /contact ───────────────────────────────────────────────
// Passes success flag from query param (set after a successful POST redirect).
exports.getContact = (req, res) => {
  res.render('contact', {
    pageTitle: 'Contact Us – Feed Birmingham',
    pageId:    'contact',
    success:   req.query.success === 'true',
    error:     null,
    form:      {},
  });
};

// ── POST /contact ──────────────────────────────────────────────
// Validates fields with express-validator, saves to DB, then redirects (PRG pattern).
// On failure, re-renders the form with the error and the user's previously typed values.
exports.postContact = [
  body('name').notEmpty().trim().isLength({ min: 2, max: 100 }).withMessage('Please enter your full name.'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address.'),
  body('message').notEmpty().trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters.'),
  async (req, res) => {
    const { name, email, subject, message } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Pass form values back so the user doesn't have to retype everything
      return res.render('contact', {
        pageTitle: 'Contact Us – Feed Birmingham',
        pageId:    'contact',
        success:   false,
        error:     errors.array()[0].msg,
        form:      { name, email, subject, message },
      });
    }

    try {
      await ContactSubmission.create({ name, email, subject, message });
      // PRG: redirect so refreshing the success page doesn't resubmit the form
      res.redirect('/contact?success=true');
    } catch (err) {
      console.error('postContact error:', err);
      res.render('contact', {
        pageTitle: 'Contact Us – Feed Birmingham',
        pageId:    'contact',
        success:   false,
        error:     'Something went wrong. Please try again.',
        form:      { name, email, subject, message },
      });
    }
  }
];

// ── GET /feedback ──────────────────────────────────────────────
exports.getFeedback = (req, res) => {
  res.render('feedback', {
    pageTitle: 'Feedback – Feed Birmingham',
    pageId:    'feedback',
    success:   req.query.success === 'true',
    error:     null,
    form:      {},
  });
};

// ── POST /feedback ─────────────────────────────────────────────
// Validates the star rating (required, 1–5) and optional email.
// Saves to DB and redirects on success (PRG pattern).
exports.postFeedback = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Please select a star rating before submitting.'),
  // Email is optional — only validate format if the user filled it in
  body('email').optional({ checkFalsy: true }).isEmail().normalizeEmail().withMessage('Please enter a valid email address.'),
  async (req, res) => {
    const { rating, service, comment, email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('feedback', {
        pageTitle: 'Feedback – Feed Birmingham',
        pageId:    'feedback',
        success:   false,
        error:     errors.array()[0].msg,
        form:      { rating, service, comment, email },
      });
    }

    try {
      await Feedback.create({ rating, service, comment, email });
      res.redirect('/feedback?success=true');
    } catch (err) {
      console.error('postFeedback error:', err);
      res.render('feedback', {
        pageTitle: 'Feedback – Feed Birmingham',
        pageId:    'feedback',
        success:   false,
        error:     'Something went wrong. Please try again.',
        form:      { rating, service, comment, email },
      });
    }
  }
];