import { Link } from 'react-router-dom'
import { useInventarioStore } from '../store/inventarioStore'
import './CartPage.css'

export default function CartPage(){
  const { carrito, getTotal, vaciarCarrito } = useInventarioStore()
  const total = getTotal()

  return (
    <div className="cart-page">
      <h1>🛒 Carrito</h1>

      {carrito.length === 0 ? (
        <div className="empty-cart">
          <p>Tu carrito está vacío.</p>
          <Link to="/catalogo" className="btn-primary">Ir al Catálogo</Link>
        </div>
      ) : (
        <div>
          <ul className="cart-list">
            {carrito.map(item => (
              <li key={item.id} className="cart-item">
                <div className="ci-left">
                  {item.imagen_url && <img src={item.imagen_url} alt={item.nombre} />}
                </div>
                <div className="ci-body">
                  <strong>{item.nombre}</strong>
                  <div>Cantidad: {item.cantidad}</div>
                </div>
                <div className="ci-right">${(item.precio * item.cantidad).toFixed(2)}</div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div>Total: <strong>${total.toFixed(2)}</strong></div>
            <div className="cart-actions">
              <button className="btn-secondary" onClick={vaciarCarrito}>Vaciar</button>
              <Link to="/checkout" className="btn-primary">Continuar a pago</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
