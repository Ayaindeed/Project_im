const express = require('express');
const router = express.Router();
const stageController = require('../controllers/stageController');
const { verifyToken } = require('../middleware/authJWT');

router.get('/', verifyToken, stageController.getAllStages);
router.get('/:id', verifyToken, stageController.getStageById);

module.exports = router;