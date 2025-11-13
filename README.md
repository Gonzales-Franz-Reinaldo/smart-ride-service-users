# 🚕 Smart Ride - Users Service

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)

**Microservicio de gestión de usuarios, conductores y autenticación para Smart Ride**

[Características](#-características) •
[Instalación](#-instalación) •
[API](#-api-endpoints) •
[GraphQL](#-graphql) •
[Base de Datos](#️-base-de-datos)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [API Endpoints](#-api-endpoints)
- [GraphQL](#-graphql)
- [Base de Datos](#️-base-de-datos)
- [Arquitectura](#️-arquitectura)
- [Docker](#-docker)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Descripción

Microservicio RESTful y GraphQL construido con **NestJS** para gestionar usuarios, conductores y autenticación mediante JWT. Incluye control de roles (pasajero, conductor, admin), gestión de sesiones de tokens y verificación de perfiles.

### 🎨 Casos de Uso

- ✅ Registro de usuarios con validación de datos
- ✅ Autenticación segura con JWT (access + refresh tokens)
- ✅ Gestión de perfiles de pasajeros y conductores
- ✅ Control de acceso basado en roles
- ✅ CRUD completo de usuarios y conductores
- ✅ API REST + GraphQL para máxima flexibilidad

---

## ✨ Características

### Autenticación y Autorización

- ✅ **JWT Authentication** - Tokens de acceso (24h) y refresh (7d)
- ✅ **Role-Based Access Control** - Pasajero, Conductor, Admin
- ✅ **Session Management** - Control de tokens activos/revocados
- ✅ **Password Hashing** - bcrypt con 10 rounds
- ✅ **Refresh Token Rotation** - Renovación automática de tokens

### API

- ✅ **REST API** - Endpoints RESTful completos
- ✅ **GraphQL API** - Queries y mutations tipadas
- ✅ **Swagger Documentation** - Documentación interactiva
- ✅ **GraphQL Playground** - Interfaz de pruebas
- ✅ **Data Validation** - class-validator + class-transformer
- ✅ **Error Handling** - Manejo consistente de errores

### Base de Datos

- ✅ **PostgreSQL** - Base de datos relacional
- ✅ **TypeORM** - ORM con TypeScript
- ✅ **Migrations** - Control de versiones de BD
- ✅ **Auto-increment IDs** - IDs numéricos (SERIAL)
- ✅ **Soft Deletes** - Eliminación lógica de registros

### DevOps

- ✅ **Dockerizado** - Imagen multi-stage optimizada
- ✅ **Health Checks** - Monitoreo de servicio y BD
- ✅ **Logging** - Winston con niveles configurables
- ✅ **Environment Config** - Configuración por entorno
- ✅ **Non-root User** - Seguridad en contenedores

---

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **NestJS** | 10.4.15 | Framework backend |
| **TypeScript** | 5.6.3 | Lenguaje tipado |
| **PostgreSQL** | 17 | Base de datos |
| **TypeORM** | 0.3.20 | ORM |
| **GraphQL** | 16.9.0 | API de consultas |
| **Apollo Server** | 4.11.2 | Servidor GraphQL |
| **Passport JWT** | 4.0.1 | Estrategia de autenticación |
| **bcrypt** | 5.1.1 | Hashing de contraseñas |
| **class-validator** | 0.14.1 | Validación de DTOs |
| **Winston** | 3.17.0 | Logging |
| **Swagger** | 8.0.7 | Documentación API |

---

## 🚀 Instalación

### Prerequisitos

- **Node.js** >= 20.x
- **PostgreSQL** >= 17.x
- **npm** >= 10.x

### Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Crear base de datos
createdb db_usuarios_smart_ride

# 4. Ejecutar script SQL
psql -d db_usuarios_smart_ride -f src/database/db_smartride_users.sql

# 5. Iniciar en modo desarrollo
npm run start:dev
```

**El servicio estará disponible en:**

- **REST API**: `http://localhost:3001/api/v1`
- **GraphQL**: `http://localhost:3001/graphql`
- **Swagger**: `http://localhost:3001/api/v1/docs`
- **Health Check**: `http://localhost:3001/api/v1/health`

---

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del servicio:

```env
# Aplicación
NODE_ENV=development
PORT=3001
APP_NAME=Smart Ride - Users Service (Dev)
API_PREFIX=api/v1

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu-password
DB_DATABASE=db_usuarios_smart_ride
DB_SYNC=false
DB_LOGGING=false

# JWT (Generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=tu-secret-jwt-de-64-caracteres-aqui
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=tu-refresh-secret-de-64-caracteres-aqui
JWT_REFRESH_EXPIRATION=7d

# Configuración
CORS_ORIGIN=*
GRAPHQL_PLAYGROUND=true
GRAPHQL_DEBUG=false
LOG_LEVEL=info
```

> ⚠️ **Importante**: Genera secrets únicos para producción:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Configuración por Entorno

**Desarrollo:**
```env
NODE_ENV=development
DB_SYNC=true
DB_LOGGING=true
GRAPHQL_PLAYGROUND=true
LOG_LEVEL=debug
```

**Producción:**
```env
NODE_ENV=production
DB_SYNC=false
DB_LOGGING=false
GRAPHQL_PLAYGROUND=false
LOG_LEVEL=warn
```

---

## 📡 API Endpoints

### Base URL

```
http://localhost:3001/api/v1
```

### Autenticación

| Método | Endpoint | Descripción | Auth | Roles |
|--------|----------|-------------|------|-------|
| `POST` | `/auth/register` | Registrar nuevo usuario | ❌ | - |
| `POST` | `/auth/login` | Iniciar sesión | ❌ | - |
| `POST` | `/auth/refresh` | Refrescar access token | ❌ | - |
| `GET` | `/auth/profile` | Obtener perfil actual | ✅ | Todos |
| `POST` | `/auth/logout` | Cerrar sesión | ✅ | Todos |

### Usuarios

| Método | Endpoint | Descripción | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/users` | Listar usuarios | ✅ | Todos |
| `GET` | `/users/:id` | Obtener usuario por ID | ✅ | Todos |
| `POST` | `/users` | Crear usuario | ✅ | Admin |
| `PATCH` | `/users/:id` | Actualizar usuario | ✅ | Propio/Admin |
| `DELETE` | `/users/:id` | Eliminar usuario | ✅ | Admin |

### Conductores

| Método | Endpoint | Descripción | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/users/conductores/all` | Listar conductores | ✅ | Todos |
| `GET` | `/users/conductores/:id` | Obtener conductor | ✅ | Todos |
| `POST` | `/users/conductores` | Crear perfil conductor | ✅ | Admin |
| `PATCH` | `/users/conductores/:id` | Actualizar conductor | ✅ | Propio/Admin |
| `DELETE` | `/users/conductores/:id` | Eliminar conductor | ✅ | Admin |

### Health

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/health` | Estado del servicio y BD | ❌ |

---

## 📚 Ejemplos de Uso

### 1. Registrar Usuario Pasajero

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@example.com",
    "telefono": "+59171234567",
    "password": "Password123!",
    "rol": "pasajero"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id_usuario": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@example.com",
    "telefono": "+59171234567",
    "rol": "pasajero",
    "estado_cuenta": "activa",
    "email_verificado": false,
    "fecha_registro": "2025-11-13T10:00:00.000Z",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@example.com",
    "password": "Password123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id_usuario": 1,
    "nombre": "Juan",
    "email": "juan.perez@example.com",
    "rol": "pasajero",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Obtener Perfil (Autenticado)

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id_usuario": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@example.com",
    "telefono": "+59171234567",
    "rol": "pasajero",
    "estado_cuenta": "activa",
    "fecha_registro": "2025-11-13T10:00:00.000Z"
  }
}
```

### 4. Registrar Usuario Conductor

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos",
    "apellido": "González",
    "email": "carlos.gonzalez@example.com",
    "telefono": "+59172345678",
    "password": "Password123!",
    "rol": "conductor"
  }'
```

### 5. Crear Perfil de Conductor (Admin)

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/users/conductores \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 2,
    "numero_licencia": "LIC123456789",
    "tipo_licencia": "B",
    "fecha_vencimiento_licencia": "2027-12-31",
    "marca_auto": "Toyota",
    "modelo_auto": "Corolla",
    "placa_auto": "ABC-1234"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Perfil de conductor creado exitosamente",
  "data": {
    "id_conductor": 1,
    "id_usuario": 2,
    "numero_licencia": "LIC123456789",
    "tipo_licencia": "B",
    "fecha_vencimiento_licencia": "2027-12-31",
    "marca_auto": "Toyota",
    "modelo_auto": "Corolla",
    "placa_auto": "ABC-1234",
    "estado_conductor": "disponible",
    "calificacion_promedio": 0.0,
    "total_viajes": 0
  }
}
```

### 6. Listar Usuarios

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Actualizar Usuario

**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "telefono": "+59174567890",
    "direccion": "Nueva Dirección 456"
  }'
```

### 8. Refrescar Token

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### 9. Logout

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔍 GraphQL

### Playground

Acceder al playground interactivo:

```
http://localhost:3001/graphql
```

### Autenticación en GraphQL

Agregar header en el playground:

```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

### Queries

#### Listar Usuarios

```graphql
query GetAllUsers {
  users {
    id_usuario
    nombre
    apellido
    email
    telefono
    rol
    estado_cuenta
    email_verificado
    fecha_registro
  }
}
```

#### Usuario por ID

```graphql
query GetUserById {
  user(id: 1) {
    id_usuario
    nombre
    apellido
    email
    telefono
    foto_perfil
    fecha_nacimiento
    genero
    direccion
    ciudad
    pais
    codigo_postal
    rol
    estado_cuenta
    email_verificado
    telefono_verificado
    fecha_registro
    ultima_conexion
    conductor {
      id_conductor
      numero_licencia
      tipo_licencia
      marca_auto
      modelo_auto
      placa_auto
      estado_conductor
      calificacion_promedio
      total_viajes
    }
  }
}
```

#### Usuario por Email

```graphql
query GetUserByEmail {
  userByEmail(email: "juan.perez@example.com") {
    id_usuario
    nombre
    apellido
    email
    rol
    estado_cuenta
  }
}
```

#### Listar Conductores

```graphql
query GetAllConductores {
  conductores {
    id_conductor
    numero_licencia
    tipo_licencia
    fecha_vencimiento_licencia
    marca_auto
    modelo_auto
    placa_auto
    color_auto
    anio_auto
    estado_conductor
    calificacion_promedio
    total_viajes
    usuario {
      id_usuario
      nombre
      apellido
      email
      telefono
      foto_perfil
    }
  }
}
```

#### Conductor por ID

```graphql
query GetConductorById {
  conductor(id: 1) {
    id_conductor
    numero_licencia
    tipo_licencia
    fecha_vencimiento_licencia
    foto_licencia_frontal
    foto_licencia_posterior
    marca_auto
    modelo_auto
    placa_auto
    color_auto
    anio_auto
    estado_conductor
    calificacion_promedio
    total_viajes
    usuario {
      nombre
      apellido
      email
      telefono
    }
  }
}
```

#### Conductor por ID de Usuario

```graphql
query GetConductorByUserId {
  conductorByUserId(userId: 2) {
    id_conductor
    numero_licencia
    marca_auto
    modelo_auto
    placa_auto
    estado_conductor
    calificacion_promedio
    usuario {
      nombre
      apellido
      email
    }
  }
}
```

### Queries con Variables

```graphql
query GetUserById($userId: Int!) {
  user(id: $userId) {
    id_usuario
    nombre
    email
    rol
  }
}
```

**Variables JSON:**
```json
{
  "userId": 1
}
```

### Fragments

```graphql
fragment UserBasicInfo on User {
  id_usuario
  nombre
  apellido
  email
  rol
  estado_cuenta
}

query GetMultipleUsers {
  user1: user(id: 1) {
    ...UserBasicInfo
  }
  user2: user(id: 2) {
    ...UserBasicInfo
  }
}
```

---

## 🗄️ Base de Datos

### Modelo de Datos

#### Tabla: `usuarios`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_usuario` | SERIAL PRIMARY KEY | ID auto-incremental |
| `nombre` | VARCHAR(100) NOT NULL | Nombre del usuario |
| `apellido` | VARCHAR(100) NOT NULL | Apellido del usuario |
| `email` | VARCHAR(255) UNIQUE NOT NULL | Email único |
| `telefono` | VARCHAR(20) UNIQUE NOT NULL | Teléfono único |
| `password_hash` | VARCHAR(255) NOT NULL | Contraseña hasheada |
| `foto_perfil` | TEXT | URL de foto |
| `fecha_nacimiento` | DATE | Fecha de nacimiento |
| `genero` | VARCHAR(20) | Género |
| `direccion` | TEXT | Dirección |
| `ciudad` | VARCHAR(100) | Ciudad |
| `pais` | VARCHAR(100) | País |
| `codigo_postal` | VARCHAR(20) | Código postal |
| `rol` | usuario_rol NOT NULL | pasajero/conductor/admin |
| `estado_cuenta` | estado_cuenta | activa/suspendida/eliminada |
| `email_verificado` | BOOLEAN DEFAULT false | Email verificado |
| `telefono_verificado` | BOOLEAN DEFAULT false | Teléfono verificado |
| `fecha_registro` | TIMESTAMP DEFAULT NOW() | Fecha de registro |
| `ultima_conexion` | TIMESTAMP | Última conexión |

#### Tabla: `conductores`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_conductor` | SERIAL PRIMARY KEY | ID auto-incremental |
| `id_usuario` | INTEGER UNIQUE | FK a usuarios |
| `numero_licencia` | VARCHAR(50) UNIQUE | Número de licencia |
| `tipo_licencia` | VARCHAR(10) | Tipo de licencia |
| `fecha_vencimiento_licencia` | DATE | Vencimiento |
| `foto_licencia_frontal` | TEXT | URL foto frontal |
| `foto_licencia_posterior` | TEXT | URL foto posterior |
| `marca_auto` | VARCHAR(50) | Marca del vehículo |
| `modelo_auto` | VARCHAR(50) | Modelo del vehículo |
| `placa_auto` | VARCHAR(20) UNIQUE | Placa única |
| `color_auto` | VARCHAR(30) | Color |
| `anio_auto` | INTEGER | Año |
| `estado_conductor` | estado_conductor | disponible/ocupado/desconectado |
| `calificacion_promedio` | DECIMAL(2,1) | Calificación (0.0-5.0) |
| `total_viajes` | INTEGER DEFAULT 0 | Total de viajes |

#### Tabla: `tokens_sesiones`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_token` | SERIAL PRIMARY KEY | ID auto-incremental |
| `id_usuario` | INTEGER | FK a usuarios |
| `token` | TEXT UNIQUE | Refresh token |
| `tipo_token` | tipo_token | refresh/access |
| `fecha_creacion` | TIMESTAMP DEFAULT NOW() | Creación |
| `fecha_expiracion` | TIMESTAMP | Expiración |
| `revocado` | BOOLEAN DEFAULT false | Token revocado |

### Relaciones

```
usuarios (1) ←→ (1) conductores
    ↓
    | (1:N)
    ↓
tokens_sesiones
```

### Diagrama ER

```
┌─────────────────────────┐
│       USUARIOS          │
├─────────────────────────┤
│ id_usuario (PK)         │
│ nombre                  │
│ apellido                │
│ email (UNIQUE)          │
│ telefono (UNIQUE)       │
│ password_hash           │
│ rol                     │
│ estado_cuenta           │
│ ...                     │
└───────────┬─────────────┘
            │
            │ 1:1
            ▼
┌─────────────────────────┐
│      CONDUCTORES        │
├─────────────────────────┤
│ id_conductor (PK)       │
│ id_usuario (FK, UNIQUE) │
│ numero_licencia (UNIQUE)│
│ tipo_licencia           │
│ marca_auto              │
│ modelo_auto             │
│ placa_auto (UNIQUE)     │
│ estado_conductor        │
│ calificacion_promedio   │
│ ...                     │
└─────────────────────────┘

            │
            │ 1:N
            ▼
┌─────────────────────────┐
│   TOKENS_SESIONES       │
├─────────────────────────┤
│ id_token (PK)           │
│ id_usuario (FK)         │
│ token (UNIQUE)          │
│ tipo_token              │
│ fecha_expiracion        │
│ revocado                │
│ ...                     │
└─────────────────────────┘
```

### Índices

- `idx_usuarios_email` - Email de usuario
- `idx_usuarios_telefono` - Teléfono de usuario
- `idx_usuarios_rol` - Rol de usuario
- `idx_usuarios_estado` - Estado de cuenta
- `idx_conductores_usuario` - ID de usuario en conductores
- `idx_conductores_licencia` - Número de licencia
- `idx_conductores_placa` - Placa del vehículo
- `idx_conductores_estado` - Estado del conductor
- `idx_tokens_usuario` - ID de usuario en tokens
- `idx_tokens_token` - Token
- `idx_tokens_revocado` - Tokens revocados

### Triggers

#### `actualizar_timestamp_usuarios`

Actualiza `ultima_conexion` automáticamente en cada UPDATE de usuarios.

#### `actualizar_timestamp_conductores`

Actualiza timestamps automáticamente en conductores.

---

## 🏛️ Arquitectura

### Estructura del Proyecto

```
src/
├── main.ts                      # Entry point de la aplicación
├── app.module.ts                # Módulo raíz
├── app.controller.ts            # Controlador raíz
├── app.service.ts               # Servicio raíz
│
├── config/                      # Configuraciones
│   ├── app.config.ts           # Config de aplicación
│   ├── database.config.ts      # Config de base de datos
│   └── jwt.config.ts           # Config de JWT
│
├── modules/                     # Módulos de negocio
│   ├── auth/                   # Módulo de autenticación
│   │   ├── auth.module.ts
│   │   ├── controllers/
│   │   │   └── auth.controller.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   └── interfaces/
│   │       └── jwt-payload.interface.ts
│   │
│   ├── users/                  # Módulo de usuarios
│   │   ├── users.module.ts
│   │   ├── controllers/
│   │   │   └── users.controller.ts
│   │   ├── services/
│   │   │   └── users.service.ts
│   │   ├── resolvers/
│   │   │   └── users.resolver.ts
│   │   ├── repositories/
│   │   │   ├── user.repository.ts
│   │   │   └── conductor.repository.ts
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   ├── conductor.entity.ts
│   │   │   └── token-session.entity.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       ├── update-user.dto.ts
│   │       ├── create-conductor.dto.ts
│   │       └── update-conductor.dto.ts
│   │
│   └── health/                 # Módulo de health checks
│       ├── health.module.ts
│       └── controllers/
│           └── health.controller.ts
│
├── common/                      # Recursos compartidos
│   ├── decorators/             # Decoradores personalizados
│   │   ├── current-user.decorator.ts
│   │   ├── public.decorator.ts
│   │   └── roles.decorator.ts
│   ├── filters/                # Filtros de excepciones
│   │   ├── all-exceptions.filter.ts
│   │   └── http-exception.filter.ts
│   ├── guards/                 # Guards de autenticación
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── interceptors/           # Interceptores
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   ├── pipes/                  # Pipes de validación
│   │   └── validation.pipe.ts
│   ├── scalars/                # Scalars de GraphQL
│   │   └── date.scalar.ts
│   └── utils/                  # Utilidades
│       ├── bcrypt.util.ts
│       └── response.util.ts
│
├── shared/                      # Servicios compartidos
│   ├── shared.module.ts
│   └── services/
│       └── logger.service.ts
│
└── database/                    # Scripts de base de datos
    └── db_smartride_users.sql
```

### Flujo de Autenticación

```
┌─────────┐         ┌────────────┐         ┌─────────────┐
│ Cliente │────────▶│   Nginx    │────────▶│Users Service│
│         │         │  Gateway   │         │             │
└─────────┘         └────────────┘         └──────┬──────┘
     ▲                                             │
     │                                             ▼
     │                                      ┌─────────────┐
     │                                      │AuthController│
     │                                      └──────┬──────┘
     │                                             │
     │                                             ▼
     │                                      ┌─────────────┐
     │                                      │ AuthService │
     │                                      └──────┬──────┘
     │                                             │
     │                                             ▼
     │                                      ┌─────────────┐
     │                                      │    bcrypt   │
     │                                      │   Validate  │
     │                                      └──────┬──────┘
     │                                             │
     │                                             ▼
     │                                      ┌─────────────┐
     │                                      │PostgreSQL DB│
     │                                      └──────┬──────┘
     │                                             │
     │                                             ▼
     │                                      ┌─────────────┐
     │                                      │ JWT Service │
     │                                      │ Generate    │
     │                                      │ Tokens      │
     │                                      └──────┬──────┘
     │                                             │
     └─────────────────────────────────────────────┘
                    access_token + refresh_token
```

### Patrón de Capas

```
┌──────────────────────────────────────────────────┐
│               Controller Layer                    │
│  • HTTP Request handling                         │
│  • Route mapping                                 │
│  • Request/Response transformation               │
└─────────────────┬────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────┐
│                Service Layer                      │
│  • Business logic                                │
│  • Data validation                               │
│  • External service calls                        │
└─────────────────┬────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────┐
│              Repository Layer                     │
│  • Database operations                           │
│  • Query building                                │
│  • Data persistence                              │
└─────────────────┬────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────┐
│                Entity Layer                       │
│  • Data models                                   │
│  • Database schema                               │
│  • Relationships                                 │
└──────────────────────────────────────────────────┘
```

---

## 🐳 Docker

### Build de Imagen

```bash
# Build manual
docker build -t smartride/users-service:1.0.0 .

# Build con docker compose
docker compose build users-service
```

### Dockerfile Multi-Stage

La imagen utiliza **multi-stage builds** para optimización:

1. **Dependencies**: Instala todas las dependencias
2. **Build**: Compila TypeScript a JavaScript
3. **Production**: Copia solo archivos necesarios

**Ventajas:**
- Imagen final ligera (~200MB)
- Sin archivos de desarrollo
- Optimizada para producción

### Ejecutar Contenedor

```bash
# Ejecutar solo el servicio
docker run -d \
  --name users-service \
  -p 3001:3001 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e JWT_SECRET=your-secret \
  smartride/users-service:1.0.0

# Con docker compose
docker compose up -d users-service
```

### Comandos Útiles

```bash
# Ver logs
docker compose logs -f users-service

# Logs en tiempo real (últimas 100 líneas)
docker compose logs --tail=100 -f users-service

# Acceder al contenedor
docker compose exec users-service sh

# Ver variables de entorno
docker compose exec users-service env

# Reiniciar servicio
docker compose restart users-service

# Detener servicio
docker compose stop users-service

# Eliminar contenedor
docker compose rm -f users-service
```

### Health Checks en Docker

El contenedor incluye health checks automáticos:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/v1/health', ...)"
```

Verificar estado:

```bash
docker inspect smartride-users-service | grep -A 10 Health
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests en modo watch
npm run test:watch

# Tests end-to-end
npm run test:e2e

# Cobertura de código
npm run test:cov
```

### Estructura de Tests

```
test/
├── app.e2e-spec.ts        # Tests E2E
└── jest-e2e.json          # Config Jest E2E

src/
└── **/*.spec.ts           # Tests unitarios
```

### Ejemplo de Test

```typescript
describe('AuthController', () => {
  it('should register a new user', async () => {
    const dto: RegisterDto = {
      email: 'test@example.com',
      password: 'Password123!',
      nombre: 'Test',
      apellido: 'User',
      telefono: '+123456789',
      rol: 'pasajero',
    };

    const result = await controller.register(dto);
    
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('access_token');
  });
});
```

---

## 🔧 Scripts NPM

| Script | Comando | Descripción |
|--------|---------|-------------|
| **Desarrollo** | | |
| `start:dev` | `nest start --watch` | Modo desarrollo con hot-reload |
| `start:debug` | `nest start --debug --watch` | Modo debug |
| **Producción** | | |
| `build` | `nest build` | Compilar TypeScript |
| `start:prod` | `node dist/main` | Iniciar en producción |
| **Testing** | | |
| `test` | `jest` | Tests unitarios |
| `test:watch` | `jest --watch` | Tests en modo watch |
| `test:cov` | `jest --coverage` | Cobertura de código |
| `test:e2e` | `jest --config ./test/jest-e2e.json` | Tests E2E |
| **Calidad** | | |
| `lint` | `eslint "{src,apps,libs,test}/**/*.ts"` | Ejecutar ESLint |
| `format` | `prettier --write "src/**/*.ts" "test/**/*.ts"` | Formatear código |

---

## 🐛 Troubleshooting

### Error: Puerto 3001 en uso

**Problema:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solución:**

```bash
# Linux/Mac - Encontrar proceso
sudo lsof -i :3001

# Matar proceso
kill -9 <PID>

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Error: No se puede conectar a PostgreSQL

**Problema:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solución:**

```bash
# Verificar que PostgreSQL está corriendo
docker compose ps postgres-users

# Ver logs de PostgreSQL
docker compose logs postgres-users

# Reiniciar PostgreSQL
docker compose restart postgres-users

# Verificar conectividad desde el contenedor
docker compose exec users-service nc -zv postgres-users 5432
```

### Error: Cannot find module

**Problema:**
```
Error: Cannot find module 'module-name'
```

**Solución:**

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpiar caché de npm
npm cache clean --force
```

### Error: TypeORM synchronize

**Problema:**
```
QueryFailedError: relation "usuarios" does not exist
```

**Solución:**

```bash
# Opción 1: Setear DB_SYNC=true en .env (solo desarrollo)
DB_SYNC=true

# Opción 2: Ejecutar script SQL manualmente
psql -d db_usuarios_smart_ride -f src/database/db_smartride_users.sql

# Opción 3: Recrear base de datos
dropdb db_usuarios_smart_ride
createdb db_usuarios_smart_ride
psql -d db_usuarios_smart_ride -f src/database/db_smartride_users.sql
```

### Error: JWT token inválido

**Problema:**
```
401 Unauthorized: Invalid token
```

**Solución:**

```bash
# Verificar que JWT_SECRET en .env coincide con el usado para generar el token
# Generar nuevo secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Actualizar .env
JWT_SECRET=nuevo-secret-aqui

# Reiniciar servicio
npm run start:dev
```

### Error: Docker build falla

**Problema:**
```
ERROR [build 7/7] RUN npm run build
```

**Solución:**

```bash
# Limpiar caché de Docker
docker builder prune -a

# Build sin caché
docker compose build --no-cache users-service

# Verificar logs de build
docker compose build users-service 2>&1 | tee build.log
```

### Logs de Debug

```bash
# Aumentar nivel de logging
LOG_LEVEL=debug npm run start:dev

# Ver logs en tiempo real
docker compose logs -f --tail=100 users-service

# Logs con timestamps
docker compose logs -f -t users-service
```

---

## 📞 Soporte

### Documentación Adicional

- **Swagger UI**: `http://localhost:3001/api/v1/docs`
- **GraphQL Playground**: `http://localhost:3001/graphql`
- **Health Check**: `http://localhost:3001/api/v1/health`
- **Documentación Principal**: [README del proyecto](../README.md)

### Recursos

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [GraphQL Documentation](https://graphql.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Contacto

- **GitHub Issues**: [proyecto-SmartRide/issues](https://github.com/tu-usuario/proyecto-SmartRide/issues)
- **Email**: soporte@smartride.com

---

## 📄 Licencia

MIT License - Ver archivo [LICENSE](../LICENSE)

---

<div align="center">

**Desarrollado con ❤️ para Smart Ride**

[⬆ Volver arriba](#-smart-ride---users-service)

</div>

Ejecutar esto para generar JWT
- node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

