const db = require("../models");
const Stage = db.stage;
const Entreprise = db.entreprise;
const User = db.user;
const { Op } = require("sequelize");

// Récupérer tous les stages disponibles (pour les étudiants)
exports.getAllStages = async (req, res) => {
  try {
    const stages = await Stage.findAll({
      where: { status: 'disponible' },
      include: [
        {
          model: Entreprise,
          as: 'entreprise',
          attributes: ['id', 'nom', 'secteur'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'email']
          }]
        }
      ]
    });
    res.status(200).json(stages);
  } catch (error) {
    console.error("Erreur lors de la récupération des stages:", error);
    res.status(500).json({ message: error.message });
  }
};
// Récupérer un stage par ID
exports.getStageById = async (req, res) => {
  try {
    const stage = await Stage.findByPk(req.params.id, {
      include: [
        {
          model: Entreprise,
          as: 'entreprise',
          attributes: ['id', 'nom', 'secteur'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'email']
          }]
        }
      ]
    });
    if (!stage) {
      return res.status(404).json({ message: "Stage non trouvé" });
    }
    res.status(200).json(stage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouveau stage
exports.createStage = async (req, res) => {  try {
    const {
      titre,
      description,
      dateDebut,
      dateFin,
      commentaire
    } = req.body;

    const entreprise = await Entreprise.findOne({
      where: { userId: req.userId }
    });

    if (!entreprise) {
      return res.status(404).json({ message: "Entreprise non trouvée" });
    }

    // Créer l'objet de données du stage
    const stageData = {
      titre,
      description,
      dateDebut,
      dateFin,
      commentaire,
      entrepriseId: entreprise.id,
      status: 'disponible'
    };// Pas besoin d'ajouter de champs supplémentaires

    const stage = await Stage.create(stageData);

    res.status(201).json({
      success: true,
      message: "Stage créé avec succès",
      data: stage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Une erreur est survenue lors de la création du stage"
    });
  }
};