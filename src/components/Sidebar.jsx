import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiCalendar, FiUsers, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import './Sidebar.css'

function Sidebar() {
  const { currentUser, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Accueil' },
    { path: '/rendez-vous', icon: FiCalendar, label: 'Rendez-vous' },
    { path: '/patients', icon: FiUsers, label: 'Patients' },
    { path: '/parametre', icon: FiSettings, label: 'Paramètre' }
  ]

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }

    return () => {
      document.body.classList.remove('sidebar-open')
    }
  }, [isOpen])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={closeSidebar}></div>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Cabinet Smile" />
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            <span>{currentUser?.email?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="user-info">
            <p className="user-name">Dr. Marie Jane</p>
            <p className="user-role">Secrétaire</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end={item.path === '/dashboard'}
              onClick={closeSidebar}
            >
              <item.icon className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={() => { logout(); closeSidebar(); }}>
          <FiLogOut />
          <span>Se Déconnecter</span>
        </button>
      </div>
    </>
  )
}

export default Sidebar
