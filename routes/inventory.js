const express = require('express');
const router = express.Router();
const inventory = require('../src/controllers/inventoryController');
const itemRequest = require('../src/controllers/itemRequestController');

router.get('/', inventory.getInventory);

// TODO: Add auth middleware (e.g. requireLogin) before itemRequest.createRequest
//       when user sessions are wired up:  router.post('/request', requireLogin, itemRequest.createRequest)
router.post('/request', itemRequest.createRequest);

module.exports = router;
