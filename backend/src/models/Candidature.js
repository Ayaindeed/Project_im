module.exports = (sequelize, Sequelize) => {
  const Candidature = sequelize.define("candidature", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    stageId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'stages',
        key: 'id'
      }
    },
    etudiantId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'etudiants',
        key: 'id'
      }
    },
    entrepriseId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'entreprises',
        key: 'id'
      }
    },
    datePostulation: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },    status: {
      type: Sequelize.ENUM('en_attente', 'accepté', 'refusé'),
      defaultValue: 'en_attente'
    },
    commentaireEntreprise: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  });

  return Candidature;
};