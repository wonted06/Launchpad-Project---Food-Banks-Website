const express   = require('express');
const router    = express.Router();
const rateLimit = require('express-rate-limit');
const auth      = require('../src/controllers/authController');

// ── Rate limiter ──────────────────────────────────────────────
// Limits login and register attempts to 3 per 2-minute window per IP.
// Prevents brute-force attacks on user accounts.
const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 3,
  handler: (req, res, next, options) => {
    res.render('login', {
      error:     'You have reached your maximum login attempts, please wait 2 minutes.',
      pageTitle: 'Login – Feed Birmingham',
      pageId:    'login'
    });
  }
});

router.get('/login',     auth.getLogin);
router.post('/login',    loginLimiter, auth.postLogin);    // rate limited
router.get('/register',  auth.getRegister);
router.post('/register', loginLimiter, auth.postRegister); // rate limited
router.get('/logout',    auth.getLogout);

module.exports = router;
