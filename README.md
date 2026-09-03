# MoyaProp 🏡 • Plataforma Inmobiliaria Autogestionable

**MoyaProp** es una plataforma inmobiliaria moderna, autogestionable y de alto rendimiento diseñada para la gestión integral del negocio de la familia Moya. Cuenta con un catálogo web público ultra-rápido para clientes y un panel de administración privado con control total de inventario y multimedia.

---

## 🏛️ Arquitectura del Sistema

El proyecto está organizado bajo una estructura **Monorepo Simple**, donde frontend y backend conviven en el mismo repositorio pero mantienen independencia en su compilación y despliegue:

```text
moyaprop/
├── client/                      # FRONTEND (React + Vite + TypeScript + CSS Modules)
│   ├── src/
│   │   ├── components/ui/       # Componentes atómicos (Button, Input, Modal, Badge, Spinner)
│   │   ├── components/layout/   # Estructura visual (Navbar, Footer, AdminLayout)
│   │   ├── features/            # Módulos por dominio de negocio (Clean Architecture)
│   │   │   ├── properties/      # Catálogo, tarjetas, buscador en tiempo real, galería
│   │   │   ├── admin/           # Tabla de inventario, formulario de alta/edición
│   │   │   └── auth/            # Contexto de autenticación, JWT y login
│   │   ├── pages/               # Vistas públicas y privadas
│   │   ├── services/            # Cliente Axios con interceptores
│   │   └── styles/              # Design tokens en CSS nativo (variables.css y reset.css)
│   └── vercel.json              # Enrutamiento SPA (previene errores 404)
│
└── server/                      # BACKEND (Node.js + Express + TypeScript + Prisma)
    ├── prisma/                  # Esquema declarativo y script de seed
    ├── src/
    │   ├── config/              # Variables de entorno validadas con Zod (fail-fast)
    │   ├── controllers/         # Controladores HTTP (req / res)
    │   ├── middlewares/         # JWT, manejo centralizado de errores, validación
    │   ├── routes/              # Enrutamiento REST y endpoint /api/health
    │   ├── services/            # Lógica de negocio pura (Prisma y Cloudinary)
    │   └── types/               # DTOs y validadores Zod
    └── .env.example
```

---

## 🚀 Tecnologías Principales

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript + Vite | Entorno de desarrollo rápido y bundles optimizados |
| **Estilos** | CSS Modules + CSS Variables | Estilos modulares, sin colisiones de nombres y JSX 100% limpio |
| **Iconografía** | Lucide React | Iconos minimalistas y coherentes |
| **Backend** | Node.js + Express + TypeScript | API REST tipada con arquitectura en capas |
| **Base de Datos** | PostgreSQL + Prisma ORM | Modelado relacional, migraciones automáticas y consultas tipadas |
| **Multimedia** | Cloudinary | Compresión inteligente, formato WebP y almacenamiento CDN |
| **Autenticación** | JWT + bcrypt | Login seguro y protección estricta de rutas de administración |
| **Hosting** | Vercel (Client) + Render (Server) | Despliegues continuos automatizados |

---

## 🛠️ Instalación y Desarrollo Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/argsoft-ar/moyaprop.git
cd moyaprop
```

### 2. Configurar el Backend (`server/`)
```bash
cd server
npm install

# Copiar el archivo de variables de entorno
cp .env.example .env
```
Edita `server/.env` con tu base de datos PostgreSQL (ej. Neon.tech, Supabase o local) y credenciales de Cloudinary.

Ejecutar migraciones y sembrado de datos iniciales:
```bash
npx prisma db push
npm run seed     # Crea el admin inicial: admin@moyaprop.com / MoyaProp2025!
```

Iniciar servidor en modo desarrollo:
```bash
npm run dev
# Servidor disponible en http://localhost:4000
```

### 3. Configurar el Frontend (`client/`)
En otra terminal:
```bash
cd client
npm install

# Copiar variables de entorno
cp .env.example .env
```

Iniciar cliente en modo desarrollo:
```bash
npm run dev
# Web disponible en http://localhost:5173
```

---

## 🔐 Credenciales Iniciales de Administración

* **URL del Panel:** `http://localhost:5173/admin/login`
* **Email:** `admin@moyaprop.com`
* **Contraseña inicial:** `MoyaProp2025!` *(Se recomienda cambiar en producción)*

---

## 🌐 Guía de Despliegue en Producción

### Frontend en Vercel
1. Ingresa a [Vercel](https://vercel.com) e importa el repositorio `argsoft-ar/moyaprop`.
2. En la configuración del proyecto, establece:
   * **Root Directory:** `client`
   * **Framework Preset:** `Vite`
3. Agrega la variable de entorno:
   * `VITE_API_URL`: La URL pública de tu backend en Render (ej. `https://moyaprop-api.onrender.com/api`).
   * `VITE_WHATSAPP_PHONE`: El teléfono de la inmobiliaria para contacto directo.
4. El archivo `client/vercel.json` incluido en el proyecto garantiza que cualquier URL compartida cargue correctamente sin error 404.

### Backend en Render
1. Ingresa a [Render](https://render.com) y crea un **Web Service**.
2. Conecta el repositorio `argsoft-ar/moyaprop`.
3. Configura:
   * **Root Directory:** `server`
   * **Build Command:** `npm install && npx prisma generate && npm run build`
   * **Start Command:** `npm start`
4. Agrega las variables de entorno (`DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*`, `CLIENT_URL`).

### ⏰ Mantener el Backend Despierto (Keep-Alive Cron-Job)
Render suspende los servicios gratuitos tras 15 minutos de inactividad. Para mantenerlo activo 24/7 sin costo:
1. Crea una cuenta gratuita en [cron-job.org](https://cron-job.org) o [UptimeRobot](https://uptimerobot.com).
2. Configura un monitor tipo `HTTP(s)` apuntando a:
   `https://tu-servicio-render.onrender.com/api/health`
3. Frecuencia: **Cada 10 minutos**. Con esto, el servidor nunca se suspenderá y responderá de inmediato a los clientes.

---

## 🌿 Flujo de Trabajo en Git y GitHub

1. **Rama `main`:** Representa el código estable en producción.
2. **Feature branches:** Trabaja cada nueva funcionalidad en su propia rama:
   ```bash
   git checkout -b feat/nombre-de-la-funcionalidad
   ```
3. **Commits semánticos:**
   * `feat: ...` para nuevas funcionalidades.
   * `fix: ...` para corrección de errores.
   * `chore: ...` para tareas de mantenimiento o configuración.
4. Las variables confidenciales (`.env`) están ignoradas en `.gitignore` para garantizar total seguridad.
