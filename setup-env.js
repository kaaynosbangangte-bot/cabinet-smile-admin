const fs = require('fs');
const path = require('path');

console.log('🔧 Configuration automatique du fichier .env...\n');

// Contenu du fichier .env
const envContent = `# Firebase Configuration
# IMPORTANT: Remplacez ces valeurs par vos vraies clés Firebase
# Vous pouvez les trouver dans: Firebase Console > Project Settings > General
VITE_FIREBASE_API_KEY=AIzaSyDqFWLuGVme0r_T8VZ9X8yxPxH0kxH0kxH
VITE_FIREBASE_AUTH_DOMAIN=smile-cabinet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=smile-cabinet
VITE_FIREBASE_STORAGE_BUCKET=smile-cabinet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# EmailJS Configuration (DÉJÀ CONFIGURÉ)
VITE_EMAILJS_SERVICE_ID=service_yjgr9d2
VITE_EMAILJS_TEMPLATE_ID=template_7fs8rgn
VITE_EMAILJS_PUBLIC_KEY=U1tkK20mWpJfRid5e

# Twilio Configuration (optionnel - pour SMS)
VITE_TWILIO_ACCOUNT_SID=
VITE_TWILIO_AUTH_TOKEN=
VITE_TWILIO_PHONE_NUMBER=

# Cloud Function URL (optionnel - pour SMS)
VITE_CLOUD_FUNCTION_SMS_URL=
`;

const envPath = path.join(__dirname, '.env');

// Vérifier si .env existe déjà
if (fs.existsSync(envPath)) {
    console.log('⚠️  Le fichier .env existe déjà.');
    console.log('📝 Création d\'une sauvegarde: .env.backup\n');
    fs.copyFileSync(envPath, path.join(__dirname, '.env.backup'));
}

// Créer le fichier .env
fs.writeFileSync(envPath, envContent);

console.log('✅ Fichier .env créé avec succès!\n');
console.log('📋 Configuration EmailJS:');
console.log('   Service ID: service_yjgr9d2');
console.log('   Template ID: template_7fs8rgn');
console.log('   Public Key: U1tkK20mWpJfRid5e\n');

console.log('⚠️  IMPORTANT:');
console.log('   Vous devez remplacer les valeurs Firebase par vos vraies clés!');
console.log('   Ouvrez le fichier .env et modifiez les lignes 3-8\n');

console.log('🔄 Redémarrez maintenant le serveur avec: npm run dev\n');
