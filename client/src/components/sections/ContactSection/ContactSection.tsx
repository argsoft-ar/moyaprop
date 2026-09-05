import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import styles from './ContactSection.module.css';

export const ContactSection: React.FC = () => {
  const whatsappPhone = import.meta.env.VITE_WHATSAPP_PHONE || '5491112345678';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: 'Comprar / Invertir',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Simular envío de consulta con feedback positivo
    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <section className={styles.section} id="contacto">
      <div className={styles.container}>
        {/* Encabezado */}
        <div className={styles.header}>
          <div className={styles.tagBadge}>
            <Mail size={16} />
            <span>Canales de Contacto</span>
          </div>
          <h2 className={styles.title}>
            Estamos para <span className={styles.highlight}>asesorarte</span> en cada paso
          </h2>
          <p className={styles.subtitle}>
            ¿Deseas tasar tu inmueble, buscar una nueva propiedad o resolver cualquier inquietud?
            Escríbenos o contáctanos por cualquiera de nuestros canales oficiales.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Columna Izquierda: Información de Contacto */}
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Información y Canales Directos</h3>
              
              <div className={styles.channelList}>
                {/* 1. Ubicación */}
                <div className={styles.channelItem}>
                  <div className={styles.channelIcon}>
                    <MapPin size={22} />
                  </div>
                  <div className={styles.channelDetails}>
                    <span className={styles.channelLabel}>Ubicación</span>
                    <span className={styles.channelValue}>Zona Sur del Gran Buenos Aires</span>
                    <span className={styles.channelSub}>Burzaco, Adrogué y alrededores</span>
                  </div>
                </div>

                {/* 2. WhatsApp / Teléfono */}
                <a
                  href={`https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.channelItem}
                >
                  <div className={`${styles.channelIcon} ${styles.whatsappIconBg}`}>
                    <Phone size={22} />
                  </div>
                  <div className={styles.channelDetails}>
                    <span className={styles.channelLabel}>WhatsApp / Teléfono</span>
                    <span className={styles.channelValue}>+54 9 11 1234-5678</span>
                    <span className={styles.channelSub}>Lunes a Viernes de 9 a 18 hs</span>
                  </div>
                </a>

                {/* 3. Correo Electrónico */}
                <a
                  href="mailto:contacto@moyaprop.com"
                  className={styles.channelItem}
                >
                  <div className={styles.channelIcon}>
                    <Mail size={22} />
                  </div>
                  <div className={styles.channelDetails}>
                    <span className={styles.channelLabel}>Correo Electrónico</span>
                    <span className={styles.channelValue}>contacto@moyaprop.com</span>
                    <span className={styles.channelSub}>Consultas generales y tasaciones</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario de Contacto */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>Envíanos tu Consulta</h3>
              <p className={styles.formDesc}>
                Completa el siguiente formulario y un asesor de MoyaProp se comunicará contigo a la brevedad.
              </p>

              {isSubmitted ? (
                <div className={styles.successBox}>
                  <CheckCircle size={48} className={styles.successIcon} />
                  <h4 className={styles.successTitle}>¡Consulta recibida con éxito!</h4>
                  <p className={styles.successMsg}>
                    Muchas gracias por contactarte con MoyaProp, {formData.name}. Hemos recibido tu mensaje y te responderemos lo antes posible.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        reason: 'Comprar / Invertir',
                        message: ''
                      });
                    }}
                  >
                    Enviar otra consulta
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.grid2}>
                    <Input
                      label="Nombre y Apellido *"
                      placeholder="Tu nombre completo"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Teléfono / WhatsApp *"
                      type="tel"
                      placeholder="Ej: 11 2345-6789"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className={styles.grid2}>
                    <Input
                      label="Correo Electrónico *"
                      type="email"
                      placeholder="tu-email@ejemplo.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Select
                      label="Motivo de la Consulta *"
                      options={[
                        { value: 'Comprar / Invertir', label: 'Quiero comprar / invertir' },
                        { value: 'Alquilar una propiedad', label: 'Quiero alquilar' },
                        { value: 'Vender mi propiedad', label: 'Quiero vender mi propiedad' },
                        { value: 'Solicitar Tasación', label: 'Solicitar tasación oficial' },
                        { value: 'Otra consulta', label: 'Otra consulta general' }
                      ]}
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    />
                  </div>

                  <div className={styles.textareaWrapper}>
                    <label className={styles.label}>Mensaje o detalle de tu búsqueda *</label>
                    <textarea
                      rows={4}
                      placeholder="Cuéntanos qué tipo de inmueble buscas, zona de preferencia o cualquier consulta sobre una publicación..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={styles.textarea}
                    />
                  </div>

                  <div className={styles.formButtons}>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSending}
                      leftIcon={<Send size={18} />}
                      className={styles.submitBtn}
                    >
                      Enviar Consulta
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
