import React from 'react';
import { UserCheck, Award, Quote } from 'lucide-react';
import styles from './AboutSection.module.css';

export const AboutSection: React.FC = () => {
  return (
    <section className={styles.section} id="nosotros">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Columna Imagen - Carlos Moya */}
          <div className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                alt="Carlos Moya - MoyaProp"
                className={styles.image}
              />
              <div className={styles.experienceBadge}>
                <Award size={24} className={styles.badgeIcon} />
                <div className={styles.badgeTexts}>
                  <span className={styles.badgeTitle}>Carlos Moya</span>
                  <span className={styles.badgeSub}>Titular & Asesor Inmobiliario</span>
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
              Nuestra trayectoria en el mercado inmobiliario
            </h2>

            <p className={styles.paragraph}>
              Somos una joven empresa familiar, con una vasta experiencia en el mercado inmobiliario,
              habiendo formado parte en su momento, del staff de ventas de una de las más reconocidas
              empresas inmobiliarias de la zona sur del gran Buenos Aires.
            </p>

            <blockquote className={styles.quoteBox}>
              <Quote size={24} className={styles.quoteIcon} />
              <p className={styles.quoteText}>
                «Nuestra finalidad es brindar todas las alternativas posibles para culminar cualquier
                negocio inmobiliario con éxito, cumpliendo así, con las necesidades y exigencias de cada uno
                de nuestros clientes.»
              </p>
            </blockquote>

            <p className={styles.paragraph}>
              Estamos para asesorarlo y acompañarlo en cada uno de los procesos del negocio inmobiliario,
              comprendiendo el valor trascendental que tiene tomar la decisión de adquirir su ansiada vivienda
              o la de realizar la mejor inversión para resguardar sus ahorros.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
