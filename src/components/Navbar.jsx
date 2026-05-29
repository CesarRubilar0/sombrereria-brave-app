import { Link } from 'react-router-dom'
import './Navbar.css'
import { useInventarioStore } from '../store/inventarioStore'

export default function Navbar() {
  const carrito = useInventarioStore((state) => state.carrito)

  const cartCount = carrito.reduce((sum, item) => sum + (item.cantidad || item.cantidad === 0 ? item.cantidad : item.quantity || 1), 0)
  const total = carrito.reduce((sum, item) => sum + (item.precio || 0) * (item.cantidad || item.quantity || 1), 0)

  return (
    <nav className="navbar artisan-navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">🎩 Sombrerería Brave</Link>

        <ul className="nav-links">
          <li className="nav-item"><Link to="/">HOME</Link></li>
          <li className="nav-item"><Link to="/nosotros">NOSOTROS</Link></li>
          <li className="nav-item"><Link to="/catalogo">CATÁLOGO</Link></li>
          <li className="nav-item"><Link to="/contacto">CONTACTO</Link></li>
        </ul>
      </div>

      <div className="nav-right">
        <div className="cart-text">CARRITO / ${total.toFixed(2)}</div>

        <Link to="/cart" className="icon-button cart-button" aria-label="Carrito">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M6 6H4V4h2v2zM8 6h9l-1.4 7H9.4L8 6z" fill="currentColor" />
            <path d="M7 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" />
          </svg>
          <span className="cart-badge">{cartCount}</span>
        </Link>

        <button className="icon-button search-button" aria-label="Buscar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </nav>
  )
}

