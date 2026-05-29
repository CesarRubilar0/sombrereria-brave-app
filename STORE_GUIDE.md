# 📦 Guía del Store (Zustand + Supabase)

## 🎯 Usar el Store en Componentes

```jsx
import { useInventarioStore } from '@/store/inventarioStore'

function MiComponente() {
  // Acceder al estado
  const { productos, carrito, loading, error } = useInventarioStore()
  
  // Acceder a acciones
  const { loadProductos, addProducto, agregarAlCarrito } = useInventarioStore()
  
  return (...)
}
```

---

## 📋 PRODUCTOS

### Cargar todos los productos
```jsx
const { loadProductos } = useInventarioStore()

useEffect(() => {
  loadProductos()
}, [])
```

### Crear producto (solo admin)
```jsx
const { addProducto } = useInventarioStore()

const nuevoProducto = {
  nombre: 'Sombrero Clásico',
  descripcion: 'Sombrero elegante',
  precio: 29.99,
  stock: 10,
  imagen_url: 'https://...'
}

const { success, error } = await addProducto(nuevoProducto)
```

### Actualizar producto (solo admin)
```jsx
const { updateProducto } = useInventarioStore()

await updateProducto(productoId, {
  precio: 35.99,
  stock: 5
})
```

### Eliminar producto (solo admin)
```jsx
const { deleteProducto } = useInventarioStore()

await deleteProducto(productoId)
```

---

## 🛒 CARRITO

### Agregar al carrito
```jsx
const { agregarAlCarrito } = useInventarioStore()

agregarAlCarrito(producto, cantidad)
// cantidad es opcional, por defecto es 1
```

### Eliminar del carrito
```jsx
const { eliminarDelCarrito } = useInventarioStore()

eliminarDelCarrito(productoId)
```

### Actualizar cantidad
```jsx
const { actualizarCantidadCarrito } = useInventarioStore()

actualizarCantidadCarrito(productoId, 5)
```

### Obtener total
```jsx
const { getTotal } = useInventarioStore()

const total = getTotal()
// Retorna el precio total del carrito
```

### Obtener cantidad de items
```jsx
const { getCarritoCount } = useInventarioStore()

const cantidad = getCarritoCount()
// Retorna la cantidad total de items en carrito
```

### Vaciar carrito
```jsx
const { vaciarCarrito } = useInventarioStore()

vaciarCarrito()
```

---

## 👤 INFORMACIÓN DEL CLIENTE

### Actualizar datos del cliente
```jsx
const { setClienteInfo } = useInventarioStore()

setClienteInfo({
  nombre: 'Juan Pérez',
  correo: 'juan@ejemplo.com',
  telefono: '123456789',
  tipoEntrega: 'envío', // 'retiro' o 'envío'
  metodoPago: 'tarjeta' // 'efectivo', 'transferencia', 'tarjeta'
})
```

### Acceder a información del cliente
```jsx
const { clienteInfo } = useInventarioStore()

console.log(clienteInfo.nombre)
console.log(clienteInfo.correo)
```

### Limpiar información del cliente
```jsx
const { clearClienteInfo } = useInventarioStore()

clearClienteInfo()
```

---

## 📦 PEDIDOS

### Crear pedido
```jsx
const { crearPedido, carrito, clienteInfo } = useInventarioStore()

// 1. Agregar productos al carrito
agregarAlCarrito(producto1, 2)
agregarAlCarrito(producto2, 1)

// 2. Establecer información del cliente
setClienteInfo({
  nombre: 'Juan',
  correo: 'juan@ejemplo.com',
  telefono: '123456789',
  tipoEntrega: 'envío',
  metodoPago: 'transferencia'
})

// 3. Crear el pedido
const { success, pedido, error } = await crearPedido()

if (success) {
  console.log('Pedido creado:', pedido.id)
}
```

### Cargar pedidos (solo admin)
```jsx
const { loadPedidos } = useInventarioStore()

useEffect(() => {
  loadPedidos()
}, [])
```

### Acceder a pedidos
```jsx
const { pedidos, pedidoActual } = useInventarioStore()

pedidos.forEach(pedido => {
  console.log(`Pedido #${pedido.id}:`, pedido.total)
})
```

---

## 🧹 LIMPIAR

### Limpiar todo
```jsx
const { clearAll } = useInventarioStore()

clearAll()
// Limpia carrito, información del cliente, y errores
```

---

## ⚠️ MANEJO DE ERRORES

```jsx
const { error, loading } = useInventarioStore()

if (loading) return <div>Cargando...</div>
if (error) return <div>Error: {error}</div>

return <div>Contenido</div>
```

---

## 📂 ESTRUCTURA DE DATOS

### Producto
```javascript
{
  id: 'uuid',
  nombre: 'string',
  descripcion: 'string',
  precio: 10.99,
  stock: 5,
  imagen_url: 'string',
  created_at: '2024-05-29T...',
  updated_at: '2024-05-29T...'
}
```

### Pedido
```javascript
{
  id: 'uuid',
  nombre_cliente: 'string',
  correo: 'string',
  telefono: 'string',
  tipo_entrega: 'envío' | 'retiro',
  metodo_pago: 'efectivo' | 'transferencia' | 'tarjeta',
  total: 99.99,
  estado: 'pendiente' | 'completado' | 'cancelado',
  created_at: '2024-05-29T...',
  updated_at: '2024-05-29T...'
}
```

---

## 🔗 EJEMPLO COMPLETO - PÁGINA DE COMPRA

```jsx
import { useEffect } from 'react'
import { useInventarioStore } from '@/store/inventarioStore'

export default function CompraPage() {
  const { 
    productos, 
    carrito, 
    loading, 
    loadProductos, 
    agregarAlCarrito,
    setClienteInfo,
    crearPedido,
    getTotal
  } = useInventarioStore()

  useEffect(() => {
    loadProductos()
  }, [])

  const handleAgregar = (producto) => {
    agregarAlCarrito(producto, 1)
  }

  const handleCompra = async () => {
    setClienteInfo({
      nombre: 'Juan Pérez',
      correo: 'juan@example.com',
      telefono: '123456789',
      tipoEntrega: 'envío',
      metodoPago: 'transferencia'
    })

    const { success, pedido } = await crearPedido()
    
    if (success) {
      alert(`¡Pedido creado! #${pedido.id}`)
    }
  }

  if (loading) return <div>Cargando productos...</div>

  return (
    <div>
      <h1>Tienda</h1>
      
      <div>
        {productos.map(producto => (
          <div key={producto.id}>
            <h3>{producto.nombre}</h3>
            <p>${producto.precio}</p>
            <button onClick={() => handleAgregar(producto)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>

      <div>
        <h2>Carrito ({carrito.length})</h2>
        <p>Total: ${getTotal().toFixed(2)}</p>
        {carrito.length > 0 && (
          <button onClick={handleCompra}>Finalizar compra</button>
        )}
      </div>
    </div>
  )
}
```

---

## ✅ Checklist de Integración

- [ ] Importar `useInventarioStore` en componentes
- [ ] Cargar productos en `HomePage` o `InventarioPage`
- [ ] Implementar agregar al carrito en `ProductCard`
- [ ] Crear página de checkout con información del cliente
- [ ] Implementar visualización de carrito en `Navbar`
- [ ] Crear página de administración para gestionar productos
- [ ] Implementar página de pedidos (solo admin)
