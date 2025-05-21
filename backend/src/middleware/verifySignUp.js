const db = require("../models");
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
  // Email
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).json({
        message: "Erreur! Cet email est déjà utilisé!"
      });
      return;
    }
    next();
  });
};

checkRoleExists = (req, res, next) => {
  if (req.body.role) {
    if (!["etudiant", "entreprise", "admin"].includes(req.body.role)) {
      res.status(400).json({
        message: "Erreur! Ce rôle n'existe pas = " + req.body.role
      });
      return;
    }
  }
  
  next();
};

const verifySignUp = {
  checkDuplicateEmail,
  checkRoleExists
};

module.exports = verifySignUp;