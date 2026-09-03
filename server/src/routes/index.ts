import { Router } from 'express';
import authRoutes from './auth.routes.js';
import propertyRoutes from './property.routes.js';
import uploadRoutes from './upload.routes.js';

const apiRouter = Router();

// Endpoint de Keep-Alive para Render (Cron-job ping)
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Módulos
apiRouter.use('/auth', authRoutes);
apiRouter.use('/properties', propertyRoutes);
apiRouter.use('/upload', uploadRoutes);

export default apiRouter;
