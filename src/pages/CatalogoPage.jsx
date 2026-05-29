import { useState, useEffect } from 'react'
import { useInventarioStore } from '../store/inventarioStore'
import ProductCard from '../components/ProductCard'
import './CatalogoPage.css'

// Sombreros mock en caso de que la base de datos esté vacía (para demostración premium)
const MOCK_PRODUCTS = [
  {
    id: 'mock-1',
    nombre: 'Sombrero Vaquero Cuero Crupón',
    descripcion: 'Sombrero estilo cowboy fabricado en cuero crupón de alta resistencia. Ideal para el aire libre.',
    precio: 59900,
    stock: 8,
    imagen_url: ''
  },
  {
    id: 'mock-2',
    nombre: 'Boina Comando Lana Merino',
    descripcion: 'Tradicional boina militar comando en lana merino negra. Ajuste perfecto y abrigo superior.',
    precio: 34900,
    stock: 12,
    imagen_url: ''
  },
  {
    id: 'mock-3',
    nombre: 'Sombrero Huaso Fieltro Pelo',
    descripcion: 'Sombrero tradicional de huaso chileno fabricado en fieltro de pelo de liebre. Acabado extra fino.',
    precio: 120000,
    stock: 5,
    imagen_url: ''
  },
  {
    id: 'mock-4',
    nombre: 'Pamela Dama Ala Ancha',
    descripcion: 'Elegante sombrero de sol para mujer con ala ancha. Adornado con cinta de cuero sutil.',
    precio: 45900,
    stock: 6,
    imagen_url: ''
  },
  {
    id: 'mock-5',
    nombre: 'Sombrero Chupalla Huasa Especial',
    descripcion: 'Chupalla chilena de paja de trigo tejida a mano de 4 hebras. Tradición del campo chileno.',
    precio: 79900,
    stock: 4,
    imagen_url: ''
  },
  {
    id: 'mock-6',
    nombre: 'Sombrero Infantil Safari Aventurero',
    descripcion: 'Sombrero protector de sol para niños en lona de algodón respirable. Correa de ajuste.',
    precio: 24900,
    stock: 15,
    imagen_url: ''
  },
  {
    id: 'mock-7',
    nombre: 'Cinta de Cuero Grabada',
    descripcion: 'Accesorio de adorno desmontable para sombreros, fabricado en cuero genuino grabado.',
    precio: 12900,
    stock: 20,
    imagen_url: ''
  }
];

// Productos vistos recientemente (mock para barra lateral)
const RECENTLY_VIEWED = [
  { id: 'view-1', nombre: 'Boina Comando Lana', precio: 34900, categoria: 'HOMBRE' },
  { id: 'view-2', nombre: 'Sombrero Huaso Fieltro', precio: 120000, categoria: 'HOMBRE' },
  { id: 'view-3', nombre: 'Pamela Dama Ala Ancha', precio: 45900, categoria: 'MUJER' }
];

export default function CatalogoPage() {
  const { productos, loadProductos, loading } = useInventarioStore()
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const [maxPrecioSlider, setMaxPrecioSlider] = useState(200000)
  const [maxPrecioFiltro, setMaxPrecioFiltro] = useState(200000)
  
  useEffect(() => {
    loadProductos()
    window.scrollTo(0, 0)
  }, [])

  // Clasificador dinámico para aplicar filtros en el frontend
  const clasificarProducto = (producto) => {
    const nombre = (producto.nombre || '').toLowerCase();
    const desc = (producto.descripcion || '').toLowerCase();
    
    // Categorías de género
    if (categoriaActiva === 'hombre' && (nombre.includes('hombre') || nombre.includes('caballero') || nombre.includes('boina') || nombre.includes('huaso') || nombre.includes('chupalla') || nombre.includes('comando') || nombre.includes('fedora') || nombre.includes('vaquero') || nombre.includes('panama'))) {
      return true;
    }
    if (categoriaActiva === 'mujer' && (nombre.includes('mujer') || nombre.includes('dama') || desc.includes('dama') || nombre.includes('pamela') || nombre.includes('capelina') || nombre.includes('cinta'))) {
      return true;
    }
    if (categoriaActiva === 'niños' && (nombre.includes('niño') || nombre.includes('niña') || desc.includes('niño') || desc.includes('niña') || nombre.includes('infantil') || nombre.includes('safari'))) {
      return true;
    }
    
    // Tipos de sombrero
    if (categoriaActiva === 'cowboys' && (nombre.includes('cowboy') || nombre.includes('vaquero') || nombre.includes('indiana'))) {
      return true;
    }
    if (categoriaActiva === 'huasos' && (nombre.includes('huaso') || nombre.includes('chupalla') || nombre.includes('chileno'))) {
      return true;
    }
    
    // Materiales
    if (categoriaActiva === 'pelo' && (nombre.includes('pelo') || nombre.includes('liebre') || desc.includes('pelo'))) {
      return true;
    }
    
    // Categorías placeholder 1, 2, 3
    if (categoriaActiva === 'categoria1' && nombre.includes('lana')) {
      return true;
    }
    if (categoriaActiva === 'categoria2' && nombre.includes('cuero')) {
      return true;
    }
    if (categoriaActiva === 'categoria3' && nombre.includes('fieltro')) {
      return true;
    }

    // Accesorios
    if (categoriaActiva === 'accesorios' && (nombre.includes('cinta') || nombre.includes('pluma') || nombre.includes('adorno') || nombre.includes('cepillo') || nombre.includes('soporte'))) {
      return true;
    }

    return false;
  };

  // Obtener lista final de productos (usa mock si la BD está vacía)
  const productosBase = productos.length > 0 ? productos : MOCK_PRODUCTS;

  // Filtrar productos por categoría y rango de precios
  const productosFiltrados = productosBase.filter((producto) => {
    // Filtrar por precio
    const cumplePrecio = producto.precio <= maxPrecioFiltro;
    
    // Filtrar por categoría
    if (categoriaActiva === 'todos') {
      return cumplePrecio;
    }
    return clasificarProducto(producto) && cumplePrecio;
  });

  // Manejar click en "FILTRAR" por precio
  const handleFiltrarPrecio = () => {
    setMaxPrecioFiltro(maxPrecioSlider);
  };

  // Formateador de moneda chilena
  const formatearPrecio = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <div className="catalog-page-container">
      <div className="catalog-header-banner">
        <h1>Catálogo de Sombreros</h1>
        <p>Tradición chilena y diseños exclusivos moldeados a mano</p>
      </div>

      <div className="catalog-main-layout">
        {/* COLUMNA IZQUIERDA: FILTROS */}
        <aside className="catalog-sidebar">
          {/* SECCIÓN CATEGORÍAS */}
          <div className="filter-section">
            <h3 className="filter-title">Categorías</h3>
            <ul className="categories-menu">
              <li>
                <button 
                  className={categoriaActiva === 'todos' ? 'active' : ''} 
                  onClick={() => setCategoriaActiva('todos')}
                >
                  Todos los Productos
                </button>
              </li>
              <li>
                <button 
                  className={categoriaActiva === 'hombre' ? 'active' : ''} 
                  onClick={() => setCategoriaActiva('hombre')}
                >
                  Hombre
                </button>
              </li>
              <li>
                <button 
                  className={categoriaActiva === 'mujer' ? 'active' : ''} 
                  onClick={() => setCategoriaActiva('mujer')}
                >
                  Mujer
                </button>
              </li>
              <li>
                <button 
                  className={categoriaActiva === 'niños' ? 'active' : ''} 
                  onClick={() => setCategoriaActiva('niños')}
                >
                  Niños
                </button>
              </li>
              <li className="menu-divider">Estilo</li>
              <li>
                <button 
                  className={categoriaActiva === 'cowboys' ? 'active' : ''} 
                  onClick={() => setCategoriaActiva('cowboys')}
                >
                  Sombreros Cowboys
                </button>
              </li>
              <li>
                <button 
                  className={categoriaActiva === 'huasos' ? 'active' : ''} 
                  onClick={() => setCategoriaActiva('huasos')}
                >
                  Sombreros Huasos
                </button>
              </li>
              <li className="menu-divider">Material</li>
              <li>
                <button 
                  className={categoriaActiva === 'pelo' ? 'active' : ''} 
                  onClick={() => setCategoriaActiva('pelo')}
                >
                  Tipo Pelo (Liebre)
                </button>
              </li>
              <li>
                <button 
                  className={categoriaActiva === 'categoria1' ? 'active' : ''} 
                  onClick={() => setCategoriaActiva('categoria1')}
                >
                  Categoría 1 (Lana)
                </button>
              </li>
              <li>
                <button 
                  className={categoriaActiva === 'categoria2' ? 'active' : ''} 
                  onClick={() => setCategoriaActiva('categoria2')}
                >
                  Categoría 2 (Cuero)
                </button>
              </li>
              <li>
                <button 
                  className={categoriaActiva === 'categoria3' ? 'active' : ''} 
                  onClick={() => setCategoriaActiva('categoria3')}
                >
                  Categoría 3 (Fieltro)
                </button>
              </li>
              <li className="menu-divider">Otros</li>
              <li>
                <button 
                  className={categoriaActiva === 'accesorios' ? 'active' : ''} 
                  onClick={() => setCategoriaActiva('accesorios')}
                >
                  Accesorios
                </button>
              </li>
            </ul>
          </div>

          {/* SECCIÓN FILTRAR POR PRECIO */}
          <div className="filter-section">
            <h3 className="filter-title">Filtrar por Precio</h3>
            <div className="price-slider-wrapper">
              <input 
                type="range" 
                min="10000" 
                max="200000" 
                step="5000"
                value={maxPrecioSlider} 
                onChange={(e) => setMaxPrecioSlider(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-range-labels">
                <span>Precio: {formatearPrecio(10000)} — {formatearPrecio(maxPrecioSlider)}</span>
              </div>
              <button 
                className="btn-filter-price"
                onClick={handleFiltrarPrecio}
              >
                Filtrar
              </button>
            </div>
          </div>

          {/* SECCIÓN VISTOS RECIENTEMENTE (MOCK) */}
          <div className="filter-section recently-viewed-section">
            <h3 className="filter-title">Vistos Recientemente</h3>
            <div className="recently-viewed-list">
              {RECENTLY_VIEWED.map((item) => (
                <div key={item.id} className="recent-item-card">
                  <div className="recent-item-thumb">
                    <span>🤠</span>
                  </div>
                  <div className="recent-item-details">
                    <span className="recent-item-cat">{item.categoria}</span>
                    <h4 className="recent-item-title">{item.nombre}</h4>
                    <span className="recent-item-price">{formatearPrecio(item.precio)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* COLUMNA DERECHA: GRILLA DE PRODUCTOS */}
        <main className="catalog-products-content">
          <div className="catalog-results-bar">
            <p className="results-count">
              Mostrando {productosFiltrados.length} productos
            </p>
            {categoriaActiva !== 'todos' && (
              <span className="active-filter-tag">
                Filtro: {categoriaActiva} 
                <button onClick={() => setCategoriaActiva('todos')}>✕</button>
              </span>
            )}
            {maxPrecioFiltro < 200000 && (
              <span className="active-filter-tag">
                Precio máximo: {formatearPrecio(maxPrecioFiltro)} 
                <button onClick={() => { setMaxPrecioSlider(200000); setMaxPrecioFiltro(200000); }}>✕</button>
              </span>
            )}
          </div>

          {loading ? (
            <div className="catalog-loading">Cargando la colección...</div>
          ) : productosFiltrados.length === 0 ? (
            <div className="catalog-empty">
              <span>📭</span>
              <h3>No se encontraron productos</h3>
              <p>Prueba ajustando el rango de precios o seleccionando otra categoría.</p>
            </div>
          ) : (
            <div className="catalog-products-grid">
              {productosFiltrados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
