module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define("notification", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    etudiantId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'etudiants',
        key: 'id'
      }
    },
    candidatureId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'candidatures',
        key: 'id'
      }
    },
    titre: {
      type: Sequelize.STRING,
      allowNull: false
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false
    },    type: {
      type: Sequelize.ENUM('info', 'acceptee', 'refusee', 'warning', 'error'),
      defaultValue: 'info'
    },
    lue: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    dateCreation: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });

  return Notification;
};
