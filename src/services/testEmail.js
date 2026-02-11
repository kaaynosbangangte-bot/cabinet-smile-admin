// Script de test pour EmailJS
import emailjs from '@emailjs/browser'

// Vos identifiants
const SERVICE_ID = 'service_yjgr9d2'
const TEMPLATE_ID = 'template_7fs8rgn'
const PUBLIC_KEY = 'U1tkK20mWpJfRid5e'

export const testEmailConfig = async () => {
  console.log('🔍 Test de configuration EmailJS...')
  console.log('Service ID:', SERVICE_ID)
  console.log('Template ID:', TEMPLATE_ID)
  console.log('Public Key:', PUBLIC_KEY)

  try {
    const templateParams = {
      to_email: 'test@example.com',
      to_name: 'Test Patient',
      message: 'Ceci est un message de test',
      from_name: 'Cabinet Dentaire Smile'
    }

    console.log('📤 Envoi du test email...')
    console.log('Paramètres:', templateParams)

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    )

    console.log('✅ Email envoyé avec succès!')
    console.log('Réponse:', response)
    return { success: true, response }

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi:', error)
    console.error('Message d\'erreur:', error.message)
    console.error('Détails:', error)
    return { success: false, error }
  }
}

// Pour tester depuis la console du navigateur
window.testEmail = testEmailConfig
