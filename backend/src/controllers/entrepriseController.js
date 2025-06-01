const db = require("../models");
const Stage = db.stage;
const Candidature = db.candidature;
const User = db.user;
const Etudiant = db.etudiant;

const getEntrepriseStages = async (req, res) => {
    try {
        console.log('getEntrepriseStages called for user:', req.user);
        console.log('entrepriseId:', req.user.entrepriseId);
        
        const stages = await Stage.findAll({
            where: { entrepriseId: req.user.entrepriseId },
            include: [{
                model: Candidature,
                as: 'candidatures',
                include: [{
                    model: Etudiant,
                    as: 'etudiant',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['nom', 'prenom', 'email']
                    }]
                }]
            }]
        });
        
        console.log('Found stages:', stages.length);
        stages.forEach((stage, index) => {
            console.log(`Stage ${index + 1}:`, {
                id: stage.id,
                titre: stage.titre,
                candidaturesCount: stage.candidatures?.length || 0
            });
        });
        
        res.json(stages);
    } catch (error) {
        console.error('Error fetching enterprise stages:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la récupération des stages' 
        });
    }
};

const getEntrepriseCandidatures = async (req, res) => {
    try {
        const candidatures = await Candidature.findAll({
            include: [
                {
                    model: Stage,
                    as: 'stage',
                    where: { entrepriseId: req.user.entrepriseId }
                },
                {
                    model: Etudiant,
                    as: 'etudiant',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['nom', 'prenom', 'email']
                    }]
                }
            ]
        });
        res.json(candidatures);
    } catch (error) {
        console.error('Error fetching candidatures:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la récupération des candidatures' 
        });
    }
};

const createStage = async (req, res) => {
    try {
        const { titre, description, dateDebut, dateFin, commentaire } = req.body;
        
        // Créer l'objet de données du stage
        const stageData = {
            titre,
            description,
            dateDebut,
            dateFin,
            commentaire,
            entrepriseId: req.user.entrepriseId,
            status: 'disponible'
        };// Pas besoin d'ajouter de champs supplémentaires

        const stage = await Stage.create(stageData);

        res.status(201).json({
            success: true,
            message: 'Stage créé avec succès',
            data: stage
        });
    } catch (error) {
        console.error('Error creating stage:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du stage'
        });
    }
};

const traiterCandidature = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, commentaire } = req.body;

        const candidature = await Candidature.findByPk(id, {
            include: [{
                model: Stage,
                as: 'stage',
                where: { entrepriseId: req.user.entrepriseId }
            }]
        });

        if (!candidature) {
            return res.status(404).json({
                success: false,
                message: 'Candidature non trouvée'
            });
        }

        await candidature.update({
            status,
            commentaireEntreprise: commentaire,
            dateTraitement: new Date()
        });

        res.json({
            success: true,
            message: 'Candidature traitée avec succès',
            data: candidature
        });
    } catch (error) {
        console.error('Error processing application:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du traitement de la candidature'
        });
    }
};

const getEntrepriseStats = async (req, res) => {
    try {
        // Récupérer l'ID de l'entreprise depuis l'utilisateur authentifié
        const entrepriseId = req.user.entrepriseId;
        
        // Nombre total de stages proposés par l'entreprise
        const totalStages = await Stage.count({
            where: { entrepriseId }
        });
        
        // Nombre de candidatures en attente pour les stages de l'entreprise
        const candidaturesEnAttente = await Candidature.count({
            where: { 
                entrepriseId, 
                status: 'en_attente' 
            }
        });
        
        // Nombre de stages actifs (en cours)
        const stagesActifs = await Stage.count({
            where: { 
                entrepriseId,
                status: 'en_cours' 
            }
        });
        
        res.json({
            totalStages,
            candidaturesEnAttente,
            stagesActifs
        });
        
    } catch (error) {
        console.error('Error fetching enterprise stats:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques'
        });
    }
};

module.exports = {
    getEntrepriseStages,
    getEntrepriseCandidatures,
    createStage,
    traiterCandidature,
    getEntrepriseStats
};