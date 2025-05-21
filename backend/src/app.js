const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();

// Configuration des middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importer les routes existantes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const etudiantRoutes = require('./routes/etudiantRoutes');
const entrepriseRoutes = require('./routes/entrepriseRoutes');
const stageRoutes = require('./routes/stageRoutes');
const candidatureRoutes = require('./routes/candidatureRoutes');
const tuteurRoutes = require('./routes/tuteurRoutes');

// Utiliser les routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/etudiant', etudiantRoutes);
app.use('/api/entreprise', entrepriseRoutes);
app.use('/api/stages', stageRoutes);
app.use('/api/candidatures', candidatureRoutes);
app.use('/api/tuteurs', tuteurRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Erreur serveur',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const db = require('./models');
const PORT = process.env.PORT || 8080;

db.sequelize.sync({ alter: true }).then(() => {
  console.log('Base de données synchronisée');
  app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
  });
});

module.exports = app;