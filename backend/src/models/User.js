module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: Sequelize.STRING,
      allowNull: false
    },
    prenom: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },    motdepasse: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.ENUM('etudiant', 'entreprise', 'admin'),
      allowNull: false
    },
    dateInscription: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    actif: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  });

  return User;
};