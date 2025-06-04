const db = require('./backend/src/models');
const { QueryTypes } = require('sequelize');

async function checkDatabaseConstraints() {
    try {
        console.log('🔍 VÉRIFICATION DES CONTRAINTES DE LA BASE DE DONNÉES MySQL');
        console.log('=' .repeat(70));
        
        // 1. Test de connexion à la base de données
        await db.sequelize.authenticate();
        console.log('✅ Connexion à la base de données établie\n');
        
        // 2. Obtenir le nom de la base de données
        const dbName = db.sequelize.config.database;
        console.log(`📋 Base de données: ${dbName}\n`);
        
        // 3. Lister toutes les tables
        console.log('📊 TABLES EXISTANTES:');
        console.log('-'.repeat(50));
        const tables = await db.sequelize.query(
            "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? ORDER BY TABLE_NAME",
            {
                replacements: [dbName],
                type: QueryTypes.SELECT
            }
        );
        
        tables.forEach((table, index) => {
            console.log(`${index + 1}. ${table.TABLE_NAME}`);
        });
        console.log();
        
        // 4. Vérifier les contraintes de clés étrangères
        console.log('🔗 CONTRAINTES DE CLÉS ÉTRANGÈRES:');
        console.log('-'.repeat(50));
        const foreignKeys = await db.sequelize.query(`
            SELECT 
                kcu.TABLE_NAME,
                kcu.COLUMN_NAME,
                kcu.CONSTRAINT_NAME,
                kcu.REFERENCED_TABLE_NAME,
                kcu.REFERENCED_COLUMN_NAME,
                rc.UPDATE_RULE,
                rc.DELETE_RULE
            FROM 
                INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
            JOIN 
                INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc 
                ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
            WHERE 
                kcu.TABLE_SCHEMA = ? 
                AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
            ORDER BY 
                kcu.TABLE_NAME, kcu.COLUMN_NAME
        `, {
            replacements: [dbName],
            type: QueryTypes.SELECT
        });
        
        if (foreignKeys.length === 0) {
            console.log('⚠️  Aucune contrainte de clé étrangère trouvée!');
        } else {
            console.log(`✅ ${foreignKeys.length} contrainte(s) de clé étrangère trouvée(s):\n`);
            
            foreignKeys.forEach((fk, index) => {
                console.log(`${index + 1}. Table: ${fk.TABLE_NAME}`);
                console.log(`   Colonne: ${fk.COLUMN_NAME}`);
                console.log(`   Référence: ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`);
                console.log(`   Contrainte: ${fk.CONSTRAINT_NAME}`);
                console.log(`   Règles: UPDATE=${fk.UPDATE_RULE}, DELETE=${fk.DELETE_RULE}`);
                console.log();
            });
        }
        
        // 5. Vérifier les contraintes UNIQUE
        console.log('🔑 CONTRAINTES UNIQUE:');
        console.log('-'.repeat(50));
        const uniqueConstraints = await db.sequelize.query(`
            SELECT 
                tc.TABLE_NAME,
                tc.CONSTRAINT_NAME,
                kcu.COLUMN_NAME
            FROM 
                INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
            JOIN 
                INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu 
                ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
            WHERE 
                tc.TABLE_SCHEMA = ? 
                AND tc.CONSTRAINT_TYPE = 'UNIQUE'
            ORDER BY 
                tc.TABLE_NAME, kcu.COLUMN_NAME
        `, {
            replacements: [dbName],
            type: QueryTypes.SELECT
        });
        
        if (uniqueConstraints.length === 0) {
            console.log('⚠️  Aucune contrainte UNIQUE trouvée!');
        } else {
            console.log(`✅ ${uniqueConstraints.length} contrainte(s) UNIQUE trouvée(s):\n`);
            
            uniqueConstraints.forEach((uc, index) => {
                console.log(`${index + 1}. Table: ${uc.TABLE_NAME}`);
                console.log(`   Colonne: ${uc.COLUMN_NAME}`);
                console.log(`   Contrainte: ${uc.CONSTRAINT_NAME}`);
                console.log();
            });
        }
        
        // 6. Vérifier les contraintes CHECK (MySQL 8.0+)
        console.log('✅ CONTRAINTES CHECK:');
        console.log('-'.repeat(50));
        try {
            const checkConstraints = await db.sequelize.query(`
                SELECT 
                    cc.TABLE_NAME,
                    cc.CONSTRAINT_NAME,
                    cc.CHECK_CLAUSE
                FROM 
                    INFORMATION_SCHEMA.CHECK_CONSTRAINTS cc
                JOIN 
                    INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc 
                    ON cc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
                WHERE 
                    tc.TABLE_SCHEMA = ?
                ORDER BY 
                    cc.TABLE_NAME
            `, {
                replacements: [dbName],
                type: QueryTypes.SELECT
            });
            
            if (checkConstraints.length === 0) {
                console.log('ℹ️  Aucune contrainte CHECK trouvée (normal si MySQL < 8.0)');
            } else {
                console.log(`✅ ${checkConstraints.length} contrainte(s) CHECK trouvée(s):\n`);
                
                checkConstraints.forEach((cc, index) => {
                    console.log(`${index + 1}. Table: ${cc.TABLE_NAME}`);
                    console.log(`   Contrainte: ${cc.CONSTRAINT_NAME}`);
                    console.log(`   Condition: ${cc.CHECK_CLAUSE}`);
                    console.log();
                });
            }
        } catch (error) {
            console.log('ℹ️  Contraintes CHECK non supportées (MySQL < 8.0)');
        }
        
        // 7. Vérifier les INDEX
        console.log('📇 INDEX:');
        console.log('-'.repeat(50));
        const indexes = await db.sequelize.query(`
            SELECT 
                TABLE_NAME,
                INDEX_NAME,
                COLUMN_NAME,
                NON_UNIQUE,
                INDEX_TYPE
            FROM 
                INFORMATION_SCHEMA.STATISTICS 
            WHERE 
                TABLE_SCHEMA = ? 
                AND INDEX_NAME != 'PRIMARY'
            ORDER BY 
                TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX
        `, {
            replacements: [dbName],
            type: QueryTypes.SELECT
        });
        
        if (indexes.length === 0) {
            console.log('⚠️  Aucun index trouvé!');
        } else {
            console.log(`✅ ${indexes.length} index trouvé(s):\n`);
            
            const groupedIndexes = {};
            indexes.forEach(idx => {
                const key = `${idx.TABLE_NAME}.${idx.INDEX_NAME}`;
                if (!groupedIndexes[key]) {
                    groupedIndexes[key] = {
                        table: idx.TABLE_NAME,
                        name: idx.INDEX_NAME,
                        unique: idx.NON_UNIQUE === 0,
                        type: idx.INDEX_TYPE,
                        columns: []
                    };
                }
                groupedIndexes[key].columns.push(idx.COLUMN_NAME);
            });
            
            Object.values(groupedIndexes).forEach((idx, index) => {
                console.log(`${index + 1}. Table: ${idx.table}`);
                console.log(`   Index: ${idx.name}`);
                console.log(`   Colonnes: ${idx.columns.join(', ')}`);
                console.log(`   Type: ${idx.type} ${idx.unique ? '(UNIQUE)' : ''}`);
                console.log();
            });
        }
        
        // 8. Analyser les relations Sequelize vs contraintes DB
        console.log('🔄 ANALYSE DES RELATIONS SEQUELIZE:');
        console.log('-'.repeat(50));
        
        const expectedRelations = [
            { table: 'etudiants', column: 'userId', references: 'users.id' },
            { table: 'entreprises', column: 'userId', references: 'users.id' },
            { table: 'tuteurs', column: 'userId', references: 'users.id' },
            { table: 'tuteurs', column: 'entrepriseId', references: 'entreprises.id' },
            { table: 'stages', column: 'entrepriseId', references: 'entreprises.id' },
            { table: 'candidatures', column: 'etudiantId', references: 'etudiants.id' },
            { table: 'candidatures', column: 'stageId', references: 'stages.id' },
            { table: 'candidatures', column: 'entrepriseId', references: 'entreprises.id' }
        ];
        
        console.log('Relations attendues selon les modèles Sequelize:');
        expectedRelations.forEach((rel, index) => {
            const found = foreignKeys.find(fk => 
                fk.TABLE_NAME === rel.table && 
                fk.COLUMN_NAME === rel.column &&
                `${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}` === rel.references
            );
            
            console.log(`${index + 1}. ${rel.table}.${rel.column} → ${rel.references} ${found ? '✅' : '❌'}`);
        });
        
        // 9. Résumé et recommandations
        console.log('\n' + '='.repeat(70));
        console.log('📊 RÉSUMÉ:');
        console.log(`• Tables: ${tables.length}`);
        console.log(`• Clés étrangères: ${foreignKeys.length}`);
        console.log(`• Contraintes UNIQUE: ${uniqueConstraints.length}`);
        console.log(`• Index: ${Object.keys(indexes.reduce((acc, idx) => {
            acc[`${idx.TABLE_NAME}.${idx.INDEX_NAME}`] = true;
            return acc;
        }, {})).length}`);
        
        // 10. Recommandations
        console.log('\n💡 RECOMMANDATIONS:');
        if (foreignKeys.length < expectedRelations.length) {
            console.log('⚠️  Certaines contraintes de clés étrangères semblent manquer.');
            console.log('   → Vérifiez que les relations Sequelize sont bien définies');
            console.log('   → Utilisez { force: true } lors du sync pour recréer les contraintes');
        }
        
        if (uniqueConstraints.length === 0) {
            console.log('⚠️  Aucune contrainte UNIQUE détectée.');
            console.log('   → Vérifiez les champs email, googleId qui devraient être uniques');
        }
        
        console.log('\n🚀 COMMANDES UTILES:');
        console.log('• Pour recréer les contraintes: node backend/sync-database.js');
        console.log('• Pour nettoyer la DB: node backend/clean-database.js');
        console.log('• Pour réinitialiser: node backend/seed-database.js');
        
    } catch (error) {
        console.error('❌ Erreur lors de la vérification des contraintes:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            console.log('\n💡 Suggestions:');
            console.log('• Vérifiez que MySQL est démarré');
            console.log('• Vérifiez les paramètres de connexion dans .env');
            console.log('• Vérifiez que la base de données existe');
        }
    } finally {
        await db.sequelize.close();
        console.log('\n🔒 Connexion fermée.');
    }
}

// Exécution du script
checkDatabaseConstraints()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('❌ Erreur fatale:', err);
        process.exit(1);
    });
