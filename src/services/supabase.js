import { createClient } from '@supabase/supabase-js'

// Validar credenciales de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Credenciales de Supabase no encontradas. Verifica tu archivo .env')
}

// Crear instancia de cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================
// FUNCIONES DE PRODUCTOS
// ============================================================

export const productsService = {
  // Obtener todos los productos
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al obtener productos:', error)
      return { data: null, error }
    }
  },

  // Obtener producto por ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al obtener producto:', error)
      return { data: null, error }
    }
  },

  // Crear nuevo producto (solo admin)
  async create(producto) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .insert([producto])
        .select()
      
      if (error) throw error
      return { data: data?.[0], error: null }
    } catch (error) {
      console.error('Error al crear producto:', error)
      return { data: null, error }
    }
  },

  // Actualizar producto (solo admin)
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return { data: data?.[0], error: null }
    } catch (error) {
      console.error('Error al actualizar producto:', error)
      return { data: null, error }
    }
  },

  // Eliminar producto (solo admin)
  async delete(id) {
    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      return { success: false, error }
    }
  }
}

// ============================================================
// FUNCIONES DE PEDIDOS
// ============================================================

export const ordersService = {
  // Crear nuevo pedido (público)
  async create(pedido) {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .insert([pedido])
        .select()
      
      if (error) throw error
      return { data: data?.[0], error: null }
    } catch (error) {
      console.error('Error al crear pedido:', error)
      return { data: null, error }
    }
  },

  // Obtener todos los pedidos (solo admin)
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al obtener pedidos:', error)
      return { data: null, error }
    }
  },

  // Obtener pedido por ID (solo admin)
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al obtener pedido:', error)
      return { data: null, error }
    }
  },

  // Actualizar estado del pedido (solo admin)
  async updateStatus(id, estado) {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .update({ estado, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
      
      if (error) throw error
      return { data: data?.[0], error: null }
    } catch (error) {
      console.error('Error al actualizar pedido:', error)
      return { data: null, error }
    }
  }
}

// ============================================================
// FUNCIONES DE DETALLES DE PEDIDOS
// ============================================================

export const orderDetailsService = {
  // Crear detalles de pedido (público)
  async createMany(detalles) {
    try {
      const { data, error } = await supabase
        .from('detalle_pedidos')
        .insert(detalles)
        .select()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al crear detalles de pedido:', error)
      return { data: null, error }
    }
  },

  // Obtener detalles de un pedido (solo admin)
  async getByOrderId(pedidoId) {
    try {
      const { data, error } = await supabase
        .from('detalle_pedidos')
        .select('*, productos(*)')
        .eq('pedido_id', pedidoId)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al obtener detalles del pedido:', error)
      return { data: null, error }
    }
  }
}

// ============================================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================================

export const authService = {
  // Iniciar sesión con email
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      return { data: null, error }
    }
  },

  // Registrarse
  async signup(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al registrarse:', error)
      return { data: null, error }
    }
  },

  // Cerrar sesión
  async logout() {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      return { success: false, error }
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) throw error
      return { user, error: null }
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      return { user: null, error }
    }
  },

  // Escuchar cambios en autenticación
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// ============================================================
// FUNCIONES DE STORAGE (Imágenes)
// ============================================================

export const storageService = {
  // Subir imagen (solo admin)
  async uploadImage(bucket, file) {
    try {
      const fileName = `${Date.now()}-${file.name}`
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)
      
      if (error) throw error
      
      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)
      
      return { url: publicUrl, error: null }
    } catch (error) {
      console.error('Error al subir imagen:', error)
      return { url: null, error }
    }
  },

  // Eliminar imagen (solo admin)
  async deleteImage(bucket, filePath) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])
      
      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('Error al eliminar imagen:', error)
      return { success: false, error }
    }
  },

  // Obtener URL pública de imagen
  getPublicUrl(bucket, filePath) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)
    
    return data.publicUrl
  }
}
