# InternMatch

Cette application permet la gestion complète du processus de stages, avec trois espaces distincts:
1. **Espace Étudiant**: Consulter et postuler aux offres de stages
2. **Espace Entreprise**: Gérer les offres de stages et les candidatures reçues
3. **Espace Administration**: Administrer les utilisateurs et visualiser les statistiques


### Installation du Backend

```bash
cd backend
npm install
npm start
```

### Installation du Frontend

```bash
cd frontend
npm install
npm start
```

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

