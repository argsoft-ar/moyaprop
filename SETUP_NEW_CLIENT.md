# 🏢 ARGSOFT • Guía de Alta de Nuevo Cliente Inmobiliario
Esta plantilla (*White-Label / Marca Blanca*) está diseñada para que puedas entregar un sitio web inmobiliario completo con panel de administración autogestionable a un nuevo cliente en **menos de 45 minutos**.

---

## ⚡ Paso 1: Clonar el Repositorio Base
1. En GitHub, crea un nuevo repositorio privado para el cliente (ej: `argsoft-inmobiliaria-rossi`).
2. Clona la plantilla base en tu máquina:
```bash
git clone <URL_PLANTILLA_MOYAPROP> inmobiliaria-rossi
cd inmobiliaria-rossi
```

---

## 🎨 Paso 2: Personalizar la Identidad en 1 Solo Archivo
Abre el archivo:
📁 `client/src/config/brand.config.ts`

Modifica los datos del nuevo cliente:
```ts
export const brandConfig = {
  name: 'Inmobiliaria Rossi',
  brandPrefix: 'ROSSI',
  brandHighlight: 'PROP',
  slogan: 'Tu inmobiliaria de confianza en Zona Sur',

  agent: {
    name: 'Roberto Rossi',
    title: 'Martillero y Corredor Público',
    photoUrl: 'https://url-de-la-foto-del-cliente.jpg'
  },

  license: {
    institution: 'C.M.C.P.Q',
    number: 'Col. 5120'
  },

  contact: {
    location: 'Quilmes, Buenos Aires',
    coverageArea: 'Quilmes, Bernal y alrededores',
    phone: '+54 9 11 9876-5432',
    whatsappPhone: '5491198765432',
    email: 'contacto@inmobiliariarossi.com.ar',
    hours: 'Lunes a Viernes de 9 a 18 hs'
  },
  
  // ...
};
```

### 🎨 Si el cliente usa un color corporativo diferente:
Abre `client/src/styles/variables.css` y cambia las dos variables principales:
```css
:root {
  --color-accent: #0284c7;        /* Color de botones, precios y destacados (ej: Azul) */
  --color-accent-hover: #0369a1;
  --color-accent-soft: #f0f9ff;
}
```
*(¡Listo! Todo el frontend, botones, mapa, ficha imprimible y badges adoptarán la nueva paleta al instante).*

---

## 🗄️ Paso 3: Base de Datos y Backend (Render / Neon / Supabase)
1. **Crear la Base de Datos:**
   - Crea una base de datos PostgreSQL gratuita en [Neon.tech](https://neon.tech), [Supabase](https://supabase.com) o en [Render](https://render.com).
   - Copia la cadena de conexión (`DATABASE_URL`).

2. **Aplicar las migraciones y crear el usuario administrador:**
   En la terminal, dentro de `/server`:
   ```bash
   cd server
   # En tu .env configura el DATABASE_URL copiado
   npx prisma migrate deploy
   npm run prisma:seed
   ```
   *(Esto crea las tablas y el usuario administrador inicial).*

3. **Desplegar el Backend en Render:**
   - Conecta el repositorio en Render como *Web Service*.
   - Configura las Variables de Entorno:
     - `DATABASE_URL`: La URL de la base de datos PostgreSQL.
     - `JWT_SECRET`: Una clave secreta segura.
     - `CORS_ORIGIN`: La URL del frontend en Vercel (o el dominio propio del cliente).

---

## 🚀 Paso 4: Desplegar el Frontend en Vercel
1. Ve a [Vercel.com](https://vercel.com) e importa el repositorio `inmobiliaria-rossi`.
2. Define el directorio raíz en `client`.
3. Configura la Variable de Entorno:
   - `VITE_API_URL`: La URL de tu backend en Render (ej: `https://api-rossi.onrender.com/api`).
4. Haz clic en **Deploy**.
5. Vincula el dominio oficial del cliente (ej: `inmobiliariarossi.com.ar`) en la sección *Settings > Domains* de Vercel.

---

## 💼 Checklist Comercial para ARGSOFT
- [ ] Sitio web público verificado en el dominio del cliente.
- [ ] Acceso al Panel de Administración entregado (`/admin/login`).
- [ ] Cambio de contraseña del administrador realizado con el cliente.
- [ ] Carga de la primera propiedad de prueba completada.
- [ ] Verificación de los enlaces directos de WhatsApp en celular y computadora.
- [ ] Prueba de la Ficha Imprimible A4 (`/propiedad/:id/imprimir`).
- [ ] Cobro del Setup de Implementación + Primer mes de abono de mantenimiento.
