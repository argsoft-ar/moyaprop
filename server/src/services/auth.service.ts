import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { LoginDto, AuthResponse } from '../types/auth.types.js';

export class AuthService {
  static async login(data: LoginDto): Promise<AuthResponse> {
    const user = await prisma.adminUser.findUnique({
      where: { email: data.email.toLowerCase().trim() }
    });

    if (!user) {
      const error: any = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      const error: any = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any
    });

    return {
      token,
      user: payload
    };
  }

  static async getProfile(userId: string) {
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    if (!user) {
      const error: any = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }
}
