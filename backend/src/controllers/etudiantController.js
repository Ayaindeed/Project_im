const db = require("../models");
const User = db.user;
const Etudiant = db.etudiant;
const Candidature = db.candidature;
const Stage = db.stage;
const Entreprise = db.entreprise;
const { Op } = require("sequelize");

exports.getProfile = async (req, res) => {
  try {
    const etudiant = await Etudiant.findOne({
      where: { userId: req.userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'nom', 'prenom', 'email']
      }]
    });

    if (!etudiant) {
      return res.status(404).json({ message: "Profil étudiant non trouvé" });
    }

    res.status(200).json(etudiant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour le profil d'un étudiant
exports.updateProfile = async (req, res) => {
  try {
    const etudiant = await Etudiant.findOne({
      where: { userId: req.userId }
    });

    if (!etudiant) {
      return res.status(404).json({ message: "Profil étudiant non trouvé" });
    }

    await etudiant.update({
      niveau: req.body.niveau || etudiant.niveau,
      filiere: req.body.filiere || etudiant.filiere,
      cv: req.body.cv || etudiant.cv,
      lettreMotivation: req.body.lettreMotivation || etudiant.lettreMotivation
    });

    res.status(200).json({ message: "Profil étudiant mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer les candidatures d'un étudiant
exports.getMesCandidatures = async (req, res) => {
  try {
    const etudiant = await Etudiant.findOne({
      where: { userId: req.userId }
    });

    if (!etudiant) {
      return res.status(404).json({ message: "Profil étudiant non trouvé" });
    }

    const candidatures = await Candidature.findAll({
      where: { etudiantId: etudiant.id },
      include: [
        {
          model: Stage,
          as: 'stage',
          attributes: ['id', 'titre', 'description', 'dateDebut', 'dateFin']
        },
        {
          model: Entreprise,
          as: 'entreprise',
          attributes: ['id', 'nom', 'secteur']
        }
      ]
    });

    res.status(200).json(candidatures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Soumettre une candidature à un stage
exports.postulerStage = async (req, res) => {
  try {
    const etudiant = await Etudiant.findOne({
      where: { userId: req.userId }
    });

    if (!etudiant) {
      return res.status(404).json({ message: "Profil étudiant non trouvé" });
    }

    const stage = await Stage.findByPk(req.body.stageId);
    
    if (!stage) {
      return res.status(404).json({ message: "Stage non trouvé" });
    }

    // Vérifier si l'étudiant a déjà postulé à ce stage
    const candidatureExistante = await Candidature.findOne({
      where: {
        etudiantId: etudiant.id,
        stageId: stage.id
      }
    });

    if (candidatureExistante) {
      return res.status(400).json({ message: "Vous avez déjà postulé à ce stage" });
    }

    // Créer la candidature
    await Candidature.create({
      etudiantId: etudiant.id,
      stageId: stage.id,
      entrepriseId: stage.entrepriseId,
      status: 'en_attente',
      datePostulation: new Date()
    });

    res.status(201).json({ message: "Candidature soumise avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rechercher des stages disponibles
exports.rechercherStages = async (req, res) => {
  try {
    const { titre, entreprise, dateDebut, dateFin } = req.query;
    let whereClause = { status: 'disponible' };

    if (titre) {
      whereClause.titre = { [Op.like]: `%${titre}%` };
    }

    const stages = await Stage.findAll({
      where: whereClause,
      include: [{
        model: Entreprise,
        as: 'entreprise',
        attributes: ['id', 'nom', 'secteur'],
        where: entreprise ? { nom: { [Op.like]: `%${entreprise}%` } } : undefined
      }]
    });

    res.status(200).json(stages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};