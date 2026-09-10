import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../Button';
import { ArrowLeft } from 'lucide-react';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  backLink?: {
    to: string;
    label: string;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  backLink,
  className = ''
}) => {
  return (
    <div className={`${styles.container} ${className}`.trim()}>
      {icon && <div className={styles.iconWrapper}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}

      {(actionLabel && onAction) && (
        <div className={styles.actionWrapper}>
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}

      {backLink && (
        <div className={styles.actionWrapper}>
          <Link to={backLink.to} className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>{backLink.label}</span>
          </Link>
        </div>
      )}
    </div>
  );
};
