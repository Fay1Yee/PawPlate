const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

router.post('/link', purchaseController.generatePurchaseLink);

module.exports = router;