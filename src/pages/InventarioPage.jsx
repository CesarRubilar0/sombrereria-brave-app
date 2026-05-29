import { useState, useEffect } from 'react'
import { useInventarioStore } from '../store/inventarioStore'
import './InventarioPage.css'

export default function InventarioPage() {
  const {
    productos,
    materiales,
    loading,
    error,
    loadProductos,
    addProducto,
    updateProducto,
    deleteProducto,
    loadMateriales,
    updateMaterialStock
  } = useInventarioStore()

  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState('productos') // 'productos' o 'materiales'

  // Estado para el formulario de productos (creación y edición)
  const [editId, setEditId] = useState(null)
  const [formNombre, setFormNombre] = useState('')
  const [formDescripcion, setFormDescripcion] = useState('')
  const [formPrecio, setFormPrecio] = useState('')
  const [formStock, setFormStock] = useState('')
  const [formCategoria, setFormCategoria] = useState('Hombre - Otoño/Invierno')
  const [formImagenUrl, setFormImagenUrl] = useState('')
  const [formFile, setFormFile] = useState(null)

  // Estado para edición inline en la tabla
  const [inlineEditingId, setInlineEditingId] = useState(null)
  const [inlinePrecio, setInlinePrecio] = useState('')
  const [inlineStock, setInlineStock] = useState('')

  // Estado para ajuste rápido de materias primas
  const [materialAdjustments, setMaterialAdjustments] = useState({})

  useEffect(() => {
    loadProductos()
    loadMateriales()
  }, [])

  // Manejar carga de foto local simulada
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormFile(file)
      // Generar URL temporal local
      const tempUrl = URL.createObjectURL(file)
      setFormImagenUrl(tempUrl)
    }
  }

  // Guardar producto (nuevo o editado)
  const handleSaveProduct = async (e) => {
    e.preventDefault()
    if (!formNombre.trim()) return

    const productData = {
      nombre: formNombre.trim(),
      descripcion: formDescripcion.trim(),
      precio: parseFloat(formPrecio) || 0,
      stock: parseInt(formStock) || 0,
      categoria: formCategoria,
      imagen_url: formImagenUrl
    }

    if (editId) {
      await updateProducto(editId, productData)
      setEditId(null)
    } else {
      await addProducto(productData)
    }

    // Resetear formulario
    resetForm()
  }

  // Cargar producto en el formulario para edición
  const handleStartEdit = (prod) => {
    setEditId(prod.id)
    setFormNombre(prod.nombre)
    setFormDescripcion(prod.descripcion || '')
    setFormPrecio(prod.precio)
    setFormStock(prod.stock)
    setFormCategoria(prod.categoria || 'Hombre - Otoño/Invierno')
    setFormImagenUrl(prod.imagen_url || '')
    setFormFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Resetear el formulario de productos
  const resetForm = () => {
    setEditId(null)
    setFormNombre('')
    setFormDescripcion('')
    setFormPrecio('')
    setFormStock('')
    setFormCategoria('Hombre - Otoño/Invierno')
    setFormImagenUrl('')
    setFormFile(null)
  }

  // Activar edición inline en la tabla
  const handleStartInlineEdit = (prod) => {
    setInlineEditingId(prod.id)
    setInlinePrecio(prod.precio)
    setInlineStock(prod.stock)
  }

  // Guardar edición inline (Precio y Stock)
  const handleSaveInlineEdit = async (id) => {
    await updateProducto(id, {
      precio: parseFloat(inlinePrecio) || 0,
      stock: parseInt(inlineStock) || 0
    })
    setInlineEditingId(null)
  }

  // Eliminar producto
  const handleDeleteProduct = (id, nombre) => {
    if (confirm(`¿Estás seguro de que deseas eliminar "${nombre}" del catálogo?`)) {
      deleteProducto(id)
    }
  }

  // Inicializar o actualizar el ajuste temporal de materias primas
  const handleMaterialAdjustmentChange = (id, val) => {
    setMaterialAdjustments(prev => ({
      ...prev,
      [id]: val
    }))
  }

  // Guardar el stock de material ajustado
  const handleSaveMaterialStock = (id, currentStock) => {
    const adjustment = parseInt(materialAdjustments[id]) || 0
    updateMaterialStock(id, currentStock + adjustment)
    // Limpiar el campo
    setMaterialAdjustments(prev => ({ ...prev, [id]: '' }))
  }

  // Formateador de CLP
  const formatearPrecio = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1>Panel de Administración</h1>
        <p>Control centralizado del catálogo de sombreros y almacén de materias primas</p>
      </div>

      {/* PESTAÑAS DE NAVEGACIÓN */}
      <div className="admin-tabs">
        <button
          className={`tab-link ${activeTab === 'productos' ? 'active' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          📦 Control de Stock (Catálogo)
        </button>
        <button
          className={`tab-link ${activeTab === 'materiales' ? 'active' : ''}`}
          onClick={() => setActiveTab('materiales')}
        >
          🧵 Orden de Materiales (Materias Primas)
        </button>
      </div>

      {error && <div className="admin-alert-error">⚠️ {error}</div>}

      {/* PESTAÑA A: STOCK DE PRODUCTOS */}
      {activeTab === 'productos' && (
        <div className="admin-products-section">
          <div className="admin-two-columns">
            {/* Columna Izquierda: Formulario */}
            <div className="admin-form-column">
              <form onSubmit={handleSaveProduct} className="admin-card-form">
                <h3>{editId ? '📝 Editar Sombrero' : '➕ Agregar Sombrero'}</h3>
                <div className="admin-form-divider"></div>

                <div className="admin-form-group">
                  <label htmlFor="prod-nombre">Nombre del Sombrero *</label>
                  <input
                    type="text"
                    id="prod-nombre"
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    placeholder="Ej: Sombrero Fedora de Fieltro"
                    required
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label htmlFor="prod-precio">Precio (CLP) *</label>
                    <input
                      type="number"
                      id="prod-precio"
                      value={formPrecio}
                      onChange={(e) => setFormPrecio(e.target.value)}
                      placeholder="35000"
                      min="0"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label htmlFor="prod-stock">Stock Inicial *</label>
                    <input
                      type="number"
                      id="prod-stock"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      placeholder="10"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="prod-categoria">Categoría *</label>
                  <select
                    id="prod-categoria"
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value)}
                  >
                    <option value="Hombre - Otoño/Invierno">Hombre - Otoño/Invierno</option>
                    <option value="Hombre - Primavera/Verano">Hombre - Primavera/Verano</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Corporativos">Corporativos</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="prod-imagen">Foto del Producto</label>
                  <input
                    type="file"
                    id="prod-imagen"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="file-input-artisan"
                  />
                  {formImagenUrl && (
                    <div className="admin-photo-preview">
                      <img src={formImagenUrl} alt="Previsualización" />
                      <button type="button" onClick={() => setFormImagenUrl('')} className="btn-remove-photo">✕</button>
                    </div>
                  )}
                </div>

                <div className="admin-form-group">
                  <label htmlFor="prod-desc">Descripción</label>
                  <textarea
                    id="prod-desc"
                    value={formDescripcion}
                    onChange={(e) => setFormDescripcion(e.target.value)}
                    placeholder="Detalles sobre materiales, horma o cuidado del sombrero..."
                    rows="3"
                  />
                </div>

                <div className="admin-form-actions">
                  <button type="submit" className="btn-admin-save" disabled={loading}>
                    {loading ? 'Guardando...' : editId ? 'Actualizar Producto' : 'Crear Producto'}
                  </button>
                  {editId && (
                    <button type="button" onClick={resetForm} className="btn-admin-cancel">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Columna Derecha: Tabla de Inventario */}
            <div className="admin-table-column">
              <div className="admin-table-card">
                <h3>Inventario Actual</h3>
                <div className="table-wrapper-artisan">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Foto</th>
                        <th>Nombre / Categoría</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((prod) => {
                        const isInlineEditing = inlineEditingId === prod.id
                        return (
                          <tr key={prod.id}>
                            <td>
                              <div className="admin-table-thumb">
                                {prod.imagen_url ? (
                                  <img src={prod.imagen_url} alt={prod.nombre} />
                                ) : (
                                  <span>🤠</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="admin-table-info">
                                <span className="admin-table-pname">{prod.nombre}</span>
                                <span className="admin-table-pcat">{prod.categoria || 'Unisex'}</span>
                              </div>
                            </td>
                            <td>
                              {isInlineEditing ? (
                                <input
                                  type="number"
                                  value={inlinePrecio}
                                  onChange={(e) => setInlinePrecio(e.target.value)}
                                  className="inline-edit-input"
                                />
                              ) : (
                                <span className="admin-table-price">{formatearPrecio(prod.precio)}</span>
                              )}
                            </td>
                            <td>
                              {isInlineEditing ? (
                                <input
                                  type="number"
                                  value={inlineStock}
                                  onChange={(e) => setInlineStock(e.target.value)}
                                  className="inline-edit-input"
                                  min="0"
                                />
                              ) : (
                                <span className={`admin-table-stock ${prod.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                  {prod.stock} uds.
                                </span>
                              )}
                            </td>
                            <td>
                              <div className="admin-table-actions">
                                {isInlineEditing ? (
                                  <>
                                    <button
                                      onClick={() => handleSaveInlineEdit(prod.id)}
                                      className="btn-action-done"
                                      title="Guardar cambios rápidos"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      onClick={() => setInlineEditingId(null)}
                                      className="btn-action-cancel"
                                      title="Cancelar"
                                    >
                                      ✕
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleStartInlineEdit(prod)}
                                      className="btn-action-inline"
                                      title="Edición rápida"
                                    >
                                      ⚡
                                    </button>
                                    <button
                                      onClick={() => handleStartEdit(prod)}
                                      className="btn-action-edit"
                                      title="Editar completo"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(prod.id, prod.nombre)}
                                      className="btn-action-delete"
                                      title="Eliminar sombrero"
                                    >
                                      🗑️
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA B: PANEL DE ORDEN DE MATERIALES */}
      {activeTab === 'materiales' && (
        <div className="admin-materials-section">
          <div className="admin-table-card">
            <h3>🧵 Control de Materias Primas</h3>
            <p className="materials-intro">
              Registra los ingresos y egresos de materiales. Ajusta el inventario ingresando la cantidad (+ para compras o - para consumos) y presiona "Ajustar".
            </p>
            
            <div className="table-wrapper-artisan">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Cantidad Disponible</th>
                    <th>Unidad de Medida</th>
                    <th className="align-center-header">Ajuste de Stock</th>
                    <th className="align-center-header">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {materiales.map((mat) => {
                    const adjustmentValue = materialAdjustments[mat.id] || ''
                    return (
                      <tr key={mat.id}>
                        <td>
                          <strong>{mat.nombre}</strong>
                        </td>
                        <td>
                          <span className={`material-stock-display ${mat.stock > 5 ? 'ok' : 'low'}`}>
                            {mat.stock} {mat.unidad}
                          </span>
                        </td>
                        <td>
                          <span className="material-unit-label">{mat.unidad}</span>
                        </td>
                        <td>
                          <div className="material-adjustment-controls">
                            <input
                              type="number"
                              placeholder="+10 o -5"
                              value={adjustmentValue}
                              onChange={(e) => handleMaterialAdjustmentChange(mat.id, e.target.value)}
                              className="material-adjust-input"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="material-action-btn-wrapper">
                            <button
                              onClick={() => handleSaveMaterialStock(mat.id, mat.stock)}
                              className="btn-material-adjust"
                              disabled={!adjustmentValue}
                            >
                              Ajustar Stock
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
