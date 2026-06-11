const express   = require('express');
const router    = express.Router();
const locations = require('../src/controllers/locationsController');

// GET /locations       — list all food banks with map
// GET /locations/:id   — detail page for a single food bank
router.get('/',   locations.getLocations);
router.get('/:id', locations.getFoodBankDetail);

module.exports = router;
