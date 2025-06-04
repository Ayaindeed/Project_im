# Guide de Test - Configuration Google OAuth ✅

## 🎉 Configuration Google OAuth Complétée !

Votre application est maintenant configurée avec Google OAuth. Voici ce qui a été testé et fonctionne :

### ✅ Tests Réussis
- **Backend accessible** : Le serveur backend fonctionne sur le port 3001
- **Routes Google OAuth** : Les routes d'authentification Google sont opérationnelles
- **Base de données** : Connexion établie et modèles synchronisés

### ⚠️ URI de Redirection Google Cloud
Il y a actuellement un problème d'URI de redirection. Pour le résoudre :

1. **Allez sur [Google Cloud Console](https://console.cloud.google.com/)**
2. **Sélectionnez votre projet "internmatch"**
3. **Naviguez vers APIs & Services > Credentials**
4. **Modifiez votre Client ID OAuth 2.0**
5. **Dans "Authorized redirect URIs", ajoutez :**
   ```
   http://localhost:3001/api/auth/google/callback
   ```
6. **Sauvegardez les modifications**

### 🧪 Tests à Effectuer

#### 1. Test de Google OAuth dans le navigateur
```
Ouvrez : http://localhost:3000/login
Cliquez sur "Se connecter avec Google"
Vérifiez la redirection vers Google
```

#### 2. Test du système de notifications
1. Connectez-vous en tant qu'étudiant
2. Postulez à un stage
3. Connectez-vous en tant qu'entreprise
4. Acceptez/Refusez la candidature
5. Vérifiez que l'étudiant reçoit une notification

#### 3. Test des statistiques en temps réel
1. Connectez-vous en tant qu'admin
2. Vérifiez les statistiques du dashboard
3. Traitez des candidatures depuis un autre navigateur
4. Vérifiez que les statistiques se mettent à jour automatiquement

### 🚀 Démarrage Rapide

#### Frontend (Terminal 1)
```powershell
cd "c:\Users\hp\Downloads\Project_\internship-management-app\frontend"
npm start
```

#### Backend (Terminal 2) 
```powershell
cd "c:\Users\hp\Downloads\Project_\internship-management-app\backend"
npm start
```

### 📋 Comptes de Test

#### Admin
- Email : admin@test.com
- Mot de passe : admin123
- Code d'enregistrement : 14

#### Étudiant
- Créez un nouveau compte étudiant ou utilisez Google OAuth

#### Entreprise  
- Créez un nouveau compte entreprise

### 🔧 Fonctionnalités Implémentées

1. **Système de notifications en temps réel**
   - Polling toutes les 3 secondes
   - Événements inter-composants
   - Badge de comptage des notifications

2. **Statistiques synchronisées**
   - Dashboard admin avec statistiques détaillées
   - Mise à jour en temps réel des candidatures
   - Compteurs dynamiques (en attente/acceptées/refusées)

3. **Google OAuth**
   - Configuration complète avec votre projet "internmatch" 
   - Redirection sécurisée
   - Intégration avec le système d'authentification existant

### 🐛 En cas de problème

1. **Vérifiez que les deux serveurs sont en cours d'exécution**
2. **Vérifiez les URI de redirection Google**
3. **Consultez les logs de la console du navigateur**
4. **Vérifiez la connexion à la base de données MySQL**

### 📞 Support
Si vous rencontrez des problèmes, vérifiez :
- Les logs du serveur backend
- La console du navigateur pour les erreurs frontend
- La configuration Google Cloud Console
