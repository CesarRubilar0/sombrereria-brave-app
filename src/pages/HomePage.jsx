import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'

// Definir el número de WhatsApp desde variables de entorno
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '56954817790'

export default function HomePage() {
  useEffect(() => {
    document.title = 'Sombrerería Brave — Inicio'
  }, [])

  // Crear el enlace seguro de WhatsApp con mensaje personalizado
  const whatsappHref = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent('Hola! Quisiera realizar una consulta sobre sus sombreros.')}`

  return (
    <div className="home-page">
      {/* SECCIÓN HERO DE BIENVENIDA */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🎩</span>
            <span>Tradición Hecha a Mano</span>
          </div>
          <h1>
            Artesanía y Elegancia <span>Sombrerería Brave</span>
          </h1>
          <p className="hero-subtitle">Tradición y diseño en cada fibra.</p>
          <p className="hero-description">
            Creamos sombreros únicos y a medida con materiales de la más alta calidad y técnicas artesanales chilenas. Cada sombrero cuenta una historia de dedicación, pasión y elegancia atemporal.
          </p>
          <div className="hero-actions">
            <Link to="/catalogo" className="btn-primary">
              <span>Explorar Catálogo</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link to="/nosotros" className="btn-secondary">
              Conócenos
            </Link>
          </div>
        </div>

        {/* PANEL VISUAL DECORATIVO CON EFECTO DE CUERO */}
        <div className="hero-visual">
          <div className="hero-visual-glow" />
          <div className="hero-visual-card">
            <div className="hero-visual-overlay">
              <h3>Calidad Premium</h3>
              <p>
                Cada pieza es modelada y cosida a mano, asegurando durabilidad, ajuste perfecto y un estilo inigualable.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* SECCIÓN REPORTAJE DE CANAL 13 */}
      <section className="video-section">
        <div className="video-container">
          <h2>Reportaje en Canal 13</h2>
          <div className="video-divider" />
          <p>
            Te invitamos a ver el reportaje especial que Canal 13 realizó en nuestro taller, donde compartimos nuestra historia de emprendimiento, amor por la tradición y el proceso detallado detrás de la fabricación de cada sombrero.
          </p>
          <div className="video-wrapper">
            <iframe
              src="https://rudo.video/vod/cz6MXoPuOZf/skin/simple/13/?volume=0&autostart=0"
              title="Reportaje Canal 13 - Sombrerería Brave"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              allow="autoplay; fullscreen"
            />
          </div>
        </div>
      </section>

      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <div className="whatsapp-fab-container">
        <div className="whatsapp-tooltip">Atención Rápida</div>
        <a
          className="whatsapp-fab"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp para atención rápida"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.52 3.48A11.9 11.9 0 0012 0C5.373 0 .01 4.96 0 11.072 0 13.67.8 16.08 2.4 17.98L.6 23.4l5.6-1.44A11.9 11.9 0 0012 24c6.627 0 11.99-4.96 12-11.072 0-1.98-.56-3.86-1.48-5.44z" />
            <path d="M17.3 14.8c-.45-0.23-2.65-1.3-3.05-1.45-.4-.15-.7-.23-1 .23s-1.15 1.45-1.4 1.75c-.25.3-.5.34-.95.11-.45-.23-1.9-.7-3.62-2.23-1.34-1.24-2.24-2.78-2.5-3.23-.26-.45-.02-.69.2-.92.2-.2.45-.52.68-.78.23-.26.3-.45.45-.75.15-.3.05-.56-.02-.79-.07-.23-1-2.42-1.36-3.3-.36-.86-.73-.74-1-.74H5.1c-.3 0-.79.11-1.2.56-.41.45-1.57 1.54-1.57 3.76 0 2.23 1.61 4.38 1.83 4.69.23.3 3.18 4.88 7.72 6.84 4.54 1.96 4.54 1.31 5.36 1.22.83-.09 2.37-.97 2.7-1.92.34-.95.34-1.76.24-1.92-.11-.16-.4-.26-.85-.47z" />
          </svg>
        </a>
      </div>

      {/* FOOTER ARTESANAL */}
      <footer className="site-footer">
        <div className="footer-top">
          {/* Columna 1: Información de marca */}
          <div className="footer-brand">
            <div className="footer-logo">🎩 Sombrerería Brave</div>
            <p className="footer-tagline">
              "No queremos perder la tradición del sombrero". Diseños artesanales chilenos creados con pasión y cuero de la mejor calidad.
            </p>
            <div className="footer-social-links">
              <a
                className="social-link instagram"
                href="https://www.instagram.com/sombreros.brave/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Siguenos en Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="footer-nav">
            <h4 className="footer-title">Navegación</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/catalogo">Catálogo</Link>
              </li>
              <li>
                <Link to="/nosotros">Nosotros</Link>
              </li>
              <li>
                <Link to="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Datos del negocio */}
          <div className="footer-info">
            <h4 className="footer-title">Contacto</h4>
            <div className="info-list">
              <div className="info-item">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <div>
                  <strong>Dirección Taller</strong>
                  Santiago, Chile
                </div>
              </div>
              <div className="info-item">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <div>
                  <strong>Teléfono</strong>
                  +{WHATSAPP_NUMBER}
                </div>
              </div>
              <div className="info-item">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <div>
                  <strong>Correo Electrónico</strong>
                  hola@sombrereriabrave.cl
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer inferior */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p>&copy; {new Date().getFullYear()} Sombrerería Brave. Todos los derechos reservados.</p>
            <p>Hecho a mano con orgullo en Chile</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
