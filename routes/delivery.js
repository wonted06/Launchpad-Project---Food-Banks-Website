const express = require('express');
const router = express.Router();
const delivery = require('../src/controllers/deliveryController');

router.get('/', delivery.getDelivery);
router.post('/request', delivery.postDeliveryRequest);
router.get('/track', delivery.getTrackDelivery);

module.exports = router;
