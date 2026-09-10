import React from 'react';
import { Building2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { brandConfig } from '../../../config/brand.config';
import styles from './ValuesSection.module.css';

export interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface ValuesSectionProps {
  items?: ValueItem[];
  className?: string;
}

export const ValuesSection: React.FC<ValuesSectionProps> = ({
  items,
  className = ''
}) => {
  const defaultItems: ValueItem[] = [
    {
      icon: <Building2 size={24} />,
      title: 'Tasaciones Reales',
      description:
        'Valuamos inmuebles con datos precisos del mercado para asegurar negociaciones justas.'
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Seguridad Jurídica',
      description:
        'Revisión técnica de escrituras, títulos y contratos para total tranquilidad de las partes.'
    },
    {
      icon: <HeartHandshake size={24} />,
      title: 'Atención Directa',
      description: `Trato personal y directo con ${brandConfig.agent.name}, sin intermediarios ni demoras.`
    }
  ];

  const valuesToRender = items || defaultItems;

  return (
    <section className={`${styles.section} ${className}`.trim()}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {valuesToRender.map((val, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>{val.icon}</div>
              <h3 className={styles.title}>{val.title}</h3>
              <p className={styles.description}>{val.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
