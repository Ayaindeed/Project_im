const db = require("../models");
const User = db.user;
const Entreprise = db.entreprise;
const Candidature = db.candidature;
const Stage = db.stage;
const Etudiant = db.etudiant;
const { Op } = require("sequelize");

// Récupérer le profil d'une entreprise
exports.getProfile = async (req, res) => {
  try {
    const entreprise = await Entreprise.findOne({
      where: { userId: req.userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'nom', 'prenom', 'email']
      }]
    });

    if (!entreprise) {
      return res.status(404).json({ message: "Profil entreprise non trouvé" });
    }

    res.status(200).json(entreprise);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour le profil d'une entreprise
exports.updateProfile = async (req, res) => {
  try {
    const entreprise = await Entreprise.findOne({
      where: { userId: req.userId }
    });

    if (!entreprise) {
      return res.status(404).json({ message: "Profil entreprise non trouvé" });
    }

    await entreprise.update({
      nom: req.body.nom || entreprise.nom,
      secteur: req.body.secteur || entreprise.secteur,
      adresse: req.body.adresse || entreprise.adresse,
      siteWeb: req.body.siteWeb || entreprise.siteWeb,
      description: req.body.description || entreprise.description
    });

    res.status(200).json({ message: "Profil entreprise mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer tous les stages d'une entreprise
exports.getMesStages = async (req, res) => {
  try {
    const entreprise = await Entreprise.findOne({
      where: { userId: req.userId }
    });

    if (!entreprise) {
      return res.status(404).json({ message: "Profil entreprise non trouvé" });
    }

    const stages = await Stage.findAll({
      where: { entrepriseId: entreprise.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(stages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer un nouveau stage
exports.createStage = async (req, res) => {
  try {
    const entreprise = await Entreprise.findOne({
      where: { userId: req.userId }
    });

    if (!entreprise) {
      return res.status(404).json({ message: "Profil entreprise non trouvé" });
    }

    const stage = await Stage.create({
      titre: req.body.titre,
      description: req.body.description,
      dateDebut: req.body.dateDebut,
      dateFin: req.body.dateFin,
      status: 'disponible',
      commentaire: req.body.commentaire || '',
      entrepriseId: entreprise.id
    });

    res.status(201).json({ 
      message: "Stage créé avec succès",
      stageId: stage.id 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour un stage
exports.updateStage = async (req, res) => {
  try {
    const entreprise = await Entreprise.findOne({
      where: { userId: req.userId }
    });

    if (!entreprise) {
      return res.status(404).json({ message: "Profil entreprise non trouvé" });
    }

    const stage = await Stage.findOne({
      where: {
        id: req.params.id,
        entrepriseId: entreprise.id
      }
    });

    if (!stage) {
      return res.status(404).json({ message: "Stage non trouvé ou vous n'êtes pas autorisé à le modifier" });
    }

    await stage.update({
      titre: req.body.titre || stage.titre,
      description: req.body.description || stage.description,
      dateDebut: req.body.dateDebut || stage.dateDebut,
      dateFin: req.body.dateFin || stage.dateFin,
      status: req.body.status || stage.status,
      commentaire: req.body.commentaire || stage.commentaire
    });

    res.status(200).json({ message: "Stage mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer les candidatures pour un stage spécifique
exports.getCandidatures = async (req, res) => {
  try {
    const entreprise = await Entreprise.findOne({
      where: { userId: req.userId }
    });

    if (!entreprise) {
      return res.status(404).json({ message: "Profil entreprise non trouvé" });
    }

    const stage = await Stage.findOne({
      where: {
        id: req.params.stageId,
        entrepriseId: entreprise.id
      }
    });

    if (!stage) {
      return res.status(404).json({ message: "Stage non trouvé ou vous n'êtes pas autorisé à le consulter" });
    }

    const candidatures = await Candidature.findAll({
      where: { stageId: stage.id },
      include: [{
        model: Etudiant,
        as: 'etudiant',
        include: [{
          model: User,
          as: 'user',
          attributes: ['nom', 'prenom', 'email']
        }]
      }]
    });

    res.status(200).json(candidatures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Traiter une candidature (accepter ou refuser)
exports.traiterCandidature = async (req, res) => {
  try {
    const { candidatureId, status, commentaire } = req.body;

    if (!['validé', 'refusé'].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const entreprise = await Entreprise.findOne({
      where: { userId: req.userId }
    });

    if (!entreprise) {
      return res.status(404).json({ message: "Profil entreprise non trouvé" });
    }

    const candidature = await Candidature.findOne({
      where: {
        id: candidatureId,
        entrepriseId: entreprise.id
      }
    });

    if (!candidature) {
      return res.status(404).json({ message: "Candidature non trouvée ou vous n'êtes pas autorisé à la traiter" });
    }

    await candidature.update({
      status: status,
      commentaireEntreprise: commentaire || candidature.commentaireEntreprise
    });

    // Si la candidature est acceptée, mettre à jour le statut du stage
    if (status === 'validé') {
      await Stage.update(
        { status: 'pourvu' },
        { where: { id: candidature.stageId } }
      );
      
      // Refuser automatiquement les autres candidatures pour ce stage
      await Candidature.update(
        { 
          status: 'refusé',
          commentaireEntreprise: 'Un autre candidat a été retenu pour ce stage.'
        },
        { 
          where: { 
            stageId: candidature.stageId,
            id: { [Op.ne]: candidatureId },
            status: 'en_attente'
          } 
        }
      );
    }

    res.status(200).json({ message: `Candidature ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};