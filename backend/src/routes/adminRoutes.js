const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, authorize } = require('../middleware/authJWT');

router.get('/users', verifyToken, authorize(['admin']), adminController.getAllUsers);
router.put('/users/:id/toggle', verifyToken, authorize(['admin']), adminController.toggleUserActivation);
router.get('/stats', verifyToken, authorize(['admin']), adminController.getStageStats);
router.get('/users/:id', verifyToken, authorize(['admin']), adminController.getUserDetails);
router.post('/assign-entreprise', verifyToken, authorize(['admin']), adminController.affecterEntreprise);

module.exports = router;