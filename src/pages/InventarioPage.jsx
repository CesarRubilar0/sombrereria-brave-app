import { useState, useEffect } from 'react'
import { useInventarioStore } from '../store/inventarioStore'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'
import './InventarioPage.css'

function InventarioPage() {
  const [mostrarForm, setMostrarForm] = useState(false)
  const { productos, loading, error, loadProductos } = useInventarioStore()
  const totalStock = productos.reduce((sum, p) => sum + (p.stock || 0), 0)

  useEffect(() => {
    loadProductos()
  }, [])

  const handleFormClose = () => {
    setMostrarForm(false)
    // Recargar productos después de agregar uno
    setTimeout(() => loadProductos(), 500)
  }

  if (error) {
    return (
      <div className="inventario-page">
        <div className="error-container">
          <h2>❌ Error al cargar inventario</h2>
          <p>{error}</p>
          <button onClick={loadProductos}>Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="inventario-page">
      <div className="inventario-header">
        <h1>📦 Inventario</h1>
        <button
          className="btn-agregar"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? '✕ Cancelar' : '+ Agregar Producto'}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-container">
          <ProductForm onClose={handleFormClose} />
        </div>
      )}

      <div className="stats">
        <div className="stat-card">
          <span className="stat-label">Total de Productos</span>
          <span className="stat-value">{productos.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Stock Total</span>
          <span className="stat-value">{totalStock}</span>
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : (
        <ProductList productos={productos} />
      )}
    </div>
  )
}

export default InventarioPage
