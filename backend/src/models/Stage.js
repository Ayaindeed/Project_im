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
    dateDebut: {
      type: Sequelize.DATE,
      allowNull: false
    },
    dateFin: {
      type: Sequelize.DATE,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('disponible', 'pourvu', 'terminé', 'annulé'),
      defaultValue: 'disponible'
    },
    commentaire: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    entrepriseId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'entreprises',
        key: 'id'
      }
    }
  });

  return Stage;
};