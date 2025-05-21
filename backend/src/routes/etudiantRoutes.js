const express = require('express');
const router = express.Router();
const etudiantController = require('../controllers/etudiantController');
const { verifyToken, authorize } = require('../middleware/authJWT');

router.get('/profile', verifyToken, authorize(['etudiant']), etudiantController.getProfile);
router.put('/profile', verifyToken, authorize(['etudiant']), etudiantController.updateProfile);
router.get('/candidatures', verifyToken, authorize(['etudiant']), etudiantController.getMesCandidatures);
router.post('/postuler', verifyToken, authorize(['etudiant']), etudiantController.postulerStage);
router.get('/stages', verifyToken, authorize(['etudiant']), etudiantController.rechercherStages);

module.exports = router;