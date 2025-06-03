const express = require('express');
const router = express.Router();
const stageController = require('../controllers/stageController');
const { verifyToken } = require('../middleware/authJWT');

/**
 * @swagger
 * tags:
 *   name: Stages
 *   description: Routes pour la gestion des stages (accès public et privé)
 */

/**
 * @swagger
 * /stage:
 *   get:
 *     summary: Récupérer tous les stages disponibles (accès public)
 *     tags: [Stages]
 *     parameters:
 *       - in: query
 *         name: secteur
 *         schema:
 *           type: string
 *         description: Filtrer par secteur d'activité
 *       - in: query
 *         name: entreprise
 *         schema:
 *           type: string
 *         description: Filtrer par nom d'entreprise
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [disponible, en_cours, termine]
 *         description: Filtrer par statut du stage
 *     responses:
 *       200:
 *         description: Liste des stages disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Stage'
 *                   - type: object
 *                     properties:
 *                       entreprise:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nom:
 *                             type: string
 *                           secteur:
 *                             type: string
 *                           adresse:
 *                             type: string
 *                           siteWeb:
 *                             type: string
 *                           description:
 *                             type: string
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /stage/{id}:
 *   get:
 *     summary: Récupérer un stage par son ID
 *     tags: [Stages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du stage
 *     responses:
 *       200:
 *         description: Détails du stage
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Stage'
 *                 - type: object
 *                   properties:
 *                     entreprise:
 *                       $ref: '#/components/schemas/Entreprise'
 *       404:
 *         description: Stage non trouvé
 *       401:
 *         description: Non autorisé
 */

// Public route for listing all available stages
router.get('/', stageController.getAllStages);
// Protected route for getting a stage by ID
router.get('/:id', verifyToken, stageController.getStageById);

module.exports = router;