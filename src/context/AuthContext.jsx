import { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth } from '../firebase/config'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      toast.success('Connexion réussie!')
      return result
    } catch (error) {
      let errorMessage = 'Erreur de connexion'
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Email invalide'
          break
        case 'auth/user-disabled':
          errorMessage = 'Compte désactivé'
          break
        case 'auth/user-not-found':
          errorMessage = 'Utilisateur non trouvé'
          break
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect'
          break
        case 'auth/invalid-credential':
          errorMessage = 'Identifiants invalides'
          break
        default:
          errorMessage = error.message
      }
      
      toast.error(errorMessage)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      toast.success('Déconnexion réussie')
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
      throw error
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
