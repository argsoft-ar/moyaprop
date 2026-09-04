import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Home, Lock, Mail, ShieldAlert, ArrowLeft } from 'lucide-react';
import { authService } from '../../features/auth/services/authService';
import { useAuth } from '../../features/auth/context/AuthContext';
import { Logo } from '../../components/ui/Logo/Logo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import styles from './AdminLogin.module.css';

const loginSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

type LoginFormData = z.infer<typeof loginSchema>;

export const AdminLogin: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@moyaprop.com',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await authService.login(data.email, data.password);
      login(response.token, response.user);
      navigate('/admin');
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Logo size="lg" />
          <p className={styles.subtitle}>Panel de Administración Exclusivo</p>
        </div>

        {errorMessage && (
          <div className={styles.errorAlert}>
            <ShieldAlert size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="ejemplo@moyaprop.com"
            leftIcon={<Mail size={18} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock size={18} />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className={styles.submitBtn}
          >
            Ingresar al Panel
          </Button>
        </form>

        <div className={styles.footer}>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Volver al sitio web público</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
