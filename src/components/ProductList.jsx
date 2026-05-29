import { useInventarioStore } from '../store/inventarioStore'
import ProductCard from './ProductCard'
import './ProductList.css'

function ProductList({ productos }) {
  if (productos.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No hay productos en el inventario</p>
        <p>Haz clic en "Agregar Producto" para empezar</p>
      </div>
    )
  }

  return (
    <div className="product-list">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  )
}

export default ProductList
