import React from 'react';
import { Info } from 'lucide-react';
import { brandConfig } from '../../../config/brand.config';
import styles from './LegalDisclaimer.module.css';

export interface LegalDisclaimerProps {
  text?: string;
  variant?: 'default' | 'print';
  className?: string;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({
  text = brandConfig.legal.disclaimer,
  variant = 'default',
  className = ''
}) => {
  const variantClass = variant === 'print' ? styles.print : '';

  return (
    <div className={`${styles.disclaimer} ${variantClass} ${className}`.trim()}>
      <Info size={16} className={styles.icon} />
      <p className={styles.text}>{text}</p>
    </div>
  );
};
