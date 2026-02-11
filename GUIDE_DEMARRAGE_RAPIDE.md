# 🚀 Guide de Démarrage Rapide - Envoi de Messages

## ⚡ Configuration Minimale (5 minutes)

### 1️⃣ Email (EmailJS - GRATUIT)

**C'est le plus simple à configurer !**

1. Créez un compte sur [EmailJS](https://www.emailjs.com/)
2. Connectez votre Gmail/Outlook
3. Créez un template avec ces variables : `{{to_name}}`, `{{message}}`, `{{from_name}}`
4. Copiez vos identifiants dans `.env` :

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxx
```

✅ **Prêt à envoyer des emails !**

---

### 2️⃣ WhatsApp (GRATUIT - Aucune config)

**Fonctionne immédiatement !**

- Aucune configuration nécessaire
- Utilise WhatsApp Web
- Le message s'ouvre automatiquement dans WhatsApp
- La secrétaire clique juste sur "Envoyer"

✅ **Déjà fonctionnel !**

---

### 3️⃣ SMS (Twilio - Payant)

**Configuration avancée (optionnel)**

Si vous voulez envoyer des SMS automatiques :

1. Créez un compte [Twilio](https://www.twilio.com/) (crédit gratuit)
2. Achetez un numéro SMS (~1$/mois)
3. Configurez `.env` :

```env
VITE_TWILIO_ACCOUNT_SID=ACxxxxx
VITE_TWILIO_AUTH_TOKEN=xxxxx
VITE_TWILIO_PHONE_NUMBER=+1234567890
```

4. Déployez la Cloud Function (voir CONFIGURATION_MESSAGERIE.md)

---

## 📝 Fichier .env à créer

Créez un fichier `.env` dans `admin-dashboard/` :

```env
# Firebase (déjà configuré)
VITE_FIREBASE_API_KEY=votre_clé
VITE_FIREBASE_AUTH_DOMAIN=votre_domaine
VITE_FIREBASE_PROJECT_ID=votre_projet
VITE_FIREBASE_STORAGE_BUCKET=votre_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id

# EmailJS (pour les emails)
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=

# Twilio (optionnel - pour SMS)
VITE_TWILIO_ACCOUNT_SID=
VITE_TWILIO_AUTH_TOKEN=
VITE_TWILIO_PHONE_NUMBER=
VITE_CLOUD_FUNCTION_SMS_URL=
```

---

## 🎯 Utilisation

1. **Allez sur la page Rendez-vous**
2. **Cliquez sur Confirmer** (icône ✓)
3. **Le modal s'ouvre avec :**
   - Message prédéfini (modifiable)
   - 3 canaux : WhatsApp, SMS, Email
4. **Sélectionnez les canaux** souhaités
5. **Cliquez sur "Confirmer et Envoyer"**

---

## ✅ Ce qui fonctionne MAINTENANT

### Sans configuration supplémentaire :
- ✅ **WhatsApp** - Ouvre WhatsApp avec le message
- ✅ **Modal de confirmation** - Interface complète
- ✅ **Message personnalisable** - La secrétaire peut modifier

### Avec EmailJS configuré :
- ✅ **Email** - Envoi automatique d'emails

### Avec Twilio configuré :
- ✅ **SMS** - Envoi automatique de SMS

---

## 🔧 Commandes

```bash
# Installer les dépendances
cd "e:\cabinet dentaire smile\admin-dashboard"
npm install

# Lancer le dashboard
npm run dev
```

---

## 📊 Résumé des Coûts

| Service | Gratuit | Payant |
|---------|---------|--------|
| **Email** | ✅ 100/mois | 9$/mois (1000 emails) |
| **WhatsApp** | ✅ Illimité | - |
| **SMS** | 15$ crédit | 0.0075$/SMS |

---

## 💡 Recommandation

**Pour commencer :**
1. Configurez **EmailJS** (5 minutes, gratuit)
2. Utilisez **WhatsApp** (déjà prêt)
3. Ajoutez **SMS** plus tard si besoin

Vous aurez déjà 2 canaux fonctionnels gratuitement !

---

## 📚 Documentation Complète

Pour plus de détails, consultez `CONFIGURATION_MESSAGERIE.md`
