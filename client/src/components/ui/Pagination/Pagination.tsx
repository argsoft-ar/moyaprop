import React from 'react';
import { Button } from '../Button';
import styles from './Pagination.module.css';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  align?: 'left' | 'center' | 'right';
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  align = 'right',
  previousLabel = 'Anterior',
  nextLabel = 'Siguiente',
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const alignClass = align === 'center' ? styles.center : '';

  return (
    <div className={`${styles.pagination} ${alignClass} ${className}`.trim()}>
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        {previousLabel}
      </Button>

      <span className={styles.pageInfo}>
        Página {page} de {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {nextLabel}
      </Button>
    </div>
  );
};
