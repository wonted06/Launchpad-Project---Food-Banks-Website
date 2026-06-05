const express = require('express');
const router = express.Router();
const inventory = require('../src/controllers/inventoryController');

router.get('/', inventory.getInventory);

module.exports = router;
