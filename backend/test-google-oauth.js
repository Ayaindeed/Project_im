#!/usr/bin/env node

/**
 * Script de test pour Google OAuth
 * Vérifie que les credentials sont correctement configurés
 */

require('dotenv').config();

const REQUIRED_ENV_VARS = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'SESSION_SECRET',
    'FRONTEND_URL'
];

console.log('🔍 Vérification de la configuration Google OAuth...\n');

// Vérifier les variables d'environnement
let configValid = true;

REQUIRED_ENV_VARS.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.includes('your-') || value.includes('here')) {
        console.log(`❌ ${varName}: Non configuré ou valeur par défaut`);
        configValid = false;
    } else {
        console.log(`✅ ${varName}: Configuré`);
    }
});

if (!configValid) {
    console.log('\n❌ Configuration incomplète!');
    console.log('\nÉtapes à suivre:');
    console.log('1. Aller sur https://console.cloud.google.com/');
    console.log('2. Créer un projet ou sélectionner un projet existant');
    console.log('3. Activer Google+ API et People API');
    console.log('4. Configurer l\'écran de consentement OAuth');
    console.log('5. Créer des identifiants OAuth 2.0');
    console.log('6. Ajouter http://localhost:3001/api/auth/google/callback comme URI de redirection');
    console.log('7. Copier Client ID et Client Secret dans .env');
    process.exit(1);
}

console.log('\n✅ Configuration Google OAuth OK!');

// Tester la connexion aux APIs Google
console.log('\n🔍 Test des endpoints OAuth...');

const axios = require('axios');

async function testGoogleOAuth() {
    try {
        // Test de base pour voir si les credentials sont valides
        const response = await axios.get('http://localhost:3001/api/auth/google');
        console.log('✅ Endpoint /api/auth/google accessible');
    } catch (error) {
        if (error.response && error.response.status === 302) {
            console.log('✅ Redirection vers Google OAuth détectée');
        } else {
            console.log('❌ Erreur lors du test de l\'endpoint:', error.message);
        }
    }
}

// Vérifier si le serveur est démarré
const serverUrl = 'http://localhost:3001';
axios.get(serverUrl + '/api-docs.json')
    .then(() => {
        console.log('✅ Serveur backend actif');
        return testGoogleOAuth();
    })
    .catch(() => {
        console.log('❌ Serveur backend non accessible');
        console.log('Démarrez le serveur avec: npm start');
    });
