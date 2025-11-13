-- ================================================
-- SMART RIDE - DATABASE INITIALIZATION SCRIPT
-- PostgreSQL 17
-- IDs: ENTEROS AUTO-INCREMENT
-- ================================================


-- ================================================
-- TABLA: usuarios
-- ================================================
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    foto_perfil TEXT,
    fecha_nacimiento DATE,
    genero VARCHAR(30) CHECK (genero IN ('masculino', 'femenino', 'otro', 'prefiero_no_decir')),
    rol VARCHAR(20) NOT NULL DEFAULT 'pasajero' CHECK (rol IN ('pasajero', 'conductor', 'admin')),
    estado_cuenta VARCHAR(20) NOT NULL DEFAULT 'activa' CHECK (estado_cuenta IN ('activa', 'suspendida', 'eliminada')),
    email_verificado BOOLEAN DEFAULT FALSE,
    telefono_verificado BOOLEAN DEFAULT FALSE,
    fecha_registro TIMESTAMP NOT NULL DEFAULT NOW(),
    ultima_conexion TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_telefono ON usuarios(telefono);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_estado ON usuarios(estado_cuenta);

-- ================================================
-- TABLA: conductores
-- ================================================
CREATE TABLE conductores (
    id_conductor SERIAL PRIMARY KEY,
    id_usuario INTEGER UNIQUE NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    numero_licencia VARCHAR(50) UNIQUE NOT NULL,
    tipo_licencia VARCHAR(5) CHECK (tipo_licencia IN ('A', 'B', 'C')),
    fecha_vencimiento_licencia DATE NOT NULL,
    foto_licencia_frontal TEXT,
    foto_licencia_posterior TEXT,
    marca_auto VARCHAR(50) NOT NULL,
    modelo_auto VARCHAR(50) NOT NULL,
    placa_auto VARCHAR(20) UNIQUE NOT NULL,
    estado_conductor VARCHAR(20) NOT NULL DEFAULT 'inactivo' CHECK (estado_conductor IN ('disponible', 'ocupado', 'inactivo', 'fuera_servicio')),
    calificacion_promedio DECIMAL(3,2) DEFAULT 5.00 CHECK (calificacion_promedio >= 0 AND calificacion_promedio <= 5),
    total_viajes INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para conductores
CREATE INDEX idx_conductores_usuario ON conductores(id_usuario);
CREATE INDEX idx_conductores_licencia ON conductores(numero_licencia);
CREATE INDEX idx_conductores_placa ON conductores(placa_auto);
CREATE INDEX idx_conductores_estado ON conductores(estado_conductor);

-- ================================================
-- TABLA: tokens_sesiones
-- ================================================
CREATE TABLE tokens_sesiones (
    id_token SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    token_jwt TEXT NOT NULL,
    refresh_token TEXT,
    tipo_dispositivo VARCHAR(20) CHECK (tipo_dispositivo IN ('web', 'android', 'ios')),
    direccion_ip VARCHAR(45),
    user_agent TEXT,
    fecha_expiracion TIMESTAMP NOT NULL,
    fecha_ultimo_uso TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'revocado', 'expirado')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para tokens
CREATE INDEX idx_tokens_usuario ON tokens_sesiones(id_usuario);
CREATE INDEX idx_tokens_jwt ON tokens_sesiones(token_jwt);
CREATE INDEX idx_tokens_estado ON tokens_sesiones(estado);
CREATE INDEX idx_tokens_expiracion ON tokens_sesiones(fecha_expiracion);

-- ================================================
-- TRIGGERS PARA UPDATED_AT
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conductores_updated_at BEFORE UPDATE ON conductores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- SELECT * FROM usuarios;
-- SELECT * FROM conductores;
-- SELECT * FROM tokens_sesiones;