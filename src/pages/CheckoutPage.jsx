import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInventarioStore } from '../store/inventarioStore'
import './CheckoutPage.css'

export default function CheckoutPage(){
  const { carrito, clienteInfo, setClienteInfo, crearPedido } = useInventarioStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setClienteInfo({ [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { success, pedido, error } = await crearPedido()
      if (!success) throw new Error(error)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit} className="checkout-form">
        {error && <div className="error">{error}</div>}
        <label>Nombre</label>
        <input name="nombre" defaultValue={clienteInfo.nombre} onChange={handleChange} required />
        <label>Correo</label>
        <input name="correo" type="email" defaultValue={clienteInfo.correo} onChange={handleChange} required />
        <label>Teléfono</label>
        <input name="telefono" defaultValue={clienteInfo.telefono} onChange={handleChange} />

        <div className="checkout-actions">
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Procesando...' : 'Pagar'}</button>
        </div>
      </form>
    </div>
  )
}
