const db = require("../models");
const User = db.user;
const Stage = db.stage;
const Candidature = db.candidature;
const { Op } = require("sequelize");

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'nom', 'prenom', 'email', 'role', 'dateInscription', 'actif']
        });
        res.status(200).json(users);
    } catch (err) {
        console.error('Error getting users:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get stage statistics
exports.getStageStats = async (req, res) => {
    try {
        const [stageStats, candidatureStats, totalStages, totalCandidatures] = await Promise.all([
            Stage.findAll({
                attributes: [
                    'status',
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
                ],
                group: ['status']
            }),
            Candidature.findAll({
                attributes: [
                    'status',
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
                ],
                group: ['status']
            }),
            Stage.count(),
            Candidature.count()
        ]);

        const formattedStats = {
            disponible: 0,
            enCours: 0,
            termine: 0,
            total: totalStages,
            totalCandidatures: totalCandidatures,
            candidaturesParStatut: {
                en_attente: 0,
                validé: 0,
                refusé: 0
            }
        };

        stageStats.forEach(stat => {
            formattedStats[stat.status] = parseInt(stat.get('count'));
        });

        candidatureStats.forEach(stat => {
            formattedStats.candidaturesParStatut[stat.status] = parseInt(stat.get('count'));
            formattedStats.totalCandidatures += parseInt(stat.get('count'));
        });

        res.status(200).json(formattedStats);
    } catch (err) {
        console.error('Error getting stats:', err);
        res.status(500).json({ message: err.message });
    }
};

// Toggle user activation
exports.toggleUserActivation = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        user.actif = !user.actif;
        await user.save();

        res.status(200).json({
            success: true,
            message: `Compte ${user.actif ? 'activé' : 'désactivé'} avec succès`,
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role,
                actif: user.actif
            }
        });
    } catch (err) {
        console.error('Error toggling user activation:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get detailed user information
exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        
        let userDetails = { ...user.toJSON() };
        
        // Get role-specific details
        if (user.role === 'etudiant') {
            const etudiant = await db.etudiant.findOne({ where: { userId: id } });
            if (etudiant) {
                userDetails.etudiant = etudiant;
                
                // Get student's applications
                const candidatures = await Candidature.findAll({
                    where: { etudiantId: etudiant.id },
                    include: [{
                        model: Stage,
                        as: 'stage',
                        attributes: ['id', 'titre', 'description', 'dateDebut', 'dateFin', 'status']
                    }]
                });
                
                userDetails.candidatures = candidatures;
            }
        } else if (user.role === 'entreprise') {
            const entreprise = await db.entreprise.findOne({ where: { userId: id } });
            if (entreprise) {
                userDetails.entreprise = entreprise;
                
                // Get company's internships
                const stages = await Stage.findAll({
                    where: { entrepriseId: entreprise.id },
                    include: [{
                        model: Candidature,
                        as: 'candidatures',
                        attributes: ['id', 'status', 'datePostulation'],
                        include: [{
                            model: db.etudiant,
                            as: 'etudiant',
                            attributes: ['id', 'niveau', 'filiere'],
                            include: [{
                                model: User,
                                as: 'user',
                                attributes: ['nom', 'prenom', 'email']
                            }]
                        }]
                    }]
                });
                
                userDetails.stages = stages;
            }
        }
        
        res.status(200).json(userDetails);
    } catch (err) {
        console.error('Error getting user details:', err);
        res.status(500).json({ message: err.message });
    }
};