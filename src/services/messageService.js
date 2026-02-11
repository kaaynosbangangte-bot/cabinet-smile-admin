import emailjs from '@emailjs/browser'

// Configuration EmailJS
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

// Configuration Twilio (pour SMS)
const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = import.meta.env.VITE_TWILIO_PHONE_NUMBER

/**
 * Envoyer un email de confirmation
 */
export const sendEmail = async (patientEmail, patientName, message) => {
  try {
    // Vérifier que les identifiants sont configurés
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error('❌ Configuration EmailJS manquante:')
      console.error('Service ID:', EMAILJS_SERVICE_ID ? '✅' : '❌')
      console.error('Template ID:', EMAILJS_TEMPLATE_ID ? '✅' : '❌')
      console.error('Public Key:', EMAILJS_PUBLIC_KEY ? '✅' : '❌')
      throw new Error('Configuration EmailJS incomplète. Vérifiez votre fichier .env')
    }

    console.log('📧 Préparation de l\'envoi d\'email...')
    console.log('Destinataire:', patientEmail)
    console.log('Nom:', patientName)

    const templateParams = {
      to_email: patientEmail,
      to_name: patientName,
      message: message,
      from_name: 'Cabinet Dentaire Smile'
    }

    console.log('📤 Envoi via EmailJS...')
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    )

    console.log('✅ Email envoyé avec succès:', response)
    return { success: true, response }
  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    console.error('Message:', error.message)
    console.error('Détails:', error.text || error)
    return { success: false, error: error.text || error.message }
  }
}

/**
 * Envoyer un message WhatsApp
 * Utilise l'API WhatsApp Web pour ouvrir une conversation
 */
export const sendWhatsApp = async (phoneNumber, message) => {
  try {
    // Nettoyer le numéro de téléphone (enlever espaces, tirets, etc.)
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '')
    
    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message)
    
    // Créer l'URL WhatsApp
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
    
    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank')
    
    return { success: true, url: whatsappUrl }
  } catch (error) {
    console.error('Erreur envoi WhatsApp:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Envoyer un SMS via Twilio
 */
export const sendSMS = async (phoneNumber, message) => {
  try {
    const cloudFunctionUrl = import.meta.env.VITE_CLOUD_FUNCTION_SMS_URL
    
    if (!cloudFunctionUrl) {
      console.warn('URL de la Cloud Function SMS non configurée')
      return { success: false, error: 'Service SMS non configuré' }
    }

    // Appel à une Cloud Function Firebase ou API backend
    const response = await fetch(cloudFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: phoneNumber,
        message: message,
        accountSid: TWILIO_ACCOUNT_SID,
        authToken: TWILIO_AUTH_TOKEN,
        from: TWILIO_PHONE_NUMBER
      })
    })

    const data = await response.json()
    
    if (data.success) {
      console.log('SMS envoyé avec succès:', data)
      return { success: true, data }
    } else {
      throw new Error(data.error || 'Erreur lors de l\'envoi du SMS')
    }
  } catch (error) {
    console.error('Erreur envoi SMS:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Envoyer les messages sur tous les canaux sélectionnés
 */
export const sendConfirmationMessages = async (appointment, message, channels) => {
  const results = {
    email: null,
    whatsapp: null,
    sms: null
  }

  // Envoyer par Email
  if (channels.email) {
    results.email = await sendEmail(
      appointment.email,
      appointment.name,
      message
    )
  }

  // Envoyer par WhatsApp
  if (channels.whatsapp) {
    results.whatsapp = await sendWhatsApp(
      appointment.phone,
      message
    )
  }

  // Envoyer par SMS
  if (channels.sms) {
    results.sms = await sendSMS(
      appointment.phone,
      message
    )
  }

  return results
}
