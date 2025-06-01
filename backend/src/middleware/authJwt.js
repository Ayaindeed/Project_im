const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

const jwtSecret = process.env.JWT_SECRET || "your_secret_key";

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Aucun token fourni!" });
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Non autorisé!" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    try {
      // Charger les informations supplémentaires de l'utilisateur en fonction du rôle
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      req.user = user;
      
      if (user.role === 'entreprise') {
        const entreprise = await db.entreprise.findOne({ where: { userId: user.id } });
        if (entreprise) {
          req.user.entrepriseId = entreprise.id;
        }
      } else if (user.role === 'etudiant') {
        const etudiant = await db.etudiant.findOne({ where: { userId: user.id } });
        if (etudiant) {
          req.user.etudiantId = etudiant.id;
        }
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors du chargement des données utilisateur" });
    }
  });
};

// Generic role check
const authorize = (roles = []) => {
  return (req, res, next) => {
    User.findByPk(req.userId).then(user => {
      if (!user || (roles.length && !roles.includes(user.role))) {
        return res.status(403).json({ message: "Accès refusé!" });
      }
      next();
    });
  };
};


const isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (!user || user.role !== 'admin') {
      res.status(403).json({
        message: "Accès refusé! Requiert les droits administrateur"
      });
      return;
    }
    next();
  });
};

const authJwt = {
  verifyToken,
  authorize,
  isAdmin
};

module.exports = authJwt;