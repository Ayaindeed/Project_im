const db = require("../models");
const User = db.user;
const Etudiant = db.etudiant;
const Entreprise = db.entreprise;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const jwtSecret = process.env.JWT_SECRET || "your_secret_key";

// Inscription générique (étudiant ou entreprise)
exports.register = async (req, res) => {
  try {
    // Vérifier si l'email existe déjà
    const existing = await User.findOne({ where: { email: req.body.email } });
    if (existing) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Créer l'utilisateur
    const user = await User.create({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      motdepasse: bcrypt.hashSync(req.body.motdepasse, 8),
      role: req.body.role
    });

    // Créer le profil selon le rôle
    if (req.body.role === "etudiant") {
      await Etudiant.create({
        userId: user.id,
        niveau: req.body.niveau,
        filiere: req.body.filiere,
        cv: req.body.cv || null,
        lettreMotivation: req.body.lettreMotivation || null
      });
    } else if (req.body.role === "entreprise") {
      await Entreprise.create({
        userId: user.id,
        nom: req.body.nomEntreprise || req.body.nom,
        secteur: req.body.secteur,
        adresse: req.body.adresse,
        siteWeb: req.body.siteWeb || null,
        description: req.body.description || null
      });
    }

    res.status(201).json({ message: "Utilisateur enregistré avec succès!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    const passwordIsValid = bcrypt.compareSync(req.body.motdepasse, user.motdepasse);
    if (!passwordIsValid) {
      return res.status(401).json({ accessToken: null, message: "Mot de passe invalide!" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: 86400 });
    res.status(200).json({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      accessToken: token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};