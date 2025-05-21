const db = require("../models");
const User = db.user;
const Tuteur = db.tuteur;
const Entreprise = db.entreprise;
const bcrypt = require("bcryptjs");

// Créer un tuteur (par une entreprise)
exports.createTuteur = async (req, res) => {
  try {
    const entreprise = await Entreprise.findOne({
      where: { userId: req.userId }
    });

    if (!entreprise) {
      return res.status(404).json({ message: "Profil entreprise non trouvé" });
    }

    // Créer le compte utilisateur du tuteur
    const user = await User.create({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      motdepasse: bcrypt.hashSync(req.body.motdepasse, 8),
      role: "entreprise", // Le tuteur a également le rôle entreprise
      actif: true
    });

    // Créer le profil tuteur lié à l'entreprise
    await Tuteur.create({
      userId: user.id,
      entrepriseId: entreprise.id,
      fonction: req.body.fonction
    });

    res.status(201).json({ message: "Tuteur créé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer tous les tuteurs d'une entreprise
exports.getTuteurs = async (req, res) => {
  try {
    const entreprise = await Entreprise.findOne({
      where: { userId: req.userId }
    });

    if (!entreprise) {
      return res.status(404).json({ message: "Profil entreprise non trouvé" });
    }

    const tuteurs = await Tuteur.findAll({
      where: { entrepriseId: entreprise.id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'nom', 'prenom', 'email', 'actif']
      }]
    });

    res.status(200).json(tuteurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modifier un tuteur
exports.updateTuteur = async (req, res) => {
  try {
    const entreprise = await Entreprise.findOne({
      where: { userId: req.userId }
    });

    if (!entreprise) {
      return res.status(404).json({ message: "Profil entreprise non trouvé" });
    }

    const tuteur = await Tuteur.findOne({
      where: {
        id: req.params.id,
        entrepriseId: entreprise.id
      }
    });

    if (!tuteur) {
      return res.status(404).json({ message: "Tuteur non trouvé" });
    }

    // Mettre à jour la fonction du tuteur
    await tuteur.update({
      fonction: req.body.fonction || tuteur.fonction
    });

    // Si des informations utilisateur sont fournies, mettre à jour également
    if (req.body.nom || req.body.prenom || req.body.email) {
      const user = await User.findByPk(tuteur.userId);
      
      await user.update({
        nom: req.body.nom || user.nom,
        prenom: req.body.prenom || user.prenom,
        email: req.body.email || user.email
      });
    }

    res.status(200).json({ message: "Tuteur mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un tuteur
exports.deleteTuteur = async (req, res) => {
  try {
    const entreprise = await Entreprise.findOne({
      where: { userId: req.userId }
    });

    if (!entreprise) {
      return res.status(404).json({ message: "Profil entreprise non trouvé" });
    }

    const tuteur = await Tuteur.findOne({
      where: {
        id: req.params.id,
        entrepriseId: entreprise.id
      }
    });

    if (!tuteur) {
      return res.status(404).json({ message: "Tuteur non trouvé" });
    }

    const userId = tuteur.userId;

    // Supprimer le profil tuteur
    await tuteur.destroy();

    // Désactiver le compte utilisateur
    await User.update(
      { actif: false },
      { where: { id: userId } }
    );

    res.status(200).json({ message: "Tuteur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};