const db = require("../models");
const User = db.user;
const Etudiant = db.etudiant;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require('multer');
const path = require('path');
const passport = require('../config/passport'); // Import passport config

// Configuration du stockage pour les fichiers uploadés
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if ((file.fieldname === 'cv' || file.fieldname === 'lettreMotivation') && file.mimetype === 'application/pdf') {
            cb(null, true);
        } else if (file.fieldname === 'cv' || file.fieldname === 'lettreMotivation') {
            cb(new Error('Seuls les fichiers PDF sont acceptés'), false);
        } else {
            cb(null, true);
        }
    }
});

exports.registerAdmin = async (req, res) => {
    try {
        const { nom, prenom, email, motdepasse } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }

        // Create admin user with required fields only
        const admin = await User.create({
            nom,
            prenom,
            email,
            motdepasse: await bcrypt.hash(motdepasse, 10),
            role: 'admin',
            dateInscription: new Date(),
            actif: true
        });

        res.status(201).json({
            success: true,
            message: 'Compte administrateur créé avec succès',
            data: {
                id: admin.id,
                nom: admin.nom,
                prenom: admin.prenom,
                email: admin.email,
                role: admin.role,
                dateInscription: admin.dateInscription,
                actif: admin.actif
            }
        });
    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du compte administrateur'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, motdepasse } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        const validPassword = await bcrypt.compare(motdepasse, user.motdepasse);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Mot de passe incorrect"
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la connexion"
        });
    }
};

exports.register = async (req, res) => {
    try {
        const { nom, prenom, email, motdepasse, role = 'etudiant', niveau, filiere } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }

        // Create user
        const hashedPassword = await bcrypt.hash(motdepasse, 10);
        const user = await User.create({
            nom,
            prenom,
            email,
            motdepasse: hashedPassword,
            role,
            dateInscription: new Date(),
            actif: true
        });

        // If student, create student profile
        if (role === 'etudiant') {
            await Etudiant.create({
                userId: user.id,
                niveau,
                filiere
            });
        }

        res.status(201).json({
            success: true,
            message: 'Inscription réussie',
            data: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'inscription"
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId; // depuis le middleware d'authentification
        const { nom, prenom, email } = req.body;
        
        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Préparer les données à mettre à jour (seulement les champs autorisés du modèle User)
        const updateData = {};
        if (nom) updateData.nom = nom;
        if (prenom) updateData.prenom = prenom;
        if (email) updateData.email = email;

        // Mettre à jour l'utilisateur
        await user.update(updateData);

        // Si l'utilisateur est un étudiant, gérer les champs spécifiques aux étudiants
        if (user.role === 'etudiant') {
            const { niveau, filiere } = req.body;
            const Etudiant = require('../models').etudiant;
            
            const etudiantData = {};
            if (niveau) etudiantData.niveau = niveau;
            if (filiere) etudiantData.filiere = filiere;
            
            // Gérer les fichiers (CV et lettre de motivation)
            if (req.files) {
                if (req.files.cv) etudiantData.cv = req.files.cv[0].filename;
                if (req.files.lettreMotivation) etudiantData.lettreMotivation = req.files.lettreMotivation[0].filename;
            }
            
            // Mettre à jour ou créer l'enregistrement étudiant
            if (Object.keys(etudiantData).length > 0) {
                await Etudiant.upsert({ userId, ...etudiantData });
            }
        }

        // Retourner les données mises à jour (sans le mot de passe)
        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['motdepasse'] }
        });

        res.json({
            success: true,
            message: 'Profil mis à jour avec succès',
            data: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du profil'
        });
    }
};

exports.uploadMiddleware = upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'lettreMotivation', maxCount: 1 }
]);

// Google OAuth Success Handler
exports.googleAuthSuccess = async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: req.user.id,
                email: req.user.email,
                role: req.user.role 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Get user profile data
        let userProfile = { ...req.user.dataValues };
        delete userProfile.motdepasse; // Remove password from response

        // Redirect to frontend with token and user data
        const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(userProfile))}`;
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Google auth success error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
};

// Google OAuth Failure Handler
exports.googleAuthFailure = (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
};

// Link Google Account to existing user
exports.linkGoogleAccount = async (req, res) => {
    try {
        const userId = req.userId; // From JWT middleware
        const { googleId } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Check if Google ID is already linked to another account
        const existingGoogleUser = await User.findOne({ where: { googleId } });
        if (existingGoogleUser && existingGoogleUser.id !== userId) {
            return res.status(400).json({
                success: false,
                message: 'Ce compte Google est déjà lié à un autre utilisateur'
            });
        }

        // Link Google account
        user.googleId = googleId;
        await user.save();

        res.json({
            success: true,
            message: 'Compte Google lié avec succès'
        });
    } catch (error) {
        console.error('Error linking Google account:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la liaison du compte Google'
        });
    }
};
