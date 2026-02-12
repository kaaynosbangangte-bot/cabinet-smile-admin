import { useState, useEffect } from 'react'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { toast } from 'react-toastify'
import { sendConfirmationMessages } from '../services/messageService'
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiPhone,
  FiMail,
  FiFilter,
  FiPlus,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiSend,
  FiMessageSquare
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import './Appointments.css'

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const itemsPerPage = 5

  const [newAppointment, setNewAppointment] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    message: ''
  })

  const [confirmationData, setConfirmationData] = useState({
    message: '',
    channels: {
      whatsapp: false,
      sms: false,
      email: false
    }
  })

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment)
    setShowDetailsModal(true)
  }

  const generateConfirmationMessage = (appointment) => {
    const message = `Bonjour ${appointment.name},

Votre rendez-vous au Cabinet Dentaire Smile a été confirmé avec succès.

📅 Date: ${appointment.date}
🕐 Heure: ${appointment.time}
${appointment.service ? `🦷 Service: ${appointment.service}` : ''}

Nous vous attendons avec plaisir. En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance.

Cordialement,
Cabinet Dentaire Smile`

    return message
  }

  const handleConfirmClick = (appointment) => {
    setSelectedAppointment(appointment)
    setConfirmationData({
      message: generateConfirmationMessage(appointment),
      channels: {
        whatsapp: true,
        sms: false,
        email: true
      }
    })
    setShowConfirmModal(true)
  }

  const handleSendConfirmation = async () => {
    try {
      // Afficher un message de chargement
      const loadingToast = toast.loading('Envoi des messages en cours...')

      // Envoyer les messages via les canaux sélectionnés
      const results = await sendConfirmationMessages(
        selectedAppointment,
        confirmationData.message,
        confirmationData.channels
      )

      // Vérifier les résultats
      const successChannels = []
      const failedChannels = []

      if (confirmationData.channels.email) {
        if (results.email?.success) {
          successChannels.push('Email')
        } else {
          failedChannels.push('Email')
        }
      }

      if (confirmationData.channels.whatsapp) {
        if (results.whatsapp?.success) {
          successChannels.push('WhatsApp')
        } else {
          failedChannels.push('WhatsApp')
        }
      }

      if (confirmationData.channels.sms) {
        if (results.sms?.success) {
          successChannels.push('SMS')
        } else {
          failedChannels.push('SMS')
        }
      }

      // Mettre à jour le statut du rendez-vous dans Firebase
      const appointmentRef = doc(db, 'appointments', selectedAppointment.id)
      await updateDoc(appointmentRef, {
        status: 'confirmed',
        updatedAt: serverTimestamp(),
        confirmationSent: true,
        confirmationChannels: confirmationData.channels,
        confirmationMessage: confirmationData.message,
        confirmedAt: serverTimestamp(),
        messageSentResults: {
          success: successChannels,
          failed: failedChannels
        }
      })

      // Fermer le toast de chargement
      toast.dismiss(loadingToast)

      // Afficher le résultat
      if (successChannels.length > 0 && failedChannels.length === 0) {
        toast.success(`✅ Rendez-vous confirmé et message envoyé via ${successChannels.join(', ')}`)
      } else if (successChannels.length > 0 && failedChannels.length > 0) {
        toast.warning(`⚠️ Rendez-vous confirmé. Envoyé via ${successChannels.join(', ')}. Échec: ${failedChannels.join(', ')}`)
      } else if (failedChannels.length > 0) {
        toast.error(`❌ Rendez-vous confirmé mais échec d'envoi sur tous les canaux`)
      } else {
        toast.success('Rendez-vous confirmé')
      }

      setShowConfirmModal(false)
      setSelectedAppointment(null)
    } catch (error) {
      console.error('Error confirming appointment:', error)
      toast.error('Erreur lors de la confirmation: ' + error.message)
    }
  }

  useEffect(() => {
    const q = query(
      collection(db, 'appointments')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appointmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setAppointments(appointmentsData)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching appointments:', error)
      toast.error('Erreur lors du chargement des rendez-vous')
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId)
      await updateDoc(appointmentRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      })
      toast.success(`Rendez-vous ${newStatus === 'confirmed' ? 'confirmé' : 'rejeté'}`)
    } catch (error) {
      console.error('Error updating appointment:', error)
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handleAddAppointment = async (e) => {
    e.preventDefault()

    try {
      await addDoc(collection(db, 'appointments'), {
        ...newAppointment,
        status: 'confirmed',
        source: 'manual',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      toast.success('Rendez-vous créé avec succès')
      setShowAddModal(false)
      setNewAppointment({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        service: '',
        message: ''
      })
    } catch (error) {
      console.error('Error adding appointment:', error)
      toast.error('Erreur lors de la création du rendez-vous')
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true
    return apt.status === filter
  })

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex)

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Header title="Rendez-vous" />

        <div className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>Demande de Rendez-vous</h1>
              <p>{filteredAppointments.length} rendez-vous au total</p>
            </div>
            <button className="btn-add" onClick={() => setShowAddModal(true)}>
              <FiPlus /> Nouveau RDV
            </button>
          </div>

          <div className="filters-bar">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => { setFilter('all'); setCurrentPage(1); }}
            >
              Tous les statuts
            </button>
            <button
              className={filter === 'pending' ? 'active' : ''}
              onClick={() => { setFilter('pending'); setCurrentPage(1); }}
            >
              En attente
            </button>
            <button
              className={filter === 'confirmed' ? 'active' : ''}
              onClick={() => { setFilter('confirmed'); setCurrentPage(1); }}
            >
              Confirmés
            </button>
            <button
              className={filter === 'rejected' ? 'active' : ''}
              onClick={() => { setFilter('rejected'); setCurrentPage(1); }}
            >
              Rejetés
            </button>
          </div>

          {loading ? (
            <div className="loading">Chargement...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="empty-state">
              <FiCalendar />
              <p>Aucun rendez-vous trouvé</p>
            </div>
          ) : (
            <>
              <div className="appointments-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Date</th>
                      <th>Heure</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAppointments.map(appointment => (
                      <tr key={appointment.id}>
                        <td data-label="Patient">
                          <div className="patient-cell">
                            <FiUser />
                            <span>{appointment.name}</span>
                          </div>
                        </td>
                        <td data-label="Date">{appointment.date}</td>
                        <td data-label="Heure">{appointment.time}</td>
                        <td data-label="Email">{appointment.email}</td>
                        <td data-label="Téléphone">{appointment.phone}</td>
                        <td data-label="Statut">
                          <span className={`status-badge ${appointment.status}`}>
                            {appointment.status === 'pending' && 'En attente'}
                            {appointment.status === 'confirmed' && 'Confirmé'}
                            {appointment.status === 'rejected' && 'Rejeté'}
                          </span>
                        </td>
                        <td data-label="Actions">
                          <div className="action-buttons">
                            <button
                              className="btn-icon btn-details"
                              onClick={() => handleViewDetails(appointment)}
                              title="Voir détails"
                            >
                              <FiEye />
                            </button>
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  className="btn-icon btn-confirm"
                                  onClick={() => handleConfirmClick(appointment)}
                                  title="Confirmer"
                                >
                                  <FiCheckCircle />
                                </button>
                                <button
                                  className="btn-icon btn-reject"
                                  onClick={() => handleStatusChange(appointment.id, 'rejected')}
                                  title="Rejeter"
                                >
                                  <FiXCircle />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <FiChevronLeft /> Précédent
                  </button>

                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={currentPage === page ? 'active' : ''}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant <FiChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nouveau Rendez-vous</h2>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddAppointment}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nom complet *</label>
                  <input
                    type="text"
                    value={newAppointment.name}
                    onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newAppointment.email}
                    onChange={(e) => setNewAppointment({ ...newAppointment, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone *</label>
                  <input
                    type="tel"
                    value={newAppointment.phone}
                    onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Service</label>
                  <input
                    type="text"
                    value={newAppointment.service}
                    onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })}
                    placeholder="Ex: Consultation, Détartrage..."
                  />
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Heure *</label>
                  <input
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Message</label>
                  <textarea
                    value={newAppointment.message}
                    onChange={(e) => setNewAppointment({ ...newAppointment, message: e.target.value })}
                    rows="3"
                    placeholder="Notes supplémentaires..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  <FiPlus /> Créer le rendez-vous
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailsModal && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-details" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails du Rendez-vous</h2>
              <button className="btn-close" onClick={() => setShowDetailsModal(false)}>×</button>
            </div>
            <div className="details-content">
              <div className="detail-section">
                <h3>Informations Patient</h3>
                <div className="detail-row">
                  <span className="detail-label">Nom complet:</span>
                  <span className="detail-value">{selectedAppointment.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedAppointment.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Téléphone:</span>
                  <span className="detail-value">{selectedAppointment.phone}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Informations Rendez-vous</h3>
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{selectedAppointment.date}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Heure:</span>
                  <span className="detail-value">{selectedAppointment.time}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Service demandé:</span>
                  <span className="detail-value">{selectedAppointment.service || 'Non spécifié'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Statut:</span>
                  <span className={`status-badge ${selectedAppointment.status}`}>
                    {selectedAppointment.status === 'pending' && 'En attente'}
                    {selectedAppointment.status === 'confirmed' && 'Confirmé'}
                    {selectedAppointment.status === 'rejected' && 'Rejeté'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Source:</span>
                  <span className="detail-value">
                    {selectedAppointment.source === 'manual' ? '📝 Créé manuellement' : '🌐 Site web'}
                  </span>
                </div>
              </div>

              {selectedAppointment.message && (
                <div className="detail-section">
                  <h3>Notes additionnelles</h3>
                  <div className="message-box">
                    {selectedAppointment.message}
                  </div>
                </div>
              )}

              {selectedAppointment.status === 'pending' && (
                <div className="detail-actions">
                  <button
                    className="btn-action btn-confirm-large"
                    onClick={() => {
                      setShowDetailsModal(false)
                      handleConfirmClick(selectedAppointment)
                    }}
                  >
                    <FiCheckCircle /> Confirmer le rendez-vous
                  </button>
                  <button
                    className="btn-action btn-reject-large"
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, 'rejected')
                      setShowDetailsModal(false)
                    }}
                  >
                    <FiXCircle /> Rejeter le rendez-vous
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content modal-confirmation" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmer le Rendez-vous</h2>
              <button className="btn-close" onClick={() => setShowConfirmModal(false)}>×</button>
            </div>
            <div className="confirmation-content">
              <div className="patient-summary">
                <div className="summary-icon">
                  <FiUser />
                </div>
                <div className="summary-info">
                  <h3>{selectedAppointment.name}</h3>
                  <p>{selectedAppointment.date} à {selectedAppointment.time}</p>
                </div>
              </div>

              <div className="message-section">
                <h3>Message de confirmation</h3>
                <p className="section-hint">Vous pouvez modifier le message avant de l'envoyer</p>
                <textarea
                  value={confirmationData.message}
                  onChange={(e) => setConfirmationData({ ...confirmationData, message: e.target.value })}
                  rows="10"
                  className="message-textarea"
                />
              </div>

              <div className="channels-section">
                <h3>Canaux d'envoi</h3>
                <p className="section-hint">Sélectionnez les moyens de communication</p>

                <div className="channels-grid">
                  <label className={`channel-option ${confirmationData.channels.whatsapp ? 'active' : ''}`}>
                    <input
                      type="checkbox"
                      checked={confirmationData.channels.whatsapp}
                      onChange={(e) => setConfirmationData({
                        ...confirmationData,
                        channels: { ...confirmationData.channels, whatsapp: e.target.checked }
                      })}
                    />
                    <div className="channel-icon whatsapp">
                      <FaWhatsapp />
                    </div>
                    <div className="channel-info">
                      <h4>WhatsApp</h4>
                      <p>{selectedAppointment.phone}</p>
                    </div>
                  </label>

                  <label className={`channel-option ${confirmationData.channels.sms ? 'active' : ''}`}>
                    <input
                      type="checkbox"
                      checked={confirmationData.channels.sms}
                      onChange={(e) => setConfirmationData({
                        ...confirmationData,
                        channels: { ...confirmationData.channels, sms: e.target.checked }
                      })}
                    />
                    <div className="channel-icon sms">
                      <FiMessageSquare />
                    </div>
                    <div className="channel-info">
                      <h4>SMS</h4>
                      <p>{selectedAppointment.phone}</p>
                    </div>
                  </label>

                  <label className={`channel-option ${confirmationData.channels.email ? 'active' : ''}`}>
                    <input
                      type="checkbox"
                      checked={confirmationData.channels.email}
                      onChange={(e) => setConfirmationData({
                        ...confirmationData,
                        channels: { ...confirmationData.channels, email: e.target.checked }
                      })}
                    />
                    <div className="channel-icon email">
                      <FiMail />
                    </div>
                    <div className="channel-info">
                      <h4>Email</h4>
                      <p>{selectedAppointment.email}</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="confirmation-actions">
                <button
                  className="btn-cancel-confirm"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="btn-send-confirm"
                  onClick={handleSendConfirmation}
                  disabled={!confirmationData.channels.whatsapp && !confirmationData.channels.sms && !confirmationData.channels.email}
                >
                  <FiSend /> Confirmer et Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments
