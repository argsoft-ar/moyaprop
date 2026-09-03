import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { loginSchema } from '../types/auth.types.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', validateBody(loginSchema), AuthController.login);
router.get('/me', authenticateToken as any, AuthController.getProfile as any);

export default router;
