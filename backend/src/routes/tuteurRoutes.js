const express = require('express');
const router = express.Router();
const tuteurController = require('../controllers/tuteurController');
const { verifyToken, authorize } = require('../middleware/authJWT');

// Exemple de routes CRUD pour Tuteur
router.post('/', verifyToken, authorize(['admin', 'entreprise']), tuteurController.createTuteur);
router.get('/', verifyToken, authorize(['admin']), tuteurController.getTuteurs);
router.put('/:id', verifyToken, authorize(['admin']), tuteurController.updateTuteur);
router.delete('/:id', verifyToken, authorize(['admin']), tuteurController.deleteTuteur);

module.exports = router;