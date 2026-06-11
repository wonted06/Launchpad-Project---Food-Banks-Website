const express  = require('express');
const router   = express.Router();
const delivery = require('../src/controllers/deliveryController');

// GET  /delivery         — request delivery page (loads food bank list for postcode search)
// POST /delivery/request — submit a delivery request form (saves to DB, redirects to track)
// GET  /delivery/track   — track an existing delivery by reference number
router.get('/',         delivery.getDelivery);
router.post('/request', delivery.postDeliveryRequest);
router.get('/track',    delivery.getTrackDelivery);

module.exports = router;
