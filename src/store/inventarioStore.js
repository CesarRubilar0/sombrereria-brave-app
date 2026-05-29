import { create } from 'zustand'

// ============================================================
// DATOS INICIALES DE DEMOSTRACIÓN CON FOTOS DE UNSPLASH
// ============================================================
const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    nombre: 'Sombrero Vaquero Cuero Crupón',
    descripcion: 'Sombrero estilo cowboy fabricado en cuero crupón de alta resistencia. Ideal para el aire libre.',
    precio: 59900,
    categoria: 'Hombre - Otoño/Invierno',
    stock: 8,
    imagen_url: 'https://images.unsplash.com/photo-1533681904393-9ab6efe7870f?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'prod-2',
    nombre: 'Boina Comando Lana Merino',
    descripcion: 'Tradicional boina militar comando en lana merino negra. Ajuste perfecto y abrigo superior.',
    precio: 34900,
    categoria: 'Hombre - Otoño/Invierno',
    stock: 12,
    imagen_url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'prod-3',
    nombre: 'Sombrero Huaso Fieltro Pelo',
    descripcion: 'Sombrero tradicional de huaso chileno fabricado en fieltro de pelo de liebre. Acabado extra fino.',
    precio: 120000,
    categoria: 'Hombre - Otoño/Invierno',
    stock: 5,
    imagen_url: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'prod-4',
    nombre: 'Pamela Dama Ala Ancha',
    descripcion: 'Elegante sombrero de sol para mujer con ala ancha. Adornado con cinta de cuero sutil.',
    precio: 45900,
    categoria: 'Mujer',
    stock: 6,
    imagen_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'prod-5',
    nombre: 'Sombrero Chupalla Huasa Especial',
    descripcion: 'Chupalla chilena de paja de trigo tejida a mano de 4 hebras. Tradición del campo chileno.',
    precio: 79900,
    categoria: 'Hombre - Primavera/Verano',
    stock: 4,
    imagen_url: 'https://images.unsplash.com/photo-1595959183075-c1d09e57091c?q=80&w=400&auto=format&fit=crop'
  }
];

const DEFAULT_MATERIALS = [
  { id: 'mat-1', nombre: 'Paño de lana', stock: 15, unidad: 'unidades' },
  { id: 'mat-2', nombre: 'Cintas de cuero', stock: 50, unidad: 'metros' },
  { id: 'mat-3', nombre: 'Forros de seda', stock: 25, unidad: 'metros' }
];

// ============================================================
// STORE DE INVENTARIO CON BASE LOCAL (ZUSTAND + LOCALSTORAGE)
// ============================================================
export const useInventarioStore = create((set, get) => ({
  // ESTADO - PRODUCTOS
  productos: JSON.parse(localStorage.getItem('local_productos')) || DEFAULT_PRODUCTS,
  loading: false,
  error: null,

  // ESTADO - CARRITO
  carrito: [],
  clienteInfo: {
    nombre: '',
    correo: '',
    telefono: '',
    tipoEntrega: 'retiro', // 'retiro' o 'envío'
    metodoPago: 'efectivo' // 'efectivo', 'transferencia', 'tarjeta'
  },

  // ESTADO - PEDIDOS
  pedidos: JSON.parse(localStorage.getItem('local_pedidos')) || [],
  pedidoActual: null,

  // ESTADO - MATERIAS PRIMAS
  materiales: JSON.parse(localStorage.getItem('local_materiales')) || DEFAULT_MATERIALS,

  // ESTADO - AUTENTICACIÓN
  isAdminAuthenticated: localStorage.getItem('admin_auth') === 'true',

  // ============================================================
  // ACCIONES - PRODUCTOS (100% LOCALES)
  // ============================================================

  // Cargar productos
  loadProductos: async () => {
    set({ loading: true, error: null })
    try {
      const local = localStorage.getItem('local_productos')
      if (!local) {
        localStorage.setItem('local_productos', JSON.stringify(DEFAULT_PRODUCTS))
        set({ productos: DEFAULT_PRODUCTS })
      } else {
        set({ productos: JSON.parse(local) })
      }
      set({ loading: false })
      return { success: true }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Crear/Agregar producto (Zustand Local)
  addProducto: async (producto) => {
    set({ loading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      
      const { productos } = get()
      const nuevoProducto = {
        id: 'prod-' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...producto
      }
      
      const nuevosProductos = [nuevoProducto, ...productos]
      localStorage.setItem('local_productos', JSON.stringify(nuevosProductos))
      
      set({ productos: nuevosProductos, loading: false })
      return { success: true, data: nuevoProducto }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Alias para agregarProducto
  agregarProducto: (producto) => get().addProducto(producto),

  // Actualizar/Editar producto (Zustand Local)
  updateProducto: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 200))
      
      const { productos } = get()
      const nuevosProductos = productos.map((p) =>
        p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
      )
      
      localStorage.setItem('local_productos', JSON.stringify(nuevosProductos))
      
      set({ productos: nuevosProductos, loading: false })
      const updated = nuevosProductos.find(p => p.id === id)
      return { success: true, data: updated }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Alias para editarProducto
  editarProducto: (id, updates) => get().updateProducto(id, updates),

  // Eliminar producto (Zustand Local)
  deleteProducto: async (id) => {
    set({ loading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 200))
      
      const { productos } = get()
      const nuevosProductos = productos.filter((p) => p.id !== id)
      
      localStorage.setItem('local_productos', JSON.stringify(nuevosProductos))
      
      set({ productos: nuevosProductos, loading: false })
      return { success: true }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Alias para eliminarProducto
  eliminarProducto: (id) => get().deleteProducto(id),

  // ============================================================
  // ACCIONES - MATERIAS PRIMAS (100% LOCALES)
  // ============================================================

  // Cargar materiales
  loadMateriales: () => {
    const local = localStorage.getItem('local_materiales')
    if (local) {
      set({ materiales: JSON.parse(local) })
    } else {
      localStorage.setItem('local_materiales', JSON.stringify(DEFAULT_MATERIALS))
      set({ materiales: DEFAULT_MATERIALS })
    }
  },

  // Actualizar cantidad de material
  updateMaterialStock: (id, newStock) => {
    const { materiales } = get()
    const nuevosMateriales = materiales.map((m) =>
      m.id === id ? { ...m, stock: Math.max(0, newStock) } : m
    )
    
    localStorage.setItem('local_materiales', JSON.stringify(nuevosMateriales))
    set({ materiales: nuevosMateriales })
    return { success: true }
  },

  // Alias para actualizarStockMaterial
  actualizarStockMaterial: (id, newStock) => get().updateMaterialStock(id, newStock),

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
  // ACCIONES - PEDIDOS (100% LOCALES)
  // ============================================================

  // Crear pedido
  crearPedido: async () => {
    set({ loading: true, error: null })
    try {
      const { carrito, clienteInfo, getTotal, pedidos } = get()
      
      if (carrito.length === 0) {
        throw new Error('El carrito está vacío')
      }
      
      if (!clienteInfo.nombre || !clienteInfo.correo) {
        throw new Error('Completa la información del cliente')
      }
      
      const total = getTotal()
      
      // Crear pedido
      const nuevoPedido = {
        id: 'order-' + Date.now(),
        nombre_cliente: clienteInfo.nombre,
        correo: clienteInfo.correo,
        telefono: clienteInfo.telefono,
        tipo_entrega: clienteInfo.tipoEntrega,
        metodo_pago: clienteInfo.metodoPago,
        total: total,
        estado: 'pendiente',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const nuevosPedidos = [nuevoPedido, ...pedidos]
      localStorage.setItem('local_pedidos', JSON.stringify(nuevosPedidos))
      
      // Descontar stock localmente para cada sombrero comprado
      const { productos } = get()
      const nuevosProductos = productos.map(prod => {
        const itemEnCarrito = carrito.find(c => c.id === prod.id)
        if (itemEnCarrito) {
          return { ...prod, stock: Math.max(0, prod.stock - itemEnCarrito.cantidad) }
        }
        return prod
      })
      localStorage.setItem('local_productos', JSON.stringify(nuevosProductos))
      
      set({
        pedidos: nuevosPedidos,
        pedidoActual: nuevoPedido,
        productos: nuevosProductos,
        carrito: [],
        loading: false
      })
      
      return { success: true, pedido: nuevoPedido }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Cargar pedidos
  loadPedidos: async () => {
    set({ loading: true, error: null })
    try {
      const local = localStorage.getItem('local_pedidos')
      const data = local ? JSON.parse(local) : []
      set({ pedidos: data, loading: false })
      return { success: true }
    } catch (error) {
      set({ error: error.message, loading: false })
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

  // Iniciar sesión de Administrador (Local)
  loginAdmin: async (email, password) => {
    set({ loading: true, error: null })
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    if (email === 'admin@sombrerosbrave.cl' && password === 'brave2026') {
      localStorage.setItem('admin_auth', 'true')
      set({ isAdminAuthenticated: true, loading: false })
      return { success: true }
    } else {
      set({ loading: false, error: 'Credenciales de administrador inválidas.' })
      return { success: false, error: 'Credenciales de administrador inválidas.' }
    }
  },

  // Cerrar sesión de Administrador
  logoutAdmin: () => {
    localStorage.removeItem('admin_auth')
    set({ isAdminAuthenticated: false })
  }
}))
