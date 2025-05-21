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
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Non autorisé!" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
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

module.exports = {
  verifyToken,
  authorize
};