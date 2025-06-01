const express = require('express');
const router = express.Router();
const etudiantController = require('../controllers/etudiantController');
const { verifyToken, authorize } = require('../middleware/authJWT');
const upload = require('../utils/upload');

// Set up multer fields for CV and Lettre de motivation
const uploadFields = upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'lettreMotivation', maxCount: 1 }
]);

router.get('/candidatures', verifyToken, authorize(['etudiant']), etudiantController.getMesCandidatures);
router.post('/stages/:stageId/postuler', 
    verifyToken, 
    authorize(['etudiant']), 
    uploadFields,
    etudiantController.postulerStage
);

module.exports = router;