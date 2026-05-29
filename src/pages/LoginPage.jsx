import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInventarioStore } from '../store/inventarioStore'
import './LoginPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  
  const { loginAdmin, isAdminAuthenticated, loading, error } = useInventarioStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Si ya está autenticado, redirigir directamente al inventario
    if (isAdminAuthenticated) {
      navigate('/inventario')
    }
  }, [isAdminAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!email || !password) {
      setFormError('Por favor, completa todos los campos.')
      return
    }

    const { success, error: authError } = await loginAdmin(email, password)
    if (success) {
      navigate('/inventario')
    } else {
      setFormError(authError || 'Credenciales incorrectas.')
    }
  }

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo-emoji">🎩</span>
          <h2>Sombrerería Brave</h2>
          <p>Panel de Control del Administrador</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Mensaje de Error */}
          {(formError || error) && (
            <div className="login-error-alert" role="alert">
              <span className="alert-icon">⚠️</span>
              <span>{formError || error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@sombrereriabrave.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-login-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner-text">
                <span className="login-spinner"></span>
                Iniciando sesión...
              </span>
            ) : (
              'Ingresar al Panel'
            )}
          </button>
        </form>

        <div className="login-card-footer">
          <p>© {new Date().getFullYear()} Sombrerería Brave. Acceso restringido.</p>
        </div>
      </div>
    </div>
  )
}
