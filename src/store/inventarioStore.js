import { create } from 'zustand'
import { productsService, ordersService, orderDetailsService } from '../services/supabase'

// ============================================================
// STORE DE INVENTARIO CON SUPABASE
// ============================================================

export const useInventarioStore = create((set, get) => ({
  // ============================================================
  // ESTADO - PRODUCTOS
  // ============================================================
  productos: [],
  loading: false,
  error: null,

  // ============================================================
  // ESTADO - CARRITO
  // ============================================================
  carrito: [],
  clienteInfo: {
    nombre: '',
    correo: '',
    telefono: '',
    tipoEntrega: 'retiro', // 'retiro' o 'envío'
    metodoPago: 'efectivo' // 'efectivo', 'transferencia', 'tarjeta'
  },

  // ============================================================
  // ESTADO - PEDIDOS
  // ============================================================
  pedidos: [],
  pedidoActual: null,

  // ============================================================
  // ESTADO - AUTENTICACIÓN
  // ============================================================
  isAdminAuthenticated: localStorage.getItem('admin_auth') === 'true',

  // ============================================================
  // ACCIONES - PRODUCTOS
  // ============================================================

  // Cargar productos desde Supabase
  loadProductos: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await productsService.getAll()
      if (error) throw error
      set({ productos: data || [], loading: false })
      return { success: true }
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('❌ Error al cargar productos:', error)
      return { success: false, error: error.message }
    }
  },

  // Crear producto (solo admin)
  addProducto: async (producto) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await productsService.create(producto)
      if (error) throw error
      
      set((state) => ({
        productos: [data, ...state.productos],
        loading: false
      }))
      return { success: true, data }
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('❌ Error al crear producto:', error)
      return { success: false, error: error.message }
    }
  },

  // Actualizar producto (solo admin)
  updateProducto: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await productsService.update(id, updates)
      if (error) throw error
      
      set((state) => ({
        productos: state.productos.map((p) =>
          p.id === id ? data : p
        ),
        loading: false
      }))
      return { success: true, data }
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('❌ Error al actualizar producto:', error)
      return { success: false, error: error.message }
    }
  },

  // Eliminar producto (solo admin)
  deleteProducto: async (id) => {
    set({ loading: true, error: null })
    try {
      const { success, error } = await productsService.delete(id)
      if (error) throw error
      
      set((state) => ({
        productos: state.productos.filter((p) => p.id !== id),
        loading: false
      }))
      return { success: true }
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('❌ Error al eliminar producto:', error)
      return { success: false, error: error.message }
    }
  },

  // ============================================================
  // ACCIONES - CARRITO
  // ============================================================

  // Agregar producto al carrito
  agregarAlCarrito: (producto, cantidad = 1) => {
    set((state) => {
      const itemExistente = state.carrito.find((item) => item.id === producto.id)
      
      if (itemExistente) {
        return {
          carrito: state.carrito.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          )
        }
      }
      
      return {
        carrito: [...state.carrito, { ...producto, cantidad }]
      }
    })
  },

  // Eliminar producto del carrito
  eliminarDelCarrito: (productoId) => {
    set((state) => ({
      carrito: state.carrito.filter((item) => item.id !== productoId)
    }))
  },

  // Actualizar cantidad en carrito
  actualizarCantidadCarrito: (productoId, cantidad) => {
    set((state) => ({
      carrito: state.carrito.map((item) =>
        item.id === productoId ? { ...item, cantidad: Math.max(1, cantidad) } : item
      )
    }))
  },

  // Vaciar carrito
  vaciarCarrito: () => set({ carrito: [] }),

  // Obtener total del carrito
  getTotal: () => {
    const { carrito } = get()
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0)
  },

  // Obtener cantidad de items en carrito
  getCarritoCount: () => {
    const { carrito } = get()
    return carrito.reduce((count, item) => count + item.cantidad, 0)
  },

  // ============================================================
  // ACCIONES - INFORMACIÓN DEL CLIENTE
  // ============================================================

  // Actualizar información del cliente
  setClienteInfo: (info) => {
    set((state) => ({
      clienteInfo: { ...state.clienteInfo, ...info }
    }))
  },

  // Limpiar información del cliente
  clearClienteInfo: () => {
    set({
      clienteInfo: {
        nombre: '',
        correo: '',
        telefono: '',
        tipoEntrega: 'retiro',
        metodoPago: 'efectivo'
      }
    })
  },

  // ============================================================
  // ACCIONES - PEDIDOS
  // ============================================================

  // Crear pedido
  crearPedido: async () => {
    set({ loading: true, error: null })
    try {
      const { carrito, clienteInfo, getTotal } = get()
      
      if (carrito.length === 0) {
        throw new Error('El carrito está vacío')
      }
      
      if (!clienteInfo.nombre || !clienteInfo.correo) {
        throw new Error('Completa la información del cliente')
      }
      
      const total = getTotal()
      
      // Crear pedido
      const { data: pedido, error: errorPedido } = await ordersService.create({
        nombre_cliente: clienteInfo.nombre,
        correo: clienteInfo.correo,
        telefono: clienteInfo.telefono,
        tipo_entrega: clienteInfo.tipoEntrega,
        metodo_pago: clienteInfo.metodoPago,
        total: total,
        estado: 'pendiente'
      })
      
      if (errorPedido) throw errorPedido
      
      // Crear detalles del pedido
      const detalles = carrito.map((item) => ({
        pedido_id: pedido.id,
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio
      }))
      
      const { error: errorDetalles } = await orderDetailsService.createMany(detalles)
      if (errorDetalles) throw errorDetalles
      
      // Actualizar estado
      set((state) => ({
        pedidos: [pedido, ...state.pedidos],
        pedidoActual: pedido,
        carrito: [],
        loading: false
      }))
      
      return { success: true, pedido }
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('❌ Error al crear pedido:', error)
      return { success: false, error: error.message }
    }
  },

  // Cargar pedidos (solo admin)
  loadPedidos: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await ordersService.getAll()
      if (error) throw error
      set({ pedidos: data || [], loading: false })
      return { success: true }
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('❌ Error al cargar pedidos:', error)
      return { success: false, error: error.message }
    }
  },

  // ============================================================
  // ACCIONES - UTILIDADES
  // ============================================================

  // Limpiar carrito y estado
  clearAll: () => {
    set({
      carrito: [],
      clienteInfo: {
        nombre: '',
        correo: '',
        telefono: '',
        tipoEntrega: 'retiro',
        metodoPago: 'efectivo'
      },
      pedidoActual: null,
      error: null
    })
  },

  // Acción: Iniciar sesión de Administrador (Local)
  loginAdmin: async (email, password) => {
    set({ loading: true, error: null })
    // Simular un pequeño retardo de red para mejor UX (efecto premium)
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (email === 'admin@sombrerosbrave.cl' && password === 'brave2026') {
      localStorage.setItem('admin_auth', 'true');
      set({ isAdminAuthenticated: true, loading: false });
      return { success: true };
    } else {
      set({ loading: false, error: 'Credenciales de administrador inválidas.' });
      return { success: false, error: 'Credenciales de administrador inválidas.' };
    }
  },

  // Acción: Cerrar sesión de Administrador
  logoutAdmin: () => {
    localStorage.removeItem('admin_auth');
    set({ isAdminAuthenticated: false });
  }
}))
