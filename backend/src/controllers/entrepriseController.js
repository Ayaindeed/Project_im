const db = require("../models");
const Stage = db.stage;
const Candidature = db.candidature;
const User = db.user;
const Etudiant = db.etudiant;
const Notification = db.notification;

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

        // Créer une notification pour l'étudiant
        let notificationTitre, notificationMessage, notificationType;
          if (status === 'accepté') {
            notificationTitre = '🎉 Candidature acceptée !';
            notificationMessage = `Félicitations ! Votre candidature pour le stage "${candidature.stage.titre}" a été acceptée.${commentaire ? ' Commentaire: ' + commentaire : ''}`;
            notificationType = 'acceptee';
        } else if (status === 'refusé') {
            notificationTitre = '📋 Candidature refusée';
            notificationMessage = `Votre candidature pour le stage "${candidature.stage.titre}" n'a pas été retenue.${commentaire ? ' Commentaire: ' + commentaire : ''}`;
            notificationType = 'refusee';
        }

        if (notificationTitre) {
            await Notification.create({
                etudiantId: candidature.etudiant.id,
                candidatureId: candidature.id,
                titre: notificationTitre,
                message: notificationMessage,
                type: notificationType
            });
        }

        // Récupérer les statistiques mises à jour pour la réponse temps réel
        const stats = await getUpdatedStats(req.user.entrepriseId);

        res.json({
            success: true,
            message: 'Candidature traitée avec succès',
            data: candidature,
            stats: stats // Inclure les statistiques mises à jour
        });
    } catch (error) {
        console.error('Error processing application:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du traitement de la candidature'
        });
    }
};

// Fonction utilitaire pour récupérer les statistiques mises à jour
const getUpdatedStats = async (entrepriseId) => {
    try {
        const totalStages = await Stage.count({
            where: { entrepriseId }
        });
        
        const candidaturesEnAttente = await Candidature.count({
            where: { 
                entrepriseId, 
                status: 'en_attente' 
            }
        });
        
        const candidaturesAcceptees = await Candidature.count({
            where: { 
                entrepriseId, 
                status: 'accepté' 
            }
        });
        
        const candidaturesRefusees = await Candidature.count({
            where: { 
                entrepriseId, 
                status: 'refusé' 
            }
        });
        
        const stagesActifs = await Stage.count({
            where: { 
                entrepriseId,
                status: 'en_cours' 
            }
        });

        return {
            totalStages,
            candidaturesEnAttente,
            candidaturesAcceptees,
            candidaturesRefusees,
            stagesActifs
        };
    } catch (error) {
        console.error('Error fetching updated stats:', error);
        return null;
    }
};

const getEntrepriseStats = async (req, res) => {
    try {
        const stats = await getUpdatedStats(req.user.entrepriseId);
        
        if (!stats) {
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des statistiques'
            });
        }
        
        res.json({
            success: true,
            data: stats
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