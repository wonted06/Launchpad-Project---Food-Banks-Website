const express     = require('express');
const router      = express.Router();
const inventory   = require('../src/controllers/inventoryController');
const itemRequest = require('../src/controllers/itemRequestController');

// GET /inventory — display all inventory items with optional category/search filters
router.get('/', inventory.getInventory);

// POST /inventory/request — submit a request for a specific item
// TODO: Add requireLogin middleware before itemRequest.createRequest once
//       the item request flow is fully implemented.
router.post('/request', itemRequest.createRequest);

module.exports = router;
