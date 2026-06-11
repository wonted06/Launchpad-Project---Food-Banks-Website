const express          = require('express');
const router           = express.Router();
const profile          = require('../src/controllers/profileController');
const { requireLogin } = require('../src/middleware/auth');

// All profile routes require the user to be logged in.
// requireLogin redirects to /login if req.session.userId is not set.
router.use(requireLogin);

router.get('/',           profile.getProfile);        // view profile page
router.post('/update',    profile.postUpdateAccount); // save username/email changes
router.post('/health',    profile.postUpdateHealth);  // save dietary/health details
router.post('/password',  profile.postUpdatePassword); // change password

module.exports = router;
