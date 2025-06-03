const db = require('./src/models');

async function syncDatabase() {
  try {
    console.log('🔄 Synchronisation de la base de données...');
    
    // Tester la connexion
    await db.sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie');
    
    // Synchroniser tous les modèles avec alter: true pour ajouter les colonnes manquantes
    await db.sequelize.sync({ alter: true });
    console.log('✅ Base de données synchronisée avec succès');
    
    // Vérifier la structure de la table users
    const [results] = await db.sequelize.query("DESCRIBE users");
    console.log('\n📋 Structure de la table users:');
    console.table(results);
    
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
  } finally {
    await db.sequelize.close();
  }
}

syncDatabase();
