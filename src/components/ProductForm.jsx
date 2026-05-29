import { useState } from 'react'
import { useInventarioStore } from '../store/inventarioStore'
import { storageService } from '../services/supabase'
import './ProductForm.css'

function ProductForm({ onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    stock: '',
    precio: '',
    descripcion: '',
    imagen_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { addProducto } = useInventarioStore()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)
    try {
      const { url, error: uploadError } = await storageService.uploadImage('imagenes-sombreros', file)
      if (uploadError) throw uploadError
      
      setFormData((prev) => ({
        ...prev,
        imagen_url: url
      }))
    } catch (err) {
      setError('Error al subir imagen: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    if (!formData.nombre.trim()) {
      setError('Por favor, ingresa el nombre del producto')
      setLoading(false)
      return
    }

    try {
      const { success, error: submitError } = await addProducto({
        nombre: formData.nombre.trim(),
        stock: parseInt(formData.stock) || 0,
        precio: parseFloat(formData.precio) || 0,
        descripcion: formData.descripcion.trim(),
        imagen_url: formData.imagen_url
      })

      if (!success) throw new Error(submitError)

      setFormData({
        nombre: '',
        stock: '',
        precio: '',
        descripcion: '',
        imagen_url: ''
      })

      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>➕ Agregar Nuevo Producto</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="nombre">Nombre del Producto *</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Sombrero Fedora"
          required
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            min="0"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio ($)</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="imagen">Imagen del Producto</label>
        <input
          type="file"
          id="imagen"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={loading}
        />
        {formData.imagen_url && (
          <div className="image-preview">
            <img src={formData.imagen_url} alt="Preview" />
            <span>✓ Imagen subida</span>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Describe el producto..."
          rows="4"
          disabled={loading}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </button>
        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default ProductForm
