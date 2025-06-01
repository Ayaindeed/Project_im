module.exports = (sequelize, Sequelize) => {
  const Stage = sequelize.define("stage", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titre: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    dateDebut: {  // Sans accent
      type: Sequelize.DATE,
      allowNull: false
    },
    dateFin: {
      type: Sequelize.DATE,
      allowNull: false
    },status: {
      type: Sequelize.ENUM('disponible', 'en_cours', 'termine'),
      defaultValue: 'disponible'
    },
    entrepriseId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'entreprises',
        key: 'id'
      }
    },    commentaire: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  });

  return Stage;
};