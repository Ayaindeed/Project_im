const dbConfig = require("../config/database.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect
    // pool is omitted, Sequelize will use defaults
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importer les modèles
db.user = require("./User.js")(sequelize, Sequelize);
db.etudiant = require("./Etudiant.js")(sequelize, Sequelize);
db.entreprise = require("./Entreprise.js")(sequelize, Sequelize);
db.stage = require("./Stage.js")(sequelize, Sequelize);
db.candidature = require("./Candidature.js")(sequelize, Sequelize);
db.tuteur = require("./Tuteur.js")(sequelize, Sequelize);

// Définir les relations
// User & Etudiant (One-to-One)
db.user.hasOne(db.etudiant, {
  foreignKey: 'userId',
  as: 'etudiant'
});
db.etudiant.belongsTo(db.user, {
  foreignKey: 'userId',
  as: 'user'
});

// User & Entreprise (One-to-One)
db.user.hasOne(db.entreprise, {
  foreignKey: 'userId',
  as: 'entreprise'
});
db.entreprise.belongsTo(db.user, {
  foreignKey: 'userId',
  as: 'user'
});

// User & Tuteur (One-to-One)
db.user.hasOne(db.tuteur, {
  foreignKey: 'userId',
  as: 'tuteur'
});
db.tuteur.belongsTo(db.user, {
  foreignKey: 'userId',
  as: 'user'
});

// Entreprise & Tuteur (One-to-Many)
db.entreprise.hasMany(db.tuteur, {
  foreignKey: 'entrepriseId',
  as: 'tuteurs'
});
db.tuteur.belongsTo(db.entreprise, {
  foreignKey: 'entrepriseId',
  as: 'entreprise'
});

// Entreprise & Stage (One-to-Many)
db.entreprise.hasMany(db.stage, {
  foreignKey: 'entrepriseId',
  as: 'stages'
});
db.stage.belongsTo(db.entreprise, {
  foreignKey: 'entrepriseId',
  as: 'entreprise'
});

// Candidature relations
db.etudiant.hasMany(db.candidature, {
  foreignKey: 'etudiantId',
  as: 'candidatures'
});
db.candidature.belongsTo(db.etudiant, {
  foreignKey: 'etudiantId',
  as: 'etudiant'
});

db.stage.hasMany(db.candidature, {
  foreignKey: 'stageId',
  as: 'candidatures'
});
db.candidature.belongsTo(db.stage, {
  foreignKey: 'stageId',
  as: 'stage'
});

db.entreprise.hasMany(db.candidature, {
  foreignKey: 'entrepriseId',
  as: 'candidatures'
});
db.candidature.belongsTo(db.entreprise, {
  foreignKey: 'entrepriseId',
  as: 'entreprise'
});

module.exports = db;