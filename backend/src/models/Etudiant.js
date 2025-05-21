module.exports = (sequelize, Sequelize) => {
  const Etudiant = sequelize.define("etudiant", {
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
    niveau: {
      type: Sequelize.STRING,
      allowNull: false
    },
    filiere: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cv: {
      type: Sequelize.STRING,
      allowNull: true
    },
    lettreMotivation: {
      type: Sequelize.STRING,
      allowNull: true
    }
  });

  return Etudiant;
};