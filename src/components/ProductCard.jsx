import { useState } from 'react'
import { useInventarioStore } from '../store/inventarioStore'
import './ProductCard.css'

// Helper para clasificar dinámicamente los sombreros por género/categoría
const obtenerCategoria = (producto) => {
  const nombre = (producto.nombre || '').toLowerCase();
  const desc = (producto.descripcion || '').toLowerCase();
  
  if (nombre.includes('niño') || nombre.includes('niña') || desc.includes('niño') || desc.includes('niña') || nombre.includes('infantil')) {
    return 'NIÑOS';
  }
  if (nombre.includes('mujer') || nombre.includes('dama') || desc.includes('dama') || nombre.includes('pamela') || nombre.includes('capelina') || nombre.includes('cinta')) {
    return 'MUJER';
  }
  if (nombre.includes('hombre') || nombre.includes('caballero') || nombre.includes('boina') || nombre.includes('huaso') || nombre.includes('chupalla') || nombre.includes('comando') || nombre.includes('fedora') || nombre.includes('vaquero') || nombre.includes('panama')) {
    return 'HOMBRE';
  }
  return 'UNISEX';
};

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

  // Formateador de moneda chilena (CLP)
  const formatearPrecio = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        {producto.imagen_url ? (
          <img src={producto.imagen_url} alt={producto.nombre} className="product-image" />
        ) : (
          <div className="product-image-placeholder">
            <span>🎩</span>
          </div>
        )}
        
        {/* Botón de eliminar en modo admin */}
        {isAdmin && (
          <button
            className="btn-admin-delete"
            onClick={handleDelete}
            title="Eliminar producto"
          >
            ✕
          </button>
        )}
      </div>

      <div className="product-details">
        {/* Género/Categoría arriba en gris y pequeño */}
        <span className="product-gender">{obtenerCategoria(producto)}</span>
        
        {/* Nombre en tipografía oscura */}
        <h3 className="product-name">{producto.nombre}</h3>
        
        {/* Precio destacado en negrita y formato CLP */}
        <p className="product-price">{formatearPrecio(producto.precio)}</p>

        {/* Descripción sutil */}
        {producto.descripcion && (
          <p className="product-description-sutil">{producto.descripcion}</p>
        )}

        {/* Indicador de stock sutil */}
        <div className="product-stock-status">
          <span>Stock: </span>
          <span className={producto.stock > 0 ? 'stock-in' : 'stock-out'}>
            {producto.stock > 0 ? `${producto.stock} uds.` : 'Agotado'}
          </span>
        </div>
      </div>

      {/* Botón rectangular blanco con borde negro para cliente, o editor de stock para admin */}
      <div className="product-card-footer">
        {isAdmin ? (
          <div className="admin-actions-container">
            {editingStock ? (
              <div className="stock-editor-controls">
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  min="0"
                  className="stock-editor-input"
                />
                <button onClick={handleUpdateStock} className="btn-stock-save">✓</button>
                <button onClick={() => setEditingStock(false)} className="btn-stock-cancel">✕</button>
              </div>
            ) : (
              <button
                className="btn-admin-edit"
                onClick={() => setEditingStock(true)}
              >
                Editar Stock
              </button>
            )}
          </div>
        ) : (
          <button
            className="btn-add-to-cart"
            onClick={() => agregarAlCarrito(producto, 1)}
            disabled={producto.stock <= 0}
          >
            {producto.stock > 0 ? 'AGREGAR AL CARRITO' : 'AGOTADO'}
          </button>
        )}
      </div>
    </div>
  )
}

export default ProductCard
