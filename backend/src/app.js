const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport'); // Import passport config

// Load environment variables
dotenv.config();

const app = express();

// Session configuration (required for passport)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger configuration
const { swaggerSpec, swaggerUi } = require('./config/swagger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const etudiantRoutes = require('./routes/etudiantRoutes');
const entrepriseRoutes = require('./routes/entrepriseRoutes');
const stageRoutes = require('./routes/stageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Health check routes
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Backend is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/health/db', async (req, res) => {
    try {
        const { sequelize } = require('./models');
        await sequelize.authenticate();
        res.json({ 
            status: 'OK', 
            message: 'Database connection successful',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'ERROR', 
            message: 'Database connection failed',
            error: error.message 
        });
    }
});

// Use routes with proper prefixes
app.use('/api/auth', authRoutes);
app.use('/api/etudiant', etudiantRoutes);
app.use('/api/entreprise', entrepriseRoutes);
app.use('/api/stage', stageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Documentation - Gestion de Stages"
}));

// Route pour accéder au JSON de l'API
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Error handlers
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

module.exports = app;