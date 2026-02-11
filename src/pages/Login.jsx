import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-illustration">
          <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <text x="400" y="300" fontSize="48" fill="#2d3436" textAnchor="middle" fontWeight="bold">
              🦷 Cabinet Smile
            </text>
            <text x="400" y="350" fontSize="24" fill="#636e72" textAnchor="middle">
              Votre sourire, notre priorité
            </text>
          </svg>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-card">
          <div className="login-logo">
            <img src="/logo.png" alt="Cabinet Dentaire Smile" />
          </div>
          
          <h2 className="login-title">Connexion</h2>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Mail *</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe *</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrer votre mot de passe"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="forgot-password">
              <a href="#">Mot de passe oublier</a>
            </div>

            <button 
              type="submit" 
              className="btn-login"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Connexion'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
