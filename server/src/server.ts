import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Confiar en el proxy reverso de Render para HTTPS correcto
app.set('trust proxy', 1);

// Configuración de CORS segura
const isAllowedOrigin = (origin: string): boolean => {
  // Permitir dominios de producción propios (con o sin www)
  if (origin.includes('moyapropiedades.com.ar')) return true;
  // Permitir Vercel (subdominios .vercel.app)
  if (origin.endsWith('.vercel.app')) return true;
  // Permitir desarrollo local
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return true;
  // Permitir orígenes definidos explícitamente en CLIENT_URL (soporta lista separada por comas)
  const clientUrls = env.CLIENT_URL.split(',').map((url) => url.trim());
  if (clientUrls.includes(origin)) return true;

  return false;
};

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (como apps móviles, Postman o curl)
    if (!origin || isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
