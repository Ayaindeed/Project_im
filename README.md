# Application de Gestion de Stages

Cette application permet la gestion complète du processus de stages, avec trois espaces distincts:
1. **Espace Étudiant**: Consulter et postuler aux offres de stages
2. **Espace Entreprise**: Gérer les offres de stages et les candidatures reçues
3. **Espace Administration**: Administrer les utilisateurs et visualiser les statistiques

## Prérequis

- Node.js (v14+ recommandé)
- MySQL

## Installation

### Configuration de la base de données

1. Créez une base de données MySQL pour l'application
2. Configurez les informations de connexion dans le fichier `.env` du backend:

```
DB_HOST=localhost
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=db_stages
JWT_SECRET=votre_secret_jwt
CLIENT_URL=http://localhost:3000
```

### Installation du Backend

```bash
cd backend
npm install
npm start
```

Le serveur backend démarrera sur le port 8080 par défaut.

### Installation du Frontend

```bash
cd frontend
npm install
npm start
```

L'application frontend démarrera sur le port 3000.

## Structure des utilisateurs

### Espace Étudiant
- Consultation des offres de stages disponibles
- Soumission de candidatures avec CV et lettre de motivation
- Suivi de l'état des candidatures

### Espace Entreprise
- Publication et gestion des offres de stages
- Traitement des candidatures reçues (accepter/refuser)
- Visualisation des statistiques des stages proposés

### Espace Administration
- Gestion des comptes utilisateurs
- Activation/désactivation des comptes
- Consultation des statistiques globales
- Affectation des étudiants aux entreprises

## Notes techniques

- Le backend est développé avec Express.js et Sequelize (ORM)
- Le frontend est développé avec React
- L'authentification est gérée via JSON Web Tokens (JWT)

## Routes principales

### API Backend

- `/api/auth/*` - Routes d'authentification
- `/api/admin/*` - Routes d'administration
- `/api/entreprise/*` - Routes pour les entreprises
- `/api/etudiant/*` - Routes pour les étudiants
- `/api/stage/*` - Routes pour les stages

### Frontend

- `/login` et `/register` - Authentification
- `/stages` - Liste des stages disponibles (étudiants)
- `/mes-candidatures` - Candidatures soumises (étudiants)
- `/entreprise-stages` - Gestion des stages (entreprises)
- `/entreprise-candidatures` - Candidatures reçues (entreprises)
- `/admin-dashboard` - Tableau de bord (administrateurs)
- `/admin-users` - Gestion des utilisateurs (administrateurs)
