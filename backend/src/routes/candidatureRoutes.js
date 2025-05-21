const express = require('express');
const router = express.Router();
const candidatureController = require('../controllers/candidatureController');
const { verifyToken, authorize } = require('../middleware/authJWT');

router.post('/', verifyToken, authorize(['etudiant']), candidatureController.createCandidature);
router.get('/', verifyToken, authorize(['entreprise', 'admin']), candidatureController.getAllCandidatures);
router.put('/:id', verifyToken, authorize(['entreprise', 'admin']), candidatureController.updateCandidature);

module.exports = router;