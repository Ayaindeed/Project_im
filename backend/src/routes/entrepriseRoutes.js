const express = require('express');
const router = express.Router();
const { 
    getEntrepriseStages, 
    getEntrepriseCandidatures, 
    createStage, 
    traiterCandidature,
    getEntrepriseStats
} = require('../controllers/entrepriseController');
const { verifyToken } = require('../middleware/authJWT');

// Enterprise routes with proper controller functions
router.get('/stages', verifyToken, getEntrepriseStages);
router.get('/candidatures', verifyToken, getEntrepriseCandidatures);
router.get('/stats', verifyToken, getEntrepriseStats);
router.post('/stages', verifyToken, createStage);
router.put('/candidatures/:id/traiter', verifyToken, traiterCandidature);

module.exports = router;