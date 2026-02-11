import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { toast } from 'react-toastify'
import { 
  FiCalendar, 
  FiClock, 
  FiCheckCircle,
  FiArrowRight,
  FiUsers,
  FiTrendingUp,
  FiAlertCircle,
  FiUser
} from 'react-icons/fi'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'appointments'),
      orderBy('createdAt', 'desc')
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


  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    rejected: appointments.filter(a => a.status === 'rejected').length
  }

  // Rendez-vous récents (5 derniers)
  const recentAppointments = appointments.slice(0, 5)

  // Rendez-vous aujourd'hui
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter(a => a.date === today)

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="dashboard-main">
        <Header title="Accueil" />
        
        <div className="dashboard-content">
          <div className="welcome-section">
            <h1>Bienvenue sur votre Dashboard</h1>
            <p>Voici un aperçu de l'activité du cabinet dentaire</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{background: '#e3f2fd', color: '#1976d2'}}>
                <FiCalendar />
              </div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total Rendez-vous</p>
                <span className="stat-trend">
                  <FiTrendingUp /> Tous les rendez-vous
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{background: '#fff3e0', color: '#f57c00'}}>
                <FiClock />
              </div>
              <div className="stat-info">
                <h3>{stats.pending}</h3>
                <p>En attente</p>
                <span className="stat-trend warning">
                  <FiAlertCircle /> Nécessite action
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{background: '#e8f5e9', color: '#388e3c'}}>
                <FiCheckCircle />
              </div>
              <div className="stat-info">
                <h3>{stats.confirmed}</h3>
                <p>Confirmés</p>
                <span className="stat-trend success">
                  <FiCheckCircle /> Validés
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{background: '#fce4ec', color: '#c2185b'}}>
                <FiUsers />
              </div>
              <div className="stat-info">
                <h3>{todayAppointments.length}</h3>
                <p>Aujourd'hui</p>
                <span className="stat-trend">
                  <FiCalendar /> {today}
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card recent-appointments">
              <div className="card-header">
                <h2>Rendez-vous Récents</h2>
                <button className="btn-view-all" onClick={() => navigate('/rendez-vous')}>
                  Voir tout <FiArrowRight />
                </button>
              </div>
              <div className="appointments-list">
                {loading ? (
                  <div className="loading-small">Chargement...</div>
                ) : recentAppointments.length === 0 ? (
                  <div className="empty-small">Aucun rendez-vous</div>
                ) : (
                  recentAppointments.map(apt => (
                    <div key={apt.id} className="appointment-item">
                      <div className="appointment-avatar">
                        <FiUser />
                      </div>
                      <div className="appointment-details">
                        <h4>{apt.name}</h4>
                        <p>{apt.date} à {apt.time}</p>
                      </div>
                      <span className={`status-badge-small ${apt.status}`}>
                        {apt.status === 'pending' && 'En attente'}
                        {apt.status === 'confirmed' && 'Confirmé'}
                        {apt.status === 'rejected' && 'Rejeté'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="dashboard-card quick-actions-card">
              <div className="card-header">
                <h2>Actions Rapides</h2>
              </div>
              <div className="quick-actions-list">
                <div className="action-item" onClick={() => navigate('/rendez-vous')}>
                  <div className="action-icon-small">
                    <FiCalendar />
                  </div>
                  <div className="action-text">
                    <h4>Gérer les Rendez-vous</h4>
                    <p>{stats.pending} en attente</p>
                  </div>
                  <FiArrowRight />
                </div>
                <div className="action-item" onClick={() => navigate('/patients')}>
                  <div className="action-icon-small">
                    <FiUsers />
                  </div>
                  <div className="action-text">
                    <h4>Voir les Patients</h4>
                    <p>Gérer les dossiers</p>
                  </div>
                  <FiArrowRight />
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
    </div>
  )
}

export default Dashboard
