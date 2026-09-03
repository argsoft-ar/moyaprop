import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export type LoginDto = z.infer<typeof loginSchema>;

export interface AuthUserPayload {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUserPayload;
}
