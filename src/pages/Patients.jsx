import { useState, useEffect } from 'react'
import { collection, query, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import {
  FiUsers,
  FiSearch,
  FiPhone,
  FiMail,
  FiCalendar,
  FiEye,
  FiUser
} from 'react-icons/fi'
import './Patients.css'

function Patients() {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    const q = query(collection(db, 'appointments'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appointmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setAppointments(appointmentsData)

      // Extraire les patients uniques
      const uniquePatients = {}
      appointmentsData.forEach(apt => {
        if (!uniquePatients[apt.email]) {
          uniquePatients[apt.email] = {
            name: apt.name,
            email: apt.email,
            phone: apt.phone,
            appointments: []
          }
        }
        uniquePatients[apt.email].appointments.push({
          id: apt.id,
          date: apt.date,
          time: apt.time,
          service: apt.service,
          status: apt.status,
          message: apt.message
        })
      })

      setPatients(Object.values(uniquePatients))
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  )

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient)
    setShowDetailsModal(true)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Header title="Patients" />

        <div className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>Gestion des Patients</h1>
              <p>{filteredPatients.length} patient(s) enregistré(s)</p>
            </div>
          </div>

          <div className="search-bar">
            <FiSearch />
            <input
              type="text"
              placeholder="Rechercher un patient (nom, email, téléphone)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading">Chargement...</div>
          ) : filteredPatients.length === 0 ? (
            <div className="empty-state">
              <FiUsers />
              <p>Aucun patient trouvé</p>
            </div>
          ) : (
            <div className="patients-grid">
              {filteredPatients.map((patient, index) => (
                <div key={index} className="patient-card">
                  <div className="patient-avatar-large">
                    <FiUser />
                  </div>
                  <div className="patient-info">
                    <h3>{patient.name}</h3>
                    <div className="patient-contact">
                      <span><FiMail /> {patient.email}</span>
                      <span><FiPhone /> {patient.phone}</span>
                    </div>
                    <div className="patient-stats">
                      <span className="stat-item">
                        <FiCalendar /> {patient.appointments.length} rendez-vous
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn-view-patient"
                    onClick={() => handleViewPatient(patient)}
                  >
                    <FiEye /> Voir détails
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDetailsModal && selectedPatient && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-patient" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Dossier Patient</h2>
              <button className="btn-close" onClick={() => setShowDetailsModal(false)}>×</button>
            </div>
            <div className="patient-details-content">
              <div className="patient-header-section">
                <div className="patient-avatar-xl">
                  <FiUser />
                </div>
                <div className="patient-main-info">
                  <h2>{selectedPatient.name}</h2>
                  <div className="contact-info">
                    <span><FiMail /> {selectedPatient.email}</span>
                    <span><FiPhone /> {selectedPatient.phone}</span>
                  </div>
                </div>
              </div>

              <div className="appointments-history">
                <h3>Historique des Rendez-vous des patients({selectedPatient.appointments.length})</h3>
                <div className="history-list">
                  {selectedPatient.appointments.map((apt, idx) => (
                    <div key={idx} className="history-item">
                      <div className="history-date">
                        <FiCalendar />
                        <span>{apt.date} à {apt.time}</span>
                      </div>
                      <div className="history-service">
                        {apt.service || 'Service non spécifié'}
                      </div>
                      <span className={`status-badge ${apt.status}`}>
                        {apt.status === 'pending' && 'En attente'}
                        {apt.status === 'confirmed' && 'Confirmé'}
                        {apt.status === 'rejected' && 'Rejeté'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Patients
