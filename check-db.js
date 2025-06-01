const { Sequelize } = require('sequelize');

// Create database connection
const sequelize = new Sequelize('projet_stage', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

async function checkDatabaseData() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check users
    const [users] = await sequelize.query("SELECT id, nom, prenom, email, role FROM users WHERE role = 'entreprise' LIMIT 5");
    console.log('\nCompany users:');
    console.log(users);

    // Check entreprises
    const [entreprises] = await sequelize.query("SELECT * FROM entreprises LIMIT 5");
    console.log('\nEntreprises:');
    console.log(entreprises);

    // Check stages
    const [stages] = await sequelize.query("SELECT * FROM stages LIMIT 5");
    console.log('\nStages:');
    console.log(stages);

    // Check candidatures
    const [candidatures] = await sequelize.query("SELECT * FROM candidatures LIMIT 5");
    console.log('\nCandidatures:');
    console.log(candidatures);

    // Check detailed candidature data with joins
    const [detailedCandidatures] = await sequelize.query(`
      SELECT 
        c.id as candidature_id,
        c.status,
        c.datePostulation,
        s.id as stage_id,
        s.titre as stage_titre,
        s.entrepriseId,
        u.nom as etudiant_nom,
        u.prenom as etudiant_prenom
      FROM candidatures c
      JOIN stages s ON c.stageId = s.id
      JOIN etudiants e ON c.etudiantId = e.id
      JOIN users u ON e.userId = u.id
      LIMIT 10
    `);
    console.log('\nDetailed candidatures:');
    console.log(detailedCandidatures);

  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabaseData();
