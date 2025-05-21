const db = require("../models");
const User = db.user;
const Etudiant = db.etudiant;
const Entreprise = db.entreprise;
const Stage = db.stage;
const Candidature = db.candidature;
const { Op } = require("sequelize");

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nom', 'prenom', 'email', 'role', 'dateInscription', 'actif']
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Activer ou désactiver un utilisateur
exports.toggleUserActivation = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    await user.update({ actif: !user.actif });
    
    res.status(200).json({ 
      message: `Utilisateur ${user.actif ? 'activé' : 'désactivé'} avec succès`,
      status: user.actif
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir les statistiques des stages
exports.getStageStats = async (req, res) => {
  try {
    // Statistiques des stages par statut
    const stageStats = await Stage.findAll({
      attributes: [
        'status',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });
    
    // Statistiques des candidatures par statut
    const candidatureStats = await Candidature.findAll({
      attributes: [
        'status',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });
    
    // Nombre total d'étudiants et d'entreprises
    const etudiantCount = await Etudiant.count();
    const entrepriseCount = await Entreprise.count();
    
    // Stages sans candidature
    const stagesSansCandidature = await Stage.count({
      where: {
        id: {
          [Op.notIn]: db.sequelize.literal('(SELECT DISTINCT stageId FROM candidatures)')
        }
      }
    });
    
    res.status(200).json({
      stageStats,
      candidatureStats,
      etudiantCount,
      entrepriseCount,
      stagesSansCandidature
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Détails d'un utilisateur spécifique
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'nom', 'prenom', 'email', 'role', 'dateInscription', 'actif']
    });
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    let details = { ...user.toJSON() };
    
    if (user.role === 'etudiant') {
      const etudiant = await Etudiant.findOne({ where: { userId: user.id } });
      if (etudiant) {
        details.etudiant = etudiant;
        
        // Récupérer les candidatures de l'étudiant
        const candidatures = await Candidature.findAll({
          where: { etudiantId: etudiant.id },
          include: [{
            model: Stage,
            as: 'stage',
            attributes: ['id', 'titre', 'dateDebut', 'dateFin', 'status']
          }]
        });
        
        details.candidatures = candidatures;
      }
    } else if (user.role === 'entreprise') {
      const entreprise = await Entreprise.findOne({ where: { userId: user.id } });
      if (entreprise) {
        details.entreprise = entreprise;
        
        // Récupérer les stages proposés par l'entreprise
        const stages = await Stage.findAll({
          where: { entrepriseId: entreprise.id },
          attributes: ['id', 'titre', 'dateDebut', 'dateFin', 'status'],
          include: [{
            model: Candidature,
            as: 'candidatures',
            attributes: ['id', 'status', 'datePostulation']
          }]
        });
        
        details.stages = stages;
      }
    }
    
    res.status(200).json(details);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Affectation d'une entreprise à un étudiant (suggestion)
exports.affecterEntreprise = async (req, res) => {
  try {
    const { etudiantId, entrepriseId } = req.body;
    
    const etudiant = await Etudiant.findByPk(etudiantId);
    if (!etudiant) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }
    
    const entreprise = await Entreprise.findByPk(entrepriseId);
    if (!entreprise) {
      return res.status(404).json({ message: "Entreprise non trouvée" });
    }
    
    // Récupérer un stage disponible de cette entreprise
    const stage = await Stage.findOne({
      where: {
        entrepriseId: entreprise.id,
        status: 'disponible'
      }
    });
    
    if (!stage) {
      return res.status(404).json({ message: "Aucun stage disponible pour cette entreprise" });
    }
    
    await Candidature.create({
      etudiantId: etudiant.id,
      stageId: stage.id,
      entrepriseId: entreprise.id,
      status: 'en_attente',
      commentaireEntreprise: 'Affectation suggérée par l\'administration',
      datePostulation: new Date()
    });
    
    res.status(201).json({ 
      message: "Étudiant affecté à l'entreprise avec succès",
      stageId: stage.id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};