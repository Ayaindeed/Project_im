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
      include: [{
        model: Entreprise,
        as: 'entreprise',
        attributes: ['id', 'nom', 'secteur'],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'email']
                }]
              }]
            });
            res.status(200).json(stages);
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        };
// Récupérer un stage par ID
exports.getStageById = async (req, res) => {
  try {
    const stage = await Stage.findByPk(req.params.id);
    if (!stage) {
      return res.status(404).json({ message: "Stage non trouvé" });
    }
    res.json(stage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};