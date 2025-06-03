const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/authJWT');

/**
 * @swagger
 * tags:
 *   name: Administration
 *   description: Routes d'administration (accès admin uniquement)
 */

// Apply middleware for all admin routes
router.use(verifyToken);
router.use((req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Accès interdit - Droits d'administrateur requis" });
  }
});

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nom:
 *                     type: string
 *                   prenom:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [admin, etudiant, entreprise]
 *                   dateInscription:
 *                     type: string
 *                     format: date-time
 *                   actif:
 *                     type: boolean
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Droits d'administrateur requis
 */

/**
 * @swagger
 * /admin/users/{id}/details:
 *   get:
 *     summary: Récupérer les détails complets d'un utilisateur
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails complets de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/User'
 *                 - type: object
 *                   properties:
 *                     etudiant:
 *                       $ref: '#/components/schemas/Etudiant'
 *                     entreprise:
 *                       $ref: '#/components/schemas/Entreprise'
 *                     candidatures:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Candidature'
 *                     stages:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Stage'
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Droits d'administrateur requis
 */

/**
 * @swagger
 * /admin/stages/stats:
 *   get:
 *     summary: Récupérer les statistiques des stages
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques complètes des stages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stageStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 candidatureStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 totalStages:
 *                   type: integer
 *                 totalCandidatures:
 *                   type: integer
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Droits d'administrateur requis
 */

/**
 * @swagger
 * /admin/users/{id}/toggle:
 *   put:
 *     summary: Activer/désactiver un compte utilisateur
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Statut du compte modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nom:
 *                       type: string
 *                     prenom:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     actif:
 *                       type: boolean
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Droits d'administrateur requis
 */

router.get('/users', adminController.getAllUsers);
router.get('/users/:id/details', adminController.getUserDetails);
router.get('/stages/stats', adminController.getStageStats);
router.put('/users/:id/toggle', adminController.toggleUserActivation);

module.exports = router;