import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es obligatoria'),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET debe tener al menos 10 caracteres'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),
  CLIENT_URL: z.string().default('http://localhost:5173')
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Error crítico en variables de entorno:');
  console.error(_env.error.format());
  // No detenemos en modo desarrollo si faltan claves externas para permitir tests locales
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

export const env = _env.success
  ? _env.data
  : {
      PORT: 4000,
      NODE_ENV: 'development' as const,
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/moyaprop',
      JWT_SECRET: process.env.JWT_SECRET || 'dev_super_secret_jwt_key_moyaprop_12345',
      JWT_EXPIRES_IN: '7d',
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
      CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
    };
