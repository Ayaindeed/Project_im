const db = require("../models");
const User = db.user;
const Etudiant = db.etudiant;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
