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


exports.getSettings = async (req, res) => {
    let settings = { theme: 'light', textSize: 15, colourBlind: false, textToSpeech: false };
    if (req.session.userId) {
        try {
            const pool = require('../../db');
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

const ContactSubmission = require('../models/ContactSubmission');
const Feedback          = require('../models/Feedback');


// ── GET /contact ───────────────────────────────────────────
exports.getContact = (req, res) => {
  res.render('contact', {
    pageTitle: 'Contact Us – Feed Birmingham',
    pageId:    'contact',
    success:   req.query.success === 'true',
    error:     null,
    form:      {},
  });
};

// ── POST /contact ──────────────────────────────────────────
exports.postContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.render('contact', {
      pageTitle: 'Contact Us – Feed Birmingham',
      pageId:    'contact',
      success:   false,
      error:     'Please fill in all required fields.',
      form:      { name, email, subject, message },
    });
  }

  try {
    await ContactSubmission.create({ name, email, subject, message });
    res.redirect('/contact?success=true');   // PRG — prevents resubmit on refresh
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
};


exports.postSettings = async (req, res) => {
    const { theme, textSize, colourBlind, textToSpeech, language } = req.body;
    const s = {
        theme:        theme === 'dark' ? 'dark' : 'light',
        textSize:     Math.min(20, Math.max(12, parseInt(textSize) || 15)),
        colourBlind:  colourBlind  === 'on',
        textToSpeech: textToSpeech === 'on',
        language:     language || 'en',
    };
    if (req.session.userId) {
        try {
            const pool = require('../../db');
            await pool.query(
                'UPDATE foodbank.users SET theme=$1, text_size=$2, colour_blind=$3, text_to_speech=$4, language=$5 WHERE id=$6',
                [s.theme, s.textSize, s.colourBlind, s.textToSpeech, s.language, req.session.userId]
            );
            req.session.settings = s;
        } catch (err) {
            console.error('postSettings DB error:', err);
        }
    } else {
        req.session.guestLang = s.language;
    }
    res.redirect('/settings');
};

// ── GET /feedback ──────────────────────────────────────────
exports.getFeedback = (req, res) => {
  res.render('feedback', {
    pageTitle: 'Feedback – Feed Birmingham',
    pageId:    'feedback',
    success:   req.query.success === 'true',
    error:     null,
    form:      {},
  });
};

// ── POST /feedback ─────────────────────────────────────────
exports.postFeedback = async (req, res) => {
  const { rating, service, comment, email } = req.body;

  // Validation — rating is required
  if (!rating || rating < 1 || rating > 5) {
    return res.render('feedback', {
      pageTitle: 'Feedback – Feed Birmingham',
      pageId:    'feedback',
      success:   false,
      error:     'Please select a star rating before submitting.',
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
};