const bcrypt = require('bcryptjs');
const db = require('./src/models');
const { sequelize } = db;

// Récupération des modèles
const User = db.user;
const Etudiant = db.etudiant;
const Entreprise = db.entreprise;
const Stage = db.stage;
const Candidature = db.candidature;
const Tuteur = db.tuteur;

// Fonction principale de seeding
async function seedDatabase() {
  try {
    console.log('🌱 Début du seeding de la base de données...');
    
    // Synchroniser la base de données (supprime et recrée toutes les tables)
    await sequelize.sync({ force: true });
    console.log('✅ Base de données synchronisée');

    // ========== CREATION DES UTILISATEURS ==========
    console.log('👥 Création des utilisateurs...');
    
    // Admin
    const adminPassword = await bcrypt.hash('pwd@', 10);
    const admin = await User.create({
      nom: 'Walid',
      prenom: 'Admin',
      email: 'walid@admin.ma',
      motdepasse: adminPassword,
      role: 'admin',
      dateInscription: new Date('2025-01-15'),
      actif: true
    });
    console.log('✓ Admin créé: walid@admin.ma');

    // ========== CREATION DES ÉTUDIANTS ==========
    console.log('🎓 Création des étudiants...');

    // Étudiant spécifique Aya (comme demandé)
    const ayaPassword = await bcrypt.hash('pwd@@', 10);
    const ayaUser = await User.create({
      nom: 'Riffi',
      prenom: 'Aya',
      email: 'aya@contact.me',
      motdepasse: ayaPassword,
      role: 'etudiant',
      dateInscription: new Date('2025-02-10'),
      actif: true
    });

    const ayaEtudiant = await Etudiant.create({
      userId: ayaUser.id,
      niveau: 'Master 2',
      filiere: 'Cybersécurité',
      cv: '../frontend/src/assets/cv1.pdf',
      lettreMotivation: '../frontend/src/assets/lettre1.pdf'
    });
    console.log('✓ Étudiant créé: aya@contact.me');

    // Autres étudiants
    const etudiantsData = [
      { 
        nom: 'Bennani', 
        prenom: 'Fatima', 
        email: 'fatima.bennani@etudiant.ma', 
        password: 'Student2025@', 
        niveau: 'Master 2', 
        filiere: 'Informatique' 
      },
      { 
        nom: 'El Alami', 
        prenom: 'Youssef', 
        email: 'youssef.elalami@etudiant.ma', 
        password: 'Youssef123!', 
        niveau: 'Master 1', 
        filiere: 'Génie Logiciel' 
      },
      { 
        nom: 'Idrissi', 
        prenom: 'Aicha', 
        email: 'aicha.idrissi@etudiant.ma', 
        password: 'Aicha2025#', 
        niveau: 'Licence 3', 
        filiere: 'Développement Web' 
      },
      { 
        nom: 'Tazi', 
        prenom: 'Omar', 
        email: 'omar.tazi@etudiant.ma', 
        password: 'Omar456$', 
        niveau: 'Master 1', 
        filiere: 'Data Science' 
      },
      { 
        nom: 'Chaoui', 
        prenom: 'Karim', 
        email: 'karim.chaoui@etudiant.ma', 
        password: 'Karim789!', 
        niveau: 'Licence 3', 
        filiere: 'Intelligence Artificielle' 
      }
    ];

    for (const data of etudiantsData) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await User.create({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        motdepasse: hashedPassword,
        role: 'etudiant',
        dateInscription: new Date('2025-03-01'),
        actif: true
      });      await Etudiant.create({
        userId: user.id,
        niveau: data.niveau,
        filiere: data.filiere,
        cv: '../frontend/src/assets/cv1.pdf',
        lettreMotivation: '../frontend/src/assets/lettre1.pdf'
      });
    }
    console.log(`✓ ${etudiantsData.length} étudiants supplémentaires créés`);

    // ========== CREATION DES ENTREPRISES ==========
    console.log('🏢 Création des entreprises...');
    
    // 1. Leyton Maroc (comme demandé)
    const leytonPassword = await bcrypt.hash('vo@@@$e', 10);
    const leytonUser = await User.create({
      nom: 'Ben-Nis',
      prenom: 'Contact',
      email: 'ben-nis@leyton.ma',
      motdepasse: leytonPassword,
      role: 'entreprise',
      dateInscription: new Date('2025-01-05'),
      actif: true
    });

    const leytonEntreprise = await Entreprise.create({
      userId: leytonUser.id,
      nom: 'Leyton Maroc',
      secteur: 'Conseil & Financement Innovation',
      adresse: 'Twin Center, Tour B, Boulevard Zerktouni, Casablanca 20100',
      siteWeb: 'https://www.leyton.ma',
      description: 'Cabinet de conseil international spécialisé dans l\'optimisation de la performance des entreprises par le financement de l\'innovation.'
    });
    console.log('✓ Entreprise Leyton créée');

    // 2. DXC Technology (comme demandé)
    const dxcPassword = await bcrypt.hash('DXC2025!', 10);
    const dxcUser = await User.create({
      nom: 'Mansouri',
      prenom: 'Hassan',
      email: 'stages@dxc.ma',
      motdepasse: dxcPassword,
      role: 'entreprise',
      dateInscription: new Date('2025-01-10'),
      actif: true
    });

    const dxcEntreprise = await Entreprise.create({
      userId: dxcUser.id,
      nom: 'DXC Technology Maroc',
      secteur: 'Services IT & Consulting',
      adresse: 'Twin Center, Tour A, Boulevard Zerktouni, Casablanca 20100',
      siteWeb: 'https://www.dxc.technology',
      description: 'Leader mondial des services technologiques, DXC Technology aide les entreprises à moderniser leurs opérations et à transformer leurs activités IT.'
    });
    console.log('✓ Entreprise DXC créée');

    // 3. Alten Maroc (comme demandé)
    const altenPassword = await bcrypt.hash('Alten456#', 10);
    const altenUser = await User.create({
      nom: 'Benjelloun',
      prenom: 'Amina',
      email: 'recrutement@alten.ma',
      motdepasse: altenPassword,
      role: 'entreprise',
      dateInscription: new Date('2025-01-15'),
      actif: true
    });

    const altenEntreprise = await Entreprise.create({
      userId: altenUser.id,
      nom: 'Alten Maroc',
      secteur: 'Ingénierie & Consulting',
      adresse: 'Parc Technopolis, Immeuble B1, Rabat 10100',
      siteWeb: 'https://www.alten.ma',
      description: 'Groupe international d\'ingénierie et de conseil en technologies, leader dans l\'accompagnement de la stratégie de développement de ses clients.'
    });
    console.log('✓ Entreprise Alten créée');

    // Autres entreprises marocaines
    const entreprisesData = [
      {
        nom: 'OCP Group',
        user: {
          nom: 'Kabbaj',
          prenom: 'Salma',
          email: 'recrutement@ocpgroup.ma',
          password: 'OCP2025@'
        },
        secteur: 'Industrie Minière & Chimique',
        adresse: 'Hay Hassani, Casablanca 20200',
        siteWeb: 'https://www.ocpgroup.ma',
        description: 'Leader mondial sur le marché du phosphate et premier producteur mondial d\'engrais phosphatés.'
      },
      {
        nom: 'Maroc Telecom',
        user: {
          nom: 'Alaoui',
          prenom: 'Mohammed',
          email: 'stages@iam.ma',
          password: 'IAM2025!'
        },
        secteur: 'Télécommunications',
        adresse: 'Avenue Annakhil, Hay Riad, Rabat 10100',
        siteWeb: 'https://www.iam.ma',
        description: 'Principal opérateur de télécommunications au Maroc, proposant des services de téléphonie fixe, mobile, Internet et télévision par ADSL.'
      }
    ];

    for (const data of entreprisesData) {
      const hashedPassword = await bcrypt.hash(data.user.password, 10);
      const user = await User.create({
        nom: data.user.nom,
        prenom: data.user.prenom,
        email: data.user.email,
        motdepasse: hashedPassword,
        role: 'entreprise',
        dateInscription: new Date('2025-02-01'),
        actif: true
      });

      await Entreprise.create({
        userId: user.id,
        nom: data.nom,
        secteur: data.secteur,
        adresse: data.adresse,
        siteWeb: data.siteWeb,
        description: data.description
      });
    }
    console.log(`✓ ${entreprisesData.length} entreprises supplémentaires créées`);

    // ========== CREATION DES STAGES ==========
    console.log('📝 Création des offres de stage...');
    
    // Stages pour Leyton
    const stagesLeyton = [
      {
        titre: 'Consultant en Optimisation Fiscale',
        description: 'Rejoignez notre équipe de consultants pour accompagner les entreprises dans l\'optimisation de leurs avantages fiscaux. Vous participerez à la réalisation d\'audits et à l\'identification d\'opportunités d\'économies fiscales pour nos clients.',
        dateDebut: new Date('2025-07-01'),
        dateFin: new Date('2025-12-31'),
        commentaire: 'Opportunité unique dans le conseil en financement innovation',
        status: 'disponible'
      },
      {
        titre: 'Analyste CIR/CII Junior',
        description: 'Participez à l\'identification et à la valorisation des projets de recherche et développement pouvant être éligibles au Crédit d\'Impôt Recherche et au Crédit d\'Impôt Innovation.',
        dateDebut: new Date('2025-06-15'),
        dateFin: new Date('2025-09-15'),
        commentaire: 'Formation complète en financement de l\'innovation',
        status: 'disponible'
      }
    ];

    for (const data of stagesLeyton) {
      await Stage.create({
        ...data,
        entrepriseId: leytonEntreprise.id
      });
    }
    console.log(`✓ ${stagesLeyton.length} stages Leyton créés`);

    // Stages pour DXC
    const stagesDXC = [
      {
        titre: 'Consultant IT Junior - Transformation Digitale',
        description: 'Rejoignez nos équipes de consultants pour accompagner les clients dans leur transformation digitale. Vous contribuerez à l\'analyse des besoins, à la définition de la roadmap et à l\'implémentation des solutions technologiques.',
        dateDebut: new Date('2025-07-01'),
        dateFin: new Date('2025-12-31'),
        commentaire: 'Excellent stage pour découvrir le conseil IT',
        status: 'disponible'
      },
      {
        titre: 'Développeur Cloud Solutions',
        description: 'Participez au développement et à la migration d\'applications vers le cloud. Vous travaillerez sur des technologies telles que AWS, Azure ou Google Cloud, et contribuerez à la conception et au déploiement de solutions cloud natives.',
        dateDebut: new Date('2025-06-15'),
        dateFin: new Date('2025-09-15'),
        commentaire: 'Connaissance des technologies cloud appréciée',
        status: 'disponible'
      }
    ];

    for (const data of stagesDXC) {
      await Stage.create({
        ...data,
        entrepriseId: dxcEntreprise.id
      });
    }
    console.log(`✓ ${stagesDXC.length} stages DXC créés`);

    // Stages pour Alten
    const stagesAlten = [
      {
        titre: 'Ingénieur Systèmes Embarqués',
        description: 'Développement de logiciels pour systèmes embarqués dans le secteur automobile et aéronautique. Vous travaillerez sur des projets innovants en utilisant des langages comme C/C++ et des microcontrôleurs.',
        dateDebut: new Date('2025-07-15'),
        dateFin: new Date('2025-10-15'),
        commentaire: 'Formation en électronique ou informatique industrielle requise',
        status: 'disponible'
      },
      {
        titre: 'Consultant Functional Testing',
        description: 'Participez aux projets de validation et de test de systèmes complexes. Vous élaborerez des plans de test, rédigerez des cas de test et exécuterez des campagnes de tests fonctionnels.',
        dateDebut: new Date('2025-08-01'),
        dateFin: new Date('2025-11-01'),
        commentaire: 'Rigueur et attention aux détails indispensables',
        status: 'disponible'
      }
    ];

    for (const data of stagesAlten) {
      await Stage.create({
        ...data,
        entrepriseId: altenEntreprise.id
      });
    }
    console.log(`✓ ${stagesAlten.length} stages Alten créés`);

    // ========== CREATION DES CANDIDATURES ==========
    console.log('📊 Création des candidatures...');
    
    // Récupérer le premier stage de Leyton pour la candidature d'Aya
    const stageLeyton = await Stage.findOne({
      where: { entrepriseId: leytonEntreprise.id }
    });

    // Candidature d'Aya pour le stage Leyton
    if (stageLeyton) {
      await Candidature.create({
        etudiantId: ayaEtudiant.id,
        stageId: stageLeyton.id,
        entrepriseId: leytonEntreprise.id,
        status: 'en_attente',
        datePostulation: new Date('2025-05-10')
      });
      console.log('✓ Candidature d\'Aya pour Leyton créée');
    }

    // ========== CREATION DES TUTEURS ==========
    console.log('👨‍🏫 Création des tuteurs...');
      // Créer des utilisateurs pour les tuteurs
    const tuteur1User = await User.create({
      nom: 'El Fassi',
      prenom: 'Nadia',
      email: 'nadia.elfassi@faculty.ma',
      motdepasse: await bcrypt.hash('Tuteur2025!', 10),
      role: 'admin', // les tuteurs ont souvent un rôle d'admin ou similaire
      dateInscription: new Date('2025-01-05'),
      actif: true
    });
    
    const tuteur2User = await User.create({
      nom: 'Belkadi',
      prenom: 'Rachid',
      email: 'rachid.belkadi@faculty.ma',
      motdepasse: await bcrypt.hash('Tuteur456#', 10),
      role: 'admin',
      dateInscription: new Date('2025-01-10'),
      actif: true
    });

    // Assigner les tuteurs aux entreprises
    await Tuteur.create({
      userId: tuteur1User.id,
      entrepriseId: leytonEntreprise.id,
      fonction: 'Responsable des Stages'
    });
    
    await Tuteur.create({
      userId: tuteur2User.id,
      entrepriseId: dxcEntreprise.id,
      fonction: 'Encadrant Technique'
    });    console.log(`✓ 2 tuteurs créés`);

    // ========== STATISTIQUES FINALES ==========
    const userCount = await User.count();
    const etudiantCount = await Etudiant.count();
    const entrepriseCount = await Entreprise.count();
    const stageCount = await Stage.count();
    const candidatureCount = await Candidature.count();
    const tuteurCount = await Tuteur.count();

    console.log('\n🎉 SEEDING TERMINÉ AVEC SUCCÈS !');
    console.log(`📊 STATISTIQUES:
    - ${userCount} utilisateurs au total
    - ${etudiantCount} étudiants
    - ${entrepriseCount} entreprises
    - ${stageCount} offres de stage
    - ${candidatureCount} candidatures
    - ${tuteurCount} tuteurs`);

    console.log('\n🔑 COMPTES CRÉÉS:');
    console.log('   Admin: walid@admin.ma / pwd@');
    console.log('   Étudiant: aya@contact.me / pwd@@');
    console.log('   Leyton: ben-nis@leyton.ma / vo@@@$e');
    console.log('   DXC: stages@dxc.ma / DXC2025!');
    console.log('   Alten: recrutement@alten.ma / Alten456#');

    console.log('\n▶️ Vous pouvez maintenant démarrer l\'application et vous connecter avec ces comptes.');

  } catch (error) {
    console.error('❌ ERREUR DURANT LE SEEDING:', error);
    throw error;
  }
}

// Exécution de la fonction de seeding et gestion de la fermeture de la connexion
seedDatabase()
  .then(() => {
    console.log('✅ Seed terminé, fermeture de la connexion...');
    setTimeout(() => {
      console.log('🔒 Connexion fermée, processus terminé.');
      process.exit(0);
    }, 1000);
  })
  .catch(err => {
    console.error('❌ ERREUR FATALE:', err);
    process.exit(1);
  });
