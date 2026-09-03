import React from 'react';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'white';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'accent',
  className = ''
}) => {
  return (
    <div className={`${styles.spinner} ${styles[size]} ${styles[color]} ${className}`} />
  );
};
