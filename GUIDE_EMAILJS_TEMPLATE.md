# 📧 Guide de Configuration du Template EmailJS

## 🎯 Étape 1 : Accéder à EmailJS

1. Connectez-vous sur [https://dashboard.emailjs.com/](https://dashboard.emailjs.com/)
2. Allez dans **Email Templates** dans le menu de gauche

---

## ✏️ Étape 2 : Modifier votre Template

1. Cliquez sur votre template `template_7fs8rgn`
2. Vous verrez 3 sections à remplir :

### **A. Subject (Objet de l'email)**

```
✅ Confirmation de rendez-vous - Cabinet Dentaire Smile
```

### **B. Content (Contenu - Format HTML)**

Copiez-collez **TOUT** le contenu du fichier `EMAIL_TEMPLATE.html` dans cette section.

**OU** utilisez cette version simplifiée :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 10px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #8bc34a 0%, #7cb342 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">
                                🦷 Cabinet Dentaire Smile
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">
                                Votre sourire, notre priorité
                            </p>
                        </td>
                    </tr>

                    <!-- Contenu -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #2d3436; font-size: 24px;">
                                Bonjour {{to_name}},
                            </h2>
                            
                            <div style="background-color: #e8f5e9; border-left: 4px solid #8bc34a; padding: 20px; margin: 20px 0; border-radius: 5px;">
                                <p style="margin: 0; color: #2d3436; font-size: 16px; font-weight: 600;">
                                    ✅ Votre rendez-vous a été confirmé avec succès !
                                </p>
                            </div>

                            <div style="margin: 30px 0; color: #2d3436; font-size: 15px; line-height: 1.8; white-space: pre-line;">
                                {{message}}
                            </div>

                            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0;">
                                <h3 style="margin: 0 0 15px 0; color: #2d3436; font-size: 18px;">
                                    📋 Informations importantes
                                </h3>
                                <ul style="margin: 0; padding-left: 20px; color: #636e72; line-height: 1.8;">
                                    <li>Merci d'arriver 10 minutes avant l'heure du rendez-vous</li>
                                    <li>Pensez à apporter votre carte d'identité et carte vitale</li>
                                    <li>En cas d'empêchement, prévenez-nous au moins 24h à l'avance</li>
                                </ul>
                            </div>

                            <p style="margin: 30px 0 0 0; color: #636e72; font-size: 15px; line-height: 1.6;">
                                Nous vous attendons avec plaisir !<br>
                                <strong style="color: #2d3436;">L'équipe du Cabinet Dentaire Smile</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #2d3436; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px;">
                                <strong>Cabinet Dentaire Smile</strong>
                            </p>
                            <p style="margin: 0 0 15px 0; color: #b2bec3; font-size: 13px;">
                                📍 Votre adresse ici<br>
                                📞 Votre téléphone<br>
                                📧 contact@smile-cabinet.com
                            </p>
                            <p style="margin: 15px 0 0 0; color: #636e72; font-size: 12px;">
                                © 2026 Cabinet Dentaire Smile. Tous droits réservés.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

### **C. Variables à utiliser**

EmailJS remplacera automatiquement ces variables :

- `{{to_name}}` → Nom du patient
- `{{message}}` → Message de confirmation personnalisé
- `{{to_email}}` → Email du patient (utilisé automatiquement)

---

## ⚙️ Étape 3 : Paramètres du Template

Dans les **Settings** du template :

1. **To Email** : `{{to_email}}`
2. **From Name** : `Cabinet Dentaire Smile`
3. **From Email** : Votre email configuré dans le service
4. **Reply To** : Votre email de contact

---

## 🧪 Étape 4 : Tester le Template

1. Cliquez sur **Test it** dans EmailJS
2. Remplissez les variables de test :
   ```
   to_name: Jean Dupont
   to_email: votre-email@test.com
   message: Votre rendez-vous au Cabinet Dentaire Smile a été confirmé.

📅 Date: 15/02/2026
🕐 Heure: 14:30
🦷 Service: Consultation générale

Nous vous attendons avec plaisir.
   ```
3. Cliquez sur **Send Test Email**
4. Vérifiez votre boîte mail

---

## 💾 Étape 5 : Sauvegarder

1. Cliquez sur **Save** en haut à droite
2. Votre template est maintenant prêt !

---

## 🎨 Personnalisation (Optionnel)

Vous pouvez modifier :

### **Couleurs**
- Vert principal : `#8bc34a` → Changez par votre couleur
- Vert foncé : `#7cb342`
- Gris foncé : `#2d3436`

### **Informations du footer**
Remplacez dans le template :
```html
📍 Votre adresse ici
📞 Votre téléphone
📧 contact@smile-cabinet.com
```

### **Logo**
Pour ajouter votre logo, remplacez l'emoji 🦷 par :
```html
<img src="URL_DE_VOTRE_LOGO" alt="Logo" style="max-width: 150px; height: auto;">
```

---

## ✅ Vérification Finale

Votre template doit avoir :
- ✅ Objet : "✅ Confirmation de rendez-vous - Cabinet Dentaire Smile"
- ✅ Variables : `{{to_name}}`, `{{message}}`, `{{to_email}}`
- ✅ Design professionnel avec header vert
- ✅ Footer avec vos coordonnées

---

## 🚀 C'est Prêt !

Une fois le template configuré, le système enverra automatiquement des emails professionnels lors de la confirmation des rendez-vous !

**Le message sera personnalisé avec :**
- Le nom du patient
- La date et l'heure du rendez-vous
- Le service demandé
- Les notes additionnelles

---

## 📱 Aperçu du Résultat

Le patient recevra un email magnifique avec :
- 🎨 Header vert avec logo
- ✅ Badge de confirmation
- 📋 Détails du rendez-vous
- 💡 Informations pratiques
- 📞 Coordonnées du cabinet
- 🎯 Design responsive (mobile-friendly)
