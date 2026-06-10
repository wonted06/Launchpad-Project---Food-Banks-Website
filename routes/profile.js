const express     = require('express');
const router      = express.Router();
const profile     = require('../src/controllers/profileController');
const { requireLogin } = require('../src/middleware/auth');

// All profile routes require authentication
router.use(requireLogin);

router.get('/',        profile.getProfile);
router.post('/update', profile.postUpdateAccount);
router.post('/health',    profile.postUpdateHealth);
router.post('/password',  profile.postUpdatePassword);

module.exports = router;
