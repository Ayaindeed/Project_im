const express = require('express');
const router = express.Router();
const stageController = require('../controllers/stageController');
const { verifyToken } = require('../middleware/authJWT');

// Public route for listing all available stages
router.get('/', stageController.getAllStages);
// Protected route for getting a stage by ID
router.get('/:id', verifyToken, stageController.getStageById);

module.exports = router;