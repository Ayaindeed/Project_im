const db = require('./backend/src/models');

async function testConnection() {
    try {
        console.log('Testing database connection...');
        await db.sequelize.authenticate();
        console.log('✅ Database connection successful!');
        
        // Simple query to check constraints
        const result = await db.sequelize.query("SHOW TABLES");
        console.log('Tables found:', result[0].length);
        
        await db.sequelize.close();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Error details:', error);
    }
}

testConnection();
