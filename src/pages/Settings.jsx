import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { 
  FiSettings, 
  FiUser, 
  FiBell, 
  FiClock,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSave
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import './Settings.css'

function Settings() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('cabinet')

  const [cabinetSettings, setCabinetSettings] = useState({
    name: 'Cabinet Dentaire Smile',
    email: 'contact@smile-cabinet.com',
    phone: '+212 5XX-XXXXXX',
    address: 'Adresse du cabinet',
    city: 'Ville',
    workingHours: {
      start: '09:00',
      end: '18:00'
    },
    workingDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newAppointments: true,
    appointmentReminders: true,
    cancelledAppointments: true
  })

  const handleSaveCabinet = () => {
    toast.success('Paramètres du cabinet enregistrés')
  }

  const handleSaveNotifications = () => {
    toast.success('Préférences de notification enregistrées')
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="dashboard-main">
        <Header title="Paramètres" />
        
        <div className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>Paramètres</h1>
              <p>Configuration du système et préférences</p>
            </div>
          </div>

          <div className="settings-container">
            <div className="settings-tabs">
              <button 
                className={activeTab === 'cabinet' ? 'active' : ''}
                onClick={() => setActiveTab('cabinet')}
              >
                <FiSettings /> Informations Cabinet
              </button>
              <button 
                className={activeTab === 'account' ? 'active' : ''}
                onClick={() => setActiveTab('account')}
              >
                <FiUser /> Mon Compte
              </button>
              <button 
                className={activeTab === 'notifications' ? 'active' : ''}
                onClick={() => setActiveTab('notifications')}
              >
                <FiBell /> Notifications
              </button>
            </div>

            <div className="settings-content">
              {activeTab === 'cabinet' && (
                <div className="settings-section">
                  <h2>Informations du Cabinet</h2>
                  <p className="section-description">
                    Gérez les informations de votre cabinet dentaire
                  </p>

                  <div className="settings-form">
                    <div className="form-group">
                      <label>
                        <FiSettings /> Nom du cabinet
                      </label>
                      <input
                        type="text"
                        value={cabinetSettings.name}
                        onChange={(e) => setCabinetSettings({...cabinetSettings, name: e.target.value})}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <FiMail /> Email
                        </label>
                        <input
                          type="email"
                          value={cabinetSettings.email}
                          onChange={(e) => setCabinetSettings({...cabinetSettings, email: e.target.value})}
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <FiPhone /> Téléphone
                        </label>
                        <input
                          type="tel"
                          value={cabinetSettings.phone}
                          onChange={(e) => setCabinetSettings({...cabinetSettings, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        <FiMapPin /> Adresse
                      </label>
                      <input
                        type="text"
                        value={cabinetSettings.address}
                        onChange={(e) => setCabinetSettings({...cabinetSettings, address: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <FiMapPin /> Ville
                      </label>
                      <input
                        type="text"
                        value={cabinetSettings.city}
                        onChange={(e) => setCabinetSettings({...cabinetSettings, city: e.target.value})}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <FiClock /> Heure d'ouverture
                        </label>
                        <input
                          type="time"
                          value={cabinetSettings.workingHours.start}
                          onChange={(e) => setCabinetSettings({
                            ...cabinetSettings, 
                            workingHours: {...cabinetSettings.workingHours, start: e.target.value}
                          })}
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <FiClock /> Heure de fermeture
                        </label>
                        <input
                          type="time"
                          value={cabinetSettings.workingHours.end}
                          onChange={(e) => setCabinetSettings({
                            ...cabinetSettings, 
                            workingHours: {...cabinetSettings.workingHours, end: e.target.value}
                          })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Jours de travail</label>
                      <div className="days-selector">
                        {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(day => (
                          <label key={day} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={cabinetSettings.workingDays.includes(day)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCabinetSettings({
                                    ...cabinetSettings,
                                    workingDays: [...cabinetSettings.workingDays, day]
                                  })
                                } else {
                                  setCabinetSettings({
                                    ...cabinetSettings,
                                    workingDays: cabinetSettings.workingDays.filter(d => d !== day)
                                  })
                                }
                              }}
                            />
                            {day}
                          </label>
                        ))}
                      </div>
                    </div>

                    <button className="btn-save" onClick={handleSaveCabinet}>
                      <FiSave /> Enregistrer les modifications
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="settings-section">
                  <h2>Mon Compte</h2>
                  <p className="section-description">
                    Gérez vos informations personnelles et votre sécurité
                  </p>

                  <div className="account-info">
                    <div className="info-card">
                      <div className="info-icon">
                        <FiUser />
                      </div>
                      <div className="info-details">
                        <h4>Email de connexion</h4>
                        <p>{currentUser?.email}</p>
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="info-icon">
                        <FiSettings />
                      </div>
                      <div className="info-details">
                        <h4>Rôle</h4>
                        <p>Administrateur / Secrétaire</p>
                      </div>
                    </div>
                  </div>

                  <div className="settings-form">
                    <h3>Changer le mot de passe</h3>
                    <div className="form-group">
                      <label>Mot de passe actuel</label>
                      <input type="password" placeholder="••••••••" />
                    </div>
                    <div className="form-group">
                      <label>Nouveau mot de passe</label>
                      <input type="password" placeholder="••••••••" />
                    </div>
                    <div className="form-group">
                      <label>Confirmer le mot de passe</label>
                      <input type="password" placeholder="••••••••" />
                    </div>
                    <button className="btn-save">
                      <FiSave /> Mettre à jour le mot de passe
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="settings-section">
                  <h2>Préférences de Notification</h2>
                  <p className="section-description">
                    Choisissez comment vous souhaitez être notifié
                  </p>

                  <div className="settings-form">
                    <div className="toggle-group">
                      <div className="toggle-item">
                        <div className="toggle-info">
                          <h4>Notifications par email</h4>
                          <p>Recevoir des notifications par email</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              emailNotifications: e.target.checked
                            })}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <h4>Nouveaux rendez-vous</h4>
                          <p>Être notifié des nouvelles demandes de rendez-vous</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={notificationSettings.newAppointments}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              newAppointments: e.target.checked
                            })}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <h4>Rappels de rendez-vous</h4>
                          <p>Recevoir des rappels avant les rendez-vous</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={notificationSettings.appointmentReminders}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              appointmentReminders: e.target.checked
                            })}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <h4>Annulations</h4>
                          <p>Être notifié des annulations de rendez-vous</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={notificationSettings.cancelledAppointments}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              cancelledAppointments: e.target.checked
                            })}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>

                    <button className="btn-save" onClick={handleSaveNotifications}>
                      <FiSave /> Enregistrer les préférences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
