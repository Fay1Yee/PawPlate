const aiController = require('../controllers/aiController');
const express = require('express');
const router = express.Router();

router.post('/customize', aiController.customizeRecipe);
router.post('/recommendations', aiController.getRecommendations);

module.exports = router;