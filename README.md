# 🦷 Cabinet Dentaire Smile - Dashboard Admin

Dashboard administrateur pour la gestion des rendez-vous du Cabinet Dentaire Smile.

## 📋 Fonctionnalités

- ✅ Authentification sécurisée (Firebase Auth)
- ✅ Gestion des demandes de rendez-vous
- ✅ Validation/Rejet des demandes
- ✅ Création manuelle de rendez-vous (patients sur place)
- ✅ Statistiques en temps réel
- ✅ Filtrage par statut
- ✅ Interface responsive

## 🚀 Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer Firebase**
   - Créer un projet sur [Firebase Console](https://console.firebase.google.com/)
   - Activer Authentication (Email/Password)
   - Activer Firestore Database
   - Copier `.env.example` vers `.env`
   - Remplir les variables d'environnement avec vos clés Firebase

3. **Lancer le projet**
```bash
npm run dev
```

Le dashboard sera accessible sur `http://localhost:5174`

## 🔐 Configuration Firebase

### 1. Créer un compte secrétaire

Dans la console Firebase Authentication, créer un utilisateur avec :
- Email: secretaire@smile-cabinet.com
- Mot de passe: (choisir un mot de passe sécurisé)

### 2. Règles de sécurité Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📦 Structure du projet

```
smile-admin-dashboard/
├── src/
│   ├── components/
│   │   └── PrivateRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── firebase/
│   │   └── config.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## 🌐 Déploiement

### Option 1: Vercel
```bash
npm run build
vercel --prod
```

### Option 2: Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Configuration du sous-domaine
Pointer `admin.smile-cabinet.com` vers votre hébergement.

## 🔒 Sécurité

- Dashboard accessible uniquement aux utilisateurs authentifiés
- Utilisation de Firebase Auth pour la gestion des sessions
- Routes protégées avec PrivateRoute
- Variables d'environnement pour les clés sensibles
- Déploiement sur sous-domaine séparé

## 📱 Technologies utilisées

- React 18
- Vite
- Firebase (Auth + Firestore)
- React Router DOM
- React Icons
- React Toastify
- date-fns
