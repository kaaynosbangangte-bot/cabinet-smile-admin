# 🔧 Guide de Dépannage - Envoi d'Emails

## 🎯 Étapes de diagnostic

### 1️⃣ Vérifier le fichier .env

**Assurez-vous que le fichier `.env` existe dans `admin-dashboard/`**

Créez ou modifiez : `e:\cabinet dentaire smile\admin-dashboard\.env`

```env
# Vos identifiants Firebase (déjà configurés)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# EmailJS - AJOUTEZ CES LIGNES
VITE_EMAILJS_SERVICE_ID=service_yjgr9d2
VITE_EMAILJS_TEMPLATE_ID=template_7fs8rgn
VITE_EMAILJS_PUBLIC_KEY=U1tkK20mWpJfRid5e
```

⚠️ **IMPORTANT** : 
- Pas d'espaces autour du `=`
- Pas de guillemets autour des valeurs
- Le fichier doit s'appeler exactement `.env` (avec le point au début)

---

### 2️⃣ Redémarrer le serveur

Après avoir modifié `.env`, vous DEVEZ redémarrer :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
npm run dev
```

---

### 3️⃣ Vérifier la console du navigateur

1. Ouvrez le dashboard admin
2. Appuyez sur **F12** pour ouvrir la console
3. Essayez de confirmer un rendez-vous avec Email coché
4. Regardez les messages dans la console

**Vous devriez voir :**
```
📧 Préparation de l'envoi d'email...
Destinataire: patient@email.com
Nom: Nom du patient
📤 Envoi via EmailJS...
✅ Email envoyé avec succès: {...}
```

---

## ❌ Erreurs courantes et solutions

### Erreur 1 : "Configuration EmailJS incomplète"

**Cause :** Le fichier `.env` n'est pas lu ou mal configuré

**Solutions :**
1. Vérifiez que `.env` est dans `admin-dashboard/` (pas dans `src/`)
2. Redémarrez le serveur avec `npm run dev`
3. Vérifiez qu'il n'y a pas d'espaces dans les valeurs

---

### Erreur 2 : "The public key is required"

**Cause :** La clé publique n'est pas correctement configurée

**Solution :**
```env
VITE_EMAILJS_PUBLIC_KEY=U1tkK20mWpJfRid5e
```
Redémarrez le serveur.

---

### Erreur 3 : "Service ID is invalid"

**Cause :** Le Service ID est incorrect ou le service n'est pas actif

**Solutions :**
1. Vérifiez dans EmailJS Dashboard → Email Services
2. Assurez-vous que le service `service_yjgr9d2` existe
3. Vérifiez qu'il est **connecté** (icône verte)

---

### Erreur 4 : "Template ID is invalid"

**Cause :** Le template n'existe pas ou n'est pas configuré

**Solutions :**
1. Allez dans EmailJS Dashboard → Email Templates
2. Vérifiez que `template_7fs8rgn` existe
3. Cliquez dessus et vérifiez qu'il contient :
   - Variables : `{{to_name}}`, `{{to_email}}`, `{{message}}`
   - Un contenu HTML
4. Cliquez sur **Save**

---

### Erreur 5 : "Failed to send email"

**Cause :** Problème de connexion ou de configuration du service email

**Solutions :**
1. Vérifiez votre connexion Internet
2. Dans EmailJS, allez dans Email Services
3. Cliquez sur votre service (Gmail, Outlook, etc.)
4. Vérifiez qu'il est bien **connecté**
5. Si déconnecté, cliquez sur **Reconnect**

---

## 🧪 Test manuel

### Option 1 : Test dans EmailJS Dashboard

1. Allez sur [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Email Templates → `template_7fs8rgn`
3. Cliquez sur **Test it**
4. Remplissez :
   ```
   to_name: Test Patient
   to_email: votre-email@test.com
   message: Test de confirmation
   ```
5. Cliquez sur **Send Test Email**
6. Vérifiez votre boîte mail

**Si ça fonctionne ici mais pas dans l'app** → Problème de configuration `.env`

---

### Option 2 : Test dans la console du navigateur

1. Ouvrez le dashboard admin
2. Appuyez sur **F12**
3. Allez dans l'onglet **Console**
4. Tapez :
```javascript
// Vérifier les variables d'environnement
console.log('Service ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID)
console.log('Template ID:', import.meta.env.VITE_EMAILJS_TEMPLATE_ID)
console.log('Public Key:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY)
```

**Résultat attendu :**
```
Service ID: service_yjgr9d2
Template ID: template_7fs8rgn
Public Key: U1tkK20mWpJfRid5e
```

**Si vous voyez `undefined`** → Le fichier `.env` n'est pas lu correctement

---

## ✅ Checklist complète

- [ ] Fichier `.env` créé dans `admin-dashboard/`
- [ ] Les 3 variables EmailJS sont dans `.env`
- [ ] Pas d'espaces ni de guillemets dans `.env`
- [ ] Serveur redémarré après modification de `.env`
- [ ] Service EmailJS connecté (icône verte)
- [ ] Template EmailJS sauvegardé avec les variables
- [ ] Test manuel dans EmailJS fonctionne
- [ ] Console du navigateur ne montre pas d'erreur

---

## 🆘 Si rien ne fonctionne

### Solution de secours : Hardcoder temporairement

Dans `src/services/messageService.js`, remplacez temporairement :

```javascript
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
```

Par :

```javascript
const EMAILJS_SERVICE_ID = 'service_yjgr9d2'
const EMAILJS_TEMPLATE_ID = 'template_7fs8rgn'
const EMAILJS_PUBLIC_KEY = 'U1tkK20mWpJfRid5e'
```

Redémarrez et testez. Si ça fonctionne, le problème vient du fichier `.env`.

⚠️ **N'oubliez pas de remettre les variables d'environnement après !**

---

## 📞 Informations de debug à fournir

Si le problème persiste, donnez-moi :

1. **Message d'erreur exact** dans la console (F12)
2. **Résultat de cette commande** dans la console :
   ```javascript
   console.log(import.meta.env)
   ```
3. **Capture d'écran** de votre EmailJS Dashboard (Email Services)
4. **Confirmation** que le test manuel dans EmailJS fonctionne

---

## 🎯 Prochaines étapes

Une fois l'email fonctionnel :
1. ✅ Email → Configuré
2. ✅ WhatsApp → Déjà fonctionnel
3. ⏸️ SMS → À voir plus tard (optionnel)

Vous aurez 2 canaux de communication gratuits et professionnels ! 🎉
