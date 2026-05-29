-- ============================================================
-- SCRIPT SQL COMPLETO - SOMBRERERÍA BRAVE
-- Base de datos y políticas de seguridad para Supabase
-- ============================================================

-- ============================================================
-- 1. TABLA PRODUCTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    imagen_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_created_at ON productos(created_at);

-- ============================================================
-- 2. TABLA PEDIDOS
-- ============================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_cliente VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    tipo_entrega VARCHAR(50) NOT NULL CHECK (tipo_entrega IN ('envío', 'retiro')),
    metodo_pago VARCHAR(50) NOT NULL CHECK (metodo_pago IN ('transferencia', 'efectivo', 'tarjeta')),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completado', 'cancelado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_created_at ON pedidos(created_at);
CREATE INDEX idx_pedidos_correo ON pedidos(correo);

-- ============================================================
-- 3. TABLA DETALLE_PEDIDOS
-- ============================================================
CREATE TABLE IF NOT EXISTS detalle_pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario > 0),
    subtotal DECIMAL(10, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_detalle_pedidos_pedido_id ON detalle_pedidos(pedido_id);
CREATE INDEX idx_detalle_pedidos_producto_id ON detalle_pedidos(producto_id);

-- ============================================================
-- 4. TABLA PROFILES (para gestionar roles de usuarios)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. POLÍTICAS DE SEGURIDAD (RLS) - PRODUCTOS
-- ============================================================

-- Habilitar RLS en tabla productos
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Política: Lectura pública (cualquiera puede ver los productos)
CREATE POLICY "Productos - Lectura Pública" ON productos
    FOR SELECT
    USING (true);

-- Política: Solo admin puede insertar productos
CREATE POLICY "Productos - Insertar Solo Admin" ON productos
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

-- Política: Solo admin puede actualizar productos
CREATE POLICY "Productos - Actualizar Solo Admin" ON productos
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

-- Política: Solo admin puede eliminar productos
CREATE POLICY "Productos - Eliminar Solo Admin" ON productos
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

-- ============================================================
-- 6. POLÍTICAS DE SEGURIDAD (RLS) - PEDIDOS
-- ============================================================

-- Habilitar RLS en tabla pedidos
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede insertar pedidos (clientes comprando)
CREATE POLICY "Pedidos - Insertar Público" ON pedidos
    FOR INSERT
    WITH CHECK (true);

-- Política: Solo admin puede leer todos los pedidos
CREATE POLICY "Pedidos - Lectura Solo Admin" ON pedidos
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

-- Política: Solo admin puede actualizar pedidos
CREATE POLICY "Pedidos - Actualizar Solo Admin" ON pedidos
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

-- Política: Solo admin puede eliminar pedidos
CREATE POLICY "Pedidos - Eliminar Solo Admin" ON pedidos
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

-- ============================================================
-- 7. POLÍTICAS DE SEGURIDAD (RLS) - DETALLE_PEDIDOS
-- ============================================================

-- Habilitar RLS en tabla detalle_pedidos
ALTER TABLE detalle_pedidos ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede insertar detalles de pedidos
CREATE POLICY "Detalle Pedidos - Insertar Público" ON detalle_pedidos
    FOR INSERT
    WITH CHECK (true);

-- Política: Solo admin puede leer detalles de pedidos
CREATE POLICY "Detalle Pedidos - Lectura Solo Admin" ON detalle_pedidos
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

-- Política: Solo admin puede actualizar detalles de pedidos
CREATE POLICY "Detalle Pedidos - Actualizar Solo Admin" ON detalle_pedidos
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

-- Política: Solo admin puede eliminar detalles de pedidos
CREATE POLICY "Detalle Pedidos - Eliminar Solo Admin" ON detalle_pedidos
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

-- ============================================================
-- 8. POLÍTICAS DE SEGURIDAD (RLS) - PROFILES
-- ============================================================

-- Habilitar RLS en tabla profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden leer su propio perfil
CREATE POLICY "Profiles - Lectura Propia" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Política: Solo admin puede ver todos los perfiles
CREATE POLICY "Profiles - Lectura Admin" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

-- Política: Los usuarios pueden actualizar su propio perfil (pero no is_admin)
CREATE POLICY "Profiles - Actualizar Propio" ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND is_admin = false);

-- ============================================================
-- 9. INSTRUCCIONES PARA STORAGE (ejecutar por separado en Supabase)
-- ============================================================

-- En el dashboard de Supabase:
-- 1. Ir a Storage → Create new bucket
-- 2. Nombre: "imagenes-sombreros"
-- 3. Hacer el bucket PÚBLICO
-- 4. En Policies, permitir:
--    - SELECT (lectura): público
--    - INSERT (subida): solo admin autenticado
--    - UPDATE (edición): solo admin autenticado
--    - DELETE (eliminación): solo admin autenticado

-- Script SQL para Storage Policies (ejecutar en SQL Editor):
/*
-- Crear bucket (si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('imagenes-sombreros', 'imagenes-sombreros', true)
ON CONFLICT DO NOTHING;

-- Política: Lectura pública
CREATE POLICY "Public Read imagenes-sombreros" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'imagenes-sombreros');

-- Política: Solo admin puede subir imágenes
CREATE POLICY "Admin Upload imagenes-sombreros" ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'imagenes-sombreros'
        AND EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

-- Política: Solo admin puede actualizar imágenes
CREATE POLICY "Admin Update imagenes-sombreros" ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'imagenes-sombreros'
        AND EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

-- Política: Solo admin puede eliminar imágenes
CREATE POLICY "Admin Delete imagenes-sombreros" ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'imagenes-sombreros'
        AND EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );
*/

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
