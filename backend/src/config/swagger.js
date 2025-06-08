const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuration Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API InternMatch',
    version: '1.0.0',
    description: 'API REST pour la gestion des stages, candidatures et utilisateurs',
    contact: {
      name: 'Aya&Nisrine',
      email: 'aya.mechouahiriffi@usmba.ac.ma'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001/api',
      description: 'Serveur de développement'
    },
    {
      url: 'https://your-production-url.com/api',
      description: 'Serveur de production'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT pour l\'authentification'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'ID unique de l\'utilisateur' },
          nom: { type: 'string', description: 'Nom de famille' },
          prenom: { type: 'string', description: 'Prénom' },
          email: { type: 'string', format: 'email', description: 'Adresse email' },
          role: { 
            type: 'string', 
            enum: ['admin', 'etudiant', 'entreprise'], 
            description: 'Rôle de l\'utilisateur' 
          },
          dateInscription: { type: 'string', format: 'date-time' },
          actif: { type: 'boolean', description: 'Statut d\'activation du compte' }
        },
        required: ['nom', 'prenom', 'email', 'role']
      },
      Etudiant: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer', description: 'ID de l\'utilisateur associé' },
          niveau: { type: 'string', description: 'Niveau d\'études (Licence, Master, etc.)' },
          filiere: { type: 'string', description: 'Filière d\'études' },
          cv: { type: 'string', description: 'Nom du fichier CV' },
          lettreMotivation: { type: 'string', description: 'Nom du fichier lettre de motivation' }
        }
      },
      Entreprise: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer', description: 'ID de l\'utilisateur associé' },
          nom: { type: 'string', description: 'Nom de l\'entreprise' },
          secteur: { type: 'string', description: 'Secteur d\'activité' },
          adresse: { type: 'string', description: 'Adresse de l\'entreprise' },
          siteWeb: { type: 'string', description: 'Site web de l\'entreprise' },
          description: { type: 'string', description: 'Description de l\'entreprise' }
        }
      },
      Stage: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          titre: { type: 'string', description: 'Titre du stage' },
          description: { type: 'string', description: 'Description détaillée du stage' },
          dateDebut: { type: 'string', format: 'date', description: 'Date de début du stage' },
          dateFin: { type: 'string', format: 'date', description: 'Date de fin du stage' },
          status: { 
            type: 'string', 
            enum: ['disponible', 'en_cours', 'termine'], 
            description: 'Statut du stage' 
          },
          entrepriseId: { type: 'integer', description: 'ID de l\'entreprise' },
          commentaire: { type: 'string', description: 'Commentaires additionnels' }
        },
        required: ['titre', 'description', 'dateDebut', 'dateFin', 'entrepriseId']
      },
      Candidature: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          stageId: { type: 'integer', description: 'ID du stage' },
          etudiantId: { type: 'integer', description: 'ID de l\'étudiant' },
          entrepriseId: { type: 'integer', description: 'ID de l\'entreprise' },
          datePostulation: { type: 'string', format: 'date-time', description: 'Date de candidature' },
          status: { 
            type: 'string', 
            enum: ['en_attente', 'validé', 'refusé'], 
            description: 'Statut de la candidature' 
          },
          commentaireEntreprise: { type: 'string', description: 'Commentaire de l\'entreprise' }
        }
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', description: 'Email de connexion' },
          motdepasse: { type: 'string', description: 'Mot de passe' }
        },
        required: ['email', 'motdepasse']
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          token: { type: 'string', description: 'Token JWT' },
          user: { $ref: '#/components/schemas/User' }
        }
      },
      RegisterRequest: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          prenom: { type: 'string' },
          email: { type: 'string', format: 'email' },
          motdepasse: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['etudiant', 'entreprise'], default: 'etudiant' },
          niveau: { type: 'string', description: 'Requis si role = etudiant' },
          filiere: { type: 'string', description: 'Requis si role = etudiant' }
        },
        required: ['nom', 'prenom', 'email', 'motdepasse']
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', default: false },
          message: { type: 'string' },
          error: { type: 'string' }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

// Options pour swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js'
  ]
};

// Générer la spécification Swagger
const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerSpec,
  swaggerUi: require('swagger-ui-express')
};
