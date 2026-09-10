import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import styles from './ConfirmDialog.module.css';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
  icon,
  onConfirm,
  onCancel
}) => {
  const defaultIcon =
    variant === 'danger' ? <AlertTriangle size={36} /> : <Info size={36} />;

  return (
    <Modal isOpen={open} onClose={onCancel} title={title}>
      <div className={styles.content}>
        <div
          className={`${styles.iconWrapper} ${
            variant === 'danger' ? styles.iconDanger : styles.iconPrimary
          }`}
        >
          {icon || defaultIcon}
        </div>

        <div className={styles.message}>{message}</div>

        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.actions}>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
