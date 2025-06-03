const express = require('express');
const router = express.Router();
const etudiantController = require('../controllers/etudiantController');
const { verifyToken, authorize } = require('../middleware/authJWT');
const upload = require('../utils/upload');

/**
 * @swagger
 * tags:
 *   name: Etudiant
 *   description: Routes pour la gestion des étudiants
 */

/**
 * @swagger
 * /etudiant/candidatures:
 *   get:
 *     summary: Récupérer toutes les candidatures d'un étudiant
 *     tags: [Etudiant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des candidatures de l'étudiant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Candidature'
 *                   - type: object
 *                     properties:
 *                       stage:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           titre:
 *                             type: string
 *                           description:
 *                             type: string
 *                           dateDebut:
 *                             type: string
 *                             format: date
 *                           dateFin:
 *                             type: string
 *                             format: date
 *                       entreprise:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nom:
 *                             type: string
 *                           secteur:
 *                             type: string
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Profil étudiant non trouvé
 */

/**
 * @swagger
 * /etudiant/stages/{stageId}/postuler:
 *   post:
 *     summary: Postuler à un stage
 *     tags: [Etudiant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du stage
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: "Fichier CV (PDF uniquement)"
 *               lettreMotivation:
 *                 type: string
 *                 format: binary
 *                 description: "Fichier lettre de motivation (PDF uniquement)"
 *               message:
 *                 type: string
 *                 description: "Message de motivation optionnel"
 *     responses:
 *       201:
 *         description: Candidature soumise avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Candidature déjà existante ou données invalides
 *       404:
 *         description: Stage non trouvé ou profil étudiant non trouvé
 *       401:
 *         description: Non autorisé
 */

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