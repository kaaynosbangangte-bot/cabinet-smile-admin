# ⚡ Configuration Rapide - 2 Minutes

## 🎯 Ce qu'il faut faire MAINTENANT

### Étape 1 : Copier le contenu dans .env

Vous avez déjà le fichier `.env` ouvert dans votre éditeur.

**Copiez-collez ce contenu COMPLET :**

```env
VITE_FIREBASE_API_KEY=AIzaSyDqFWLuGVme0r_T8VZ9X8yxPxH0kxH0kxH
VITE_FIREBASE_AUTH_DOMAIN=smile-cabinet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=smile-cabinet
VITE_FIREBASE_STORAGE_BUCKET=smile-cabinet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

VITE_EMAILJS_SERVICE_ID=service_yjgr9d2
VITE_EMAILJS_TEMPLATE_ID=template_7fs8rgn
VITE_EMAILJS_PUBLIC_KEY=U1tkK20mWpJfRid5e
```

### Étape 2 : Remplacer les valeurs Firebase

**Trouvez vos vraies valeurs Firebase :**

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet "smile-cabinet" (ou le nom de votre projet)
3. Cliquez sur l'icône ⚙️ (Settings) → Project Settings
4. Descendez jusqu'à "Your apps" → SDK setup and configuration
5. Copiez les valeurs et remplacez dans `.env`

**OU** si votre Firebase fonctionne déjà, gardez les valeurs que vous avez !

### Étape 3 : Sauvegarder et redémarrer

1. **Sauvegardez** le fichier `.env` (Ctrl+S)
2. **Arrêtez** le serveur (Ctrl+C dans le terminal)
3. **Relancez** :
   ```bash
   npm run dev
   ```

---

## ✅ C'est tout !

EmailJS est maintenant configuré avec :
- ✅ Service ID: `service_yjgr9d2`
- ✅ Template ID: `template_7fs8rgn`
- ✅ Public Key: `U1tkK20mWpJfRid5e`

---

## 🧪 Tester

1. Ouvrez le dashboard admin
2. Confirmez un rendez-vous
3. Cochez "Email"
4. Cliquez sur "Confirmer et Envoyer"
5. Vérifiez la boîte mail du patient

---

## 📋 Récapitulatif des fichiers

- **`.env`** = Vos vraies clés (PRIVÉ, ne jamais partager)
- **`.env.example`** = Modèle/Template (PUBLIC, partageable)

Le fichier `.env` est dans `.gitignore` donc il ne sera jamais envoyé sur Git.

---

## ❓ Pourquoi 2 fichiers ?

- `.env.example` → Pour montrer quelles variables sont nécessaires
- `.env` → Vos vraies clés secrètes

C'est une pratique standard de sécurité !
