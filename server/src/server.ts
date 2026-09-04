import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Configuración de CORS segura
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (como apps móviles, Postman o curl)
      if (!origin) return callback(null, true);
      // Permitir localhost o cualquier subdominio de vercel.app
      if (
        origin === env.CLIENT_URL ||
        origin.includes('localhost') ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos subidos localmente
import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rutas base
app.use('/api', apiRouter);

// Ruta de bienvenida raíz
app.get('/', (req, res) => {
  res.json({
    name: 'MoyaProp API REST',
    version: '1.0.0',
    description: 'API Inmobiliaria autogestionable para MoyaProp',
    documentation: '/api/health'
  });
});

// Manejador global de errores
app.use(errorHandler);

// Inicio del servidor
const server = app.listen(env.PORT, () => {
  console.log(`🚀 Servidor MoyaProp corriendo en el puerto ${env.PORT}`);
  console.log(`🌐 Ambiente: ${env.NODE_ENV}`);
  console.log(`📡 Health check disponible en http://localhost:${env.PORT}/api/health`);
});

// Manejo graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido. Cerrando servidor HTTP ordenadamente...');
  server.close(() => {
    console.log('Servidor HTTP cerrado.');
    process.exit(0);
  });
});

export default app;
