module.exports = (sequelize, Sequelize) => {
  const Entreprise = sequelize.define("entreprise", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    nom: {
      type: Sequelize.STRING,
      allowNull: false
    },
    secteur: {
      type: Sequelize.STRING,
      allowNull: false
    },
    adresse: {
      type: Sequelize.STRING,
      allowNull: false
    },
    siteWeb: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  });

  return Entreprise;
};