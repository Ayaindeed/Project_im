module.exports = (sequelize, Sequelize) => {
  const Tuteur = sequelize.define("tuteur", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
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
    fonction: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return Tuteur;
};