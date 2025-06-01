const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/authJWT');
// Apply middleware for all admin routes
router.use(verifyToken);
router.use((req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Accès interdit - Droits d'administrateur requis" });
  }
});

router.get('/users', adminController.getAllUsers);
router.get('/users/:id/details', adminController.getUserDetails);
router.get('/stages/stats', adminController.getStageStats);
router.put('/users/:id/toggle', adminController.toggleUserActivation);

module.exports = router;