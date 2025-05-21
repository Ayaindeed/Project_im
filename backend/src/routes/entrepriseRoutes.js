const express = require('express');
const router = express.Router();
const entrepriseController = require('../controllers/entrepriseController');
const { verifyToken, authorize } = require('../middleware/authJWT');

router.get('/profile', verifyToken, authorize(['entreprise']), entrepriseController.getProfile);
router.put('/profile', verifyToken, authorize(['entreprise']), entrepriseController.updateProfile);
router.get('/stages', verifyToken, authorize(['entreprise']), entrepriseController.getMesStages);
router.post('/stages', verifyToken, authorize(['entreprise']), entrepriseController.createStage);
router.put('/stages/:id', verifyToken, authorize(['entreprise']), entrepriseController.updateStage);
router.get('/stages/:stageId/candidatures', verifyToken, authorize(['entreprise']), entrepriseController.getCandidatures);
router.post('/candidatures/traiter', verifyToken, authorize(['entreprise']), entrepriseController.traiterCandidature);

module.exports = router;