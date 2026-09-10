import React from 'react';
import styles from './StatCard.module.css';

export interface StatCardProps {
  label: string;
  value: number | string;
  variant?: 'default' | 'active' | 'paused' | 'closed';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  variant = 'default',
  className = ''
}) => {
  const variantClass = variant !== 'default' ? styles[variant] || '' : '';

  return (
    <div className={`${styles.card} ${variantClass} ${className}`.trim()}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
};
