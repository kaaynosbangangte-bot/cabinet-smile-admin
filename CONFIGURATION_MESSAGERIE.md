# 📧 Configuration des Services de Messagerie

Ce guide vous explique comment configurer l'envoi réel de messages par **Email**, **WhatsApp** et **SMS**.

---

## 📨 1. Configuration EmailJS (Envoi d'Emails)

### Étape 1 : Créer un compte EmailJS
1. Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Créez un compte gratuit (100 emails/mois gratuits)
3. Confirmez votre email

### Étape 2 : Configurer un service email
1. Dans le dashboard EmailJS, allez dans **Email Services**
2. Cliquez sur **Add New Service**
3. Choisissez votre fournisseur (Gmail, Outlook, etc.)
4. Suivez les instructions pour connecter votre compte
5. Notez le **Service ID** (ex: `service_abc123`)

### Étape 3 : Créer un template
1. Allez dans **Email Templates**
2. Cliquez sur **Create New Template**
3. Utilisez ce template :

```
Sujet: Confirmation de rendez-vous - Cabinet Dentaire Smile

Bonjour {{to_name}},

{{message}}

Cordialement,
{{from_name}}
```

4. Notez le **Template ID** (ex: `template_xyz789`)

### Étape 4 : Obtenir la clé publique
1. Allez dans **Account** > **General**
2. Copiez votre **Public Key** (ex: `abc123XYZ`)

### Étape 5 : Ajouter dans .env
```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abc123XYZ
```

---

## 💬 2. Configuration WhatsApp

WhatsApp utilise l'API Web qui ouvre une conversation dans WhatsApp Web ou l'application mobile.

### Configuration
**Aucune configuration requise !** 

Le système utilise `https://wa.me/` qui fonctionne automatiquement.

### Format du numéro de téléphone
Les numéros doivent être au format international :
- ✅ Bon : `+212612345678` ou `212612345678`
- ❌ Mauvais : `0612345678`

**Note :** Le message s'ouvrira dans WhatsApp avec le texte pré-rempli. La secrétaire devra cliquer sur "Envoyer" dans WhatsApp.

---

## 📱 3. Configuration Twilio (Envoi de SMS)

### Étape 1 : Créer un compte Twilio
1. Allez sur [https://www.twilio.com/](https://www.twilio.com/)
2. Créez un compte (essai gratuit avec crédit)
3. Vérifiez votre email et numéro de téléphone

### Étape 2 : Obtenir les identifiants
1. Dans le dashboard Twilio, trouvez :
   - **Account SID** (ex: `ACxxxxxxxxxxxxx`)
   - **Auth Token** (cliquez sur "Show" pour le voir)

### Étape 3 : Obtenir un numéro Twilio
1. Allez dans **Phone Numbers** > **Manage** > **Buy a number**
2. Choisissez un numéro avec capacité SMS
3. Achetez le numéro (environ 1$/mois)
4. Notez le numéro (ex: `+12125551234`)

### Étape 4 : Ajouter dans .env
```env
VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
VITE_TWILIO_AUTH_TOKEN=your_auth_token_here
VITE_TWILIO_PHONE_NUMBER=+12125551234
```

### Étape 5 : Déployer la Cloud Function

#### Option A : Firebase Cloud Functions (Recommandé)

1. Installez Firebase CLI :
```bash
npm install -g firebase-tools
```

2. Initialisez Firebase Functions :
```bash
cd "e:\cabinet dentaire smile\backend"
firebase init functions
```

3. Installez Twilio dans functions :
```bash
cd functions
npm install twilio
```

4. Copiez le fichier `sendSMS.js` dans `functions/index.js`

5. Déployez :
```bash
firebase deploy --only functions
```

6. Notez l'URL de la fonction (ex: `https://us-central1-your-project.cloudfunctions.net/sendSMS`)

7. Ajoutez dans .env :
```env
VITE_CLOUD_FUNCTION_SMS_URL=https://us-central1-your-project.cloudfunctions.net/sendSMS
```

#### Option B : Backend Node.js simple

Si vous préférez un serveur Node.js simple :

1. Créez un fichier `server.js` :
```javascript
const express = require('express')
const cors = require('cors')
const twilio = require('twilio')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/sendSMS', async (req, res) => {
  const { to, message, accountSid, authToken, from } = req.body
  
  const client = twilio(accountSid, authToken)
  
  try {
    const sms = await client.messages.create({
      body: message,
      from: from,
      to: to
    })
    
    res.json({ success: true, messageSid: sms.sid })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(3000, () => console.log('Server running on port 3000'))
```

2. Lancez le serveur :
```bash
node server.js
```

3. Ajoutez dans .env :
```env
VITE_CLOUD_FUNCTION_SMS_URL=http://localhost:3000/sendSMS
```

---

## 🚀 Installation des dépendances

Dans le dossier `admin-dashboard`, exécutez :

```bash
npm install
```

Cela installera automatiquement `@emailjs/browser` pour l'envoi d'emails.

---

## ✅ Test de la configuration

### Test Email
1. Configurez EmailJS dans `.env`
2. Confirmez un rendez-vous
3. Cochez "Email"
4. Vérifiez la boîte mail du patient

### Test WhatsApp
1. Confirmez un rendez-vous
2. Cochez "WhatsApp"
3. Une fenêtre WhatsApp s'ouvrira avec le message pré-rempli
4. Cliquez sur "Envoyer" dans WhatsApp

### Test SMS
1. Configurez Twilio dans `.env`
2. Déployez la Cloud Function
3. Confirmez un rendez-vous
4. Cochez "SMS"
5. Le patient recevra le SMS

---

## 💰 Coûts

### EmailJS
- **Gratuit** : 100 emails/mois
- **Pro** : 9$/mois pour 1000 emails

### WhatsApp
- **Gratuit** : Utilise WhatsApp Web (pas de frais)

### Twilio SMS
- **Essai** : Crédit gratuit de 15-20$
- **Production** : 
  - Numéro : ~1$/mois
  - SMS : ~0.0075$/SMS (environ 0.007€/SMS)
  - Exemple : 100 SMS = 0.75$

---

## 🔒 Sécurité

⚠️ **IMPORTANT** : Ne partagez JAMAIS vos clés API publiquement !

- Ajoutez `.env` dans `.gitignore`
- Utilisez des variables d'environnement
- Pour la production, utilisez Firebase Environment Config :

```bash
firebase functions:config:set twilio.sid="ACxxxxx" twilio.token="xxxxx"
```

---

## 🆘 Dépannage

### Email ne s'envoie pas
- Vérifiez que les identifiants EmailJS sont corrects
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous que le service email est connecté dans EmailJS

### WhatsApp ne s'ouvre pas
- Vérifiez que le numéro est au format international (+212...)
- Assurez-vous que WhatsApp est installé ou accessible via Web

### SMS ne s'envoie pas
- Vérifiez que la Cloud Function est déployée
- Vérifiez les identifiants Twilio
- Vérifiez que le numéro Twilio a la capacité SMS
- Consultez les logs Twilio pour les erreurs

---

## 📞 Support

Pour toute question :
- EmailJS : [Documentation](https://www.emailjs.com/docs/)
- Twilio : [Documentation](https://www.twilio.com/docs/sms)
- WhatsApp API : [Documentation](https://faq.whatsapp.com/general/chats/how-to-use-click-to-chat)
