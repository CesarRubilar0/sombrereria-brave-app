import ProductList from '../components/ProductList'
import { useInventarioStore } from '../store/inventarioStore'

export default function CatalogoPage(){
  const { productos, loadProductos, loading } = useInventarioStore()

  return (
    <div style={{padding:20}}>
      <h1>CATÁLOGO</h1>
      {loading ? <p>Cargando...</p> : <ProductList productos={productos} />}
    </div>
  )
}
