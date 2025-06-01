const db = require("../models");
const User = db.user;
const Etudiant = db.etudiant;
const Candidature = db.candidature;
const Stage = db.stage;
const Entreprise = db.entreprise;
const { Op } = require("sequelize");
const fs = require('fs');
const path = require('path');

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
      // Delete uploaded files if they exist
      if (req.files) {
        Object.values(req.files).forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
      return res.status(404).json({ message: "Profil étudiant non trouvé" });
    }    // Récupérer le stageId depuis les paramètres de l'URL ou le corps de la requête
    const stageId = req.params.stageId || req.body.stageId;
    
    const stage = await Stage.findByPk(stageId);
    if (!stage) {
      // Delete uploaded files if they exist
      if (req.files) {
        Object.values(req.files).forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
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
      // Delete uploaded files if they exist
      if (req.files) {
        Object.values(req.files).forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
      return res.status(400).json({ message: "Vous avez déjà postulé à ce stage" });
    }

    // Enregistrer les chemins des fichiers
    let cvPath = etudiant.cv;
    let lettreMotivationPath = etudiant.lettreMotivation;

    if (req.files) {
      if (req.files.cv) {
        cvPath = '/uploads/' + path.basename(req.files.cv[0].path);
      }
      if (req.files.lettreMotivation) {
        lettreMotivationPath = '/uploads/' + path.basename(req.files.lettreMotivation[0].path);
      }

      // Mettre à jour le profil de l'étudiant avec les nouveaux chemins de documents
      await etudiant.update({
        cv: cvPath,
        lettreMotivation: lettreMotivationPath
      });
    }

    // Créer la candidature
    const candidature = await Candidature.create({
      etudiantId: etudiant.id,
      stageId: stage.id,
      entrepriseId: stage.entrepriseId,
      status: 'en_attente',
      datePostulation: new Date()
    });

    res.status(201).json({ 
      message: "Candidature soumise avec succès",
      data: candidature
    });  } catch (err) {
    // Supprimer les fichiers téléchargés s'ils existent en cas d'erreur
    if (req.files) {
      Object.values(req.files).forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    console.error('Error submitting application:', err);
    res.status(500).json({ 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
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