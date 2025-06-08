const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/authJWT');
const passport = require('../config/passport'); // Import passport config

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Routes d'authentification et gestion des comptes
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "marie.dupont@etudiant.com"
 *             motdepasse: "etudiant123"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *               - email
 *               - motdepasse
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               motdepasse:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [etudiant, entreprise]
 *                 default: etudiant
 *               niveau:
 *                 type: string
 *                 description: "Pour les étudiants uniquement"
 *               filiere:
 *                 type: string
 *                 description: "Pour les étudiants uniquement"
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: "Fichier CV (PDF uniquement)"
 *               lettreMotivation:
 *                 type: string
 *                 format: binary
 *                 description: "Fichier lettre de motivation (PDF uniquement)"
 *     responses:
 *       201:
 *         description: Inscription réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Données invalides ou utilisateur existant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Mise à jour du profil utilisateur
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               niveau:
 *                 type: string
 *                 description: "Pour les étudiants uniquement"
 *               filiere:
 *                 type: string
 *                 description: "Pour les étudiants uniquement"
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: "Fichier CV (PDF uniquement)"
 *               lettreMotivation:
 *                 type: string
 *                 format: binary
 *                 description: "Fichier lettre de motivation (PDF uniquement)"
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Token invalide ou manquant
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth authentication
 *     tags: [Authentication]
 *     description: Redirect to Google OAuth consent screen
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Authentication]
 *     description: Handle Google OAuth callback and redirect to frontend
 *     responses:
 *       302:
 *         description: Redirect to frontend with authentication result
 */

// Authentication routes
router.post('/login', authController.login);
router.post('/register', authController.uploadMiddleware, authController.register);
router.put('/profile', verifyToken, authController.uploadMiddleware, authController.updateProfile);

// Google OAuth Routes
router.get('/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/auth/google/failure' 
    }),
    authController.googleAuthSuccess
);

router.get('/google/failure', authController.googleAuthFailure);

// Link Google account to existing user
router.post('/link-google', verifyToken, authController.linkGoogleAccount);

module.exports = router;