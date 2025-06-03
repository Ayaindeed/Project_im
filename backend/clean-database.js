const db = require('./src/models');

async function cleanDatabase() {
    try {
        console.log('🧹 Nettoyage de la base de données...');
        
        // Synchronisation avec force pour nettoyer la structure
        await db.sequelize.sync({ force: true });
        
        console.log('✅ Base de données nettoyée et restructurée selon le modèle.');
        console.log('📋 Structure actuelle:');
        console.log('   - User: id, nom, prenom, email, motdepasse, role, dateInscription, actif');
        console.log('   - Etudiant: id, userId, niveau, filiere, cv, lettreMotivation');
        console.log('   - Autres tables: Entreprise, Stage, Candidature, Tuteur');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error);
        process.exit(1);
    }
}

cleanDatabase();
