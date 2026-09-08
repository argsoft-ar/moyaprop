import React from 'react';
import { UserCheck, Award, Quote } from 'lucide-react';
import { brandConfig } from '../../../config/brand.config';
import styles from './AboutSection.module.css';

export const AboutSection: React.FC = () => {
  return (
    <section className={styles.section} id="nosotros">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Columna Imagen del Titular */}
          <div className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              <img
                src={brandConfig.agent.photoUrl}
                alt={`${brandConfig.agent.name} - ${brandConfig.name}`}
                className={styles.image}
              />
              <div className={styles.experienceBadge}>
                <Award size={24} className={styles.badgeIcon} />
                <div className={styles.badgeTexts}>
                  <span className={styles.badgeTitle}>{brandConfig.agent.name}</span>
                  <span className={styles.badgeSub}>{brandConfig.agent.title}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Texto */}
          <div className={styles.textCol}>
            <div className={styles.tagBadge}>
              <UserCheck size={16} />
              <span>Sobre Nosotros</span>
            </div>

            <h2 className={styles.title}>
              {brandConfig.about.title}
            </h2>

            <p className={styles.paragraph}>
              {brandConfig.about.paragraph1}
            </p>

            <blockquote className={styles.quoteBox}>
              <Quote size={24} className={styles.quoteIcon} />
              <p className={styles.quoteText}>
                {brandConfig.about.quote}
              </p>
            </blockquote>

            <p className={styles.paragraph}>
              {brandConfig.about.paragraph2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
