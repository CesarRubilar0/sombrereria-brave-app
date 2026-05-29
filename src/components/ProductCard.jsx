import { useState } from 'react'
import { useInventarioStore } from '../store/inventarioStore'
import './ProductCard.css'

function ProductCard({ producto, isAdmin = false }) {
  const [editingStock, setEditingStock] = useState(false)
  const [newStock, setNewStock] = useState(producto.stock || 0)
  const { updateProducto, deleteProducto, agregarAlCarrito } = useInventarioStore()

  const handleUpdateStock = async () => {
    await updateProducto(producto.id, { stock: parseInt(newStock) || 0 })
    setEditingStock(false)
  }

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}"?`)) {
      deleteProducto(producto.id)
    }
  }

  return (
    <div className="product-card">
      {producto.imagen_url && (
        <div className="product-image">
          <img src={producto.imagen_url} alt={producto.nombre} />
        </div>
      )}

      <div className="product-header">
        <h3>{producto.nombre}</h3>
        {isAdmin && (
          <button
            className="btn-delete"
            onClick={handleDelete}
            title="Eliminar"
          >
            🗑️
          </button>
        )}
      </div>

      <div className="product-body">
        {producto.descripcion && (
          <p className="description">{producto.descripcion}</p>
        )}

        <div className="product-info">
          <div className="info-item">
            <span className="info-label">Precio:</span>
            <span className="info-value">${producto.precio.toFixed(2)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Stock:</span>
            <span className={`info-value ${producto.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {producto.stock || 0}
            </span>
          </div>
        </div>

        {producto.created_at && (
          <p className="date">Creado: {new Date(producto.created_at).toLocaleDateString('es-AR')}</p>
        )}
      </div>

      <div className="product-actions">
        {isAdmin ? (
          <>
            {editingStock ? (
              <div className="stock-editor">
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  min="0"
                />
                <button onClick={handleUpdateStock} className="btn-save">✓</button>
                <button onClick={() => setEditingStock(false)} className="btn-cancel">✕</button>
              </div>
            ) : (
              <button
                className="btn-edit"
                onClick={() => setEditingStock(true)}
              >
                ✏️ Editar Stock
              </button>
            )}
          </>
        ) : (
          <button
            className="btn-add-cart"
            onClick={() => agregarAlCarrito(producto, 1)}
            disabled={producto.stock <= 0}
          >
            🛒 Agregar al Carrito
          </button>
        )}
      </div>
    </div>
  )
}

export default ProductCard
