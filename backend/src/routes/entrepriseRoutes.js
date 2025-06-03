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

/**
 * @swagger
 * tags:
 *   name: Entreprise
 *   description: Routes pour la gestion des entreprises
 */

/**
 * @swagger
 * /entreprise/stages:
 *   get:
 *     summary: Récupérer tous les stages d'une entreprise
 *     tags: [Entreprise]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des stages de l'entreprise
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Stage'
 *                   - type: object
 *                     properties:
 *                       candidatures:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Candidature'
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *   post:
 *     summary: Créer un nouveau stage
 *     tags: [Entreprise]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *                 example: "Développeur Full-Stack Junior"
 *               description:
 *                 type: string
 *                 example: "Rejoignez notre équipe pour travailler sur des projets innovants..."
 *               dateDebut:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *               dateFin:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-30"
 *               commentaire:
 *                 type: string
 *                 example: "Stage idéal pour découvrir le développement web"
 *             required:
 *               - titre
 *               - description
 *               - dateDebut
 *               - dateFin
 *     responses:
 *       201:
 *         description: Stage créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /entreprise/candidatures:
 *   get:
 *     summary: Récupérer toutes les candidatures reçues par l'entreprise
 *     tags: [Entreprise]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des candidatures
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
 *                         $ref: '#/components/schemas/Stage'
 *                       etudiant:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: object
 *                             properties:
 *                               nom:
 *                                 type: string
 *                               prenom:
 *                                 type: string
 *                               email:
 *                                 type: string
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * /entreprise/candidatures/{id}/traiter:
 *   put:
 *     summary: Traiter une candidature (accepter/refuser)
 *     tags: [Entreprise]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la candidature
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [validé, refusé]
 *                 example: "validé"
 *               commentaire:
 *                 type: string
 *                 example: "Profil très intéressant, candidature retenue !"
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Candidature traitée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Candidature non trouvée
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * /entreprise/stats:
 *   get:
 *     summary: Récupérer les statistiques de l'entreprise
 *     tags: [Entreprise]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques de l'entreprise
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalStages:
 *                   type: integer
 *                   description: Nombre total de stages proposés
 *                 candidaturesEnAttente:
 *                   type: integer
 *                   description: Nombre de candidatures en attente
 *                 stagesActifs:
 *                   type: integer
 *                   description: Nombre de stages en cours
 *       401:
 *         description: Non autorisé
 */

// Enterprise routes with proper controller functions
router.get('/stages', verifyToken, getEntrepriseStages);
router.get('/candidatures', verifyToken, getEntrepriseCandidatures);
router.get('/stats', verifyToken, getEntrepriseStats);
router.post('/stages', verifyToken, createStage);
router.put('/candidatures/:id/traiter', verifyToken, traiterCandidature);

module.exports = router;