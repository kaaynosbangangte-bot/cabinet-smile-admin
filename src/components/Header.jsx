import { useState } from 'react'
import { FiSearch, FiBell } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import './Header.css'

function Header({ title = 'Accueil' }) {
  const { currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date().toLocaleDateString('fr-FR', options)
  }

  return (
    <header className="dashboard-header">
      <div className="header-search">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Recherche"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="header-right">
        <div className="header-date">
          {getCurrentDate()}
        </div>
        <div className="header-user">
          <div className="user-avatar-small">
            <span>{currentUser?.email?.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
