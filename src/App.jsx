import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useInventarioStore } from './store/inventarioStore'
import './App.css'
import Navbar from './components/Navbar'
import InventarioPage from './pages/InventarioPage'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import NosotrosPage from './pages/NosotrosPage'
import CatalogoPage from './pages/CatalogoPage'
import ContactoPage from './pages/ContactoPage'

function App() {
  const { loadProductos } = useInventarioStore()

  useEffect(() => {
    // Cargar productos al iniciar la aplicación
    loadProductos()
  }, [])

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/inventario" element={<InventarioPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/nosotros" element={<NosotrosPage />} />
            <Route path="/catalogo" element={<CatalogoPage />} />
            <Route path="/contacto" element={<ContactoPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
