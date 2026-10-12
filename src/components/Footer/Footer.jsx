
import { Link } from 'react-router-dom';

import {
  ArrowUp,
  ArrowUpRight,
  ArrowRight,
  Crosshair,
  ScanLine,
  Zap,
} from 'lucide-react';

import './Footer.scss';

// ==========================================
// FOOTER NAVIGATION
// ==========================================

const exploreLinks = [
  { label: 'Home', to: '/' },
  { label: 'Collection', to: '/#collection' },
  { label: 'Experience', to: '/#experience' },
  { label: 'About VELOX', to: '/#about' },
];

const collectionLinks = [
  { label: 'Ignition', to: '/product/ignition' },
  { label: 'Frostbyte', to: '/product/frostbyte' },
  { label: 'Phantom', to: '/product/phantom' },
  { label: 'Pulse', to: '/product/pulse' },
];

// ==========================================
// VELOX FOOTER
// ==========================================

function Footer() {
  const year = new Date().getFullYear();

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="velox-footer" id="footer">

      {/* =====================================
          CINEMATIC CTA — ORIGINAL CONCEPT
      ===================================== */}

      <div className="velox-footer__cta-section">
        <div className="velox-footer__cta-glow" />

        <div className="velox-footer__container">

          <div className="velox-footer__cta-top">
            <span className="velox-footer__system-status">
              <span className="velox-footer__live-dot" />

              VELOX / NEXT GENERATION MOTION
            </span>

            <span className="velox-footer__system-label">
              <ScanLine size={15} />
              SYSTEM / READY
            </span>
          </div>

          <div className="velox-footer__cta-content">

            <div className="velox-footer__cta-heading">
              <span className="velox-footer__eyebrow">
                THE NEXT MOVE IS YOURS
              </span>

              <h2>
                DON'T JUST
                <span>MOVE.</span>
                <strong>LEAD.</strong>
              </h2>
            </div>

            <div className="velox-footer__cta-aside">
              <Crosshair
                size={27}
                strokeWidth={1.3}
              />

              <p>
                Four distinctive colorways.
                One vision of fearless motion.
                Find the VELOX V1 that speaks to you.
              </p>

              <Link
                to="/#collection"
                className="velox-footer__cta-button"
              >
                EXPLORE COLLECTION

                <ArrowUpRight size={20} />
              </Link>
            </div>

          </div>

          <div className="velox-footer__cta-bottom">
            <span>DESIGNED TO MOVE DIFFERENT.</span>
            <span>VELOX / V1 COLLECTION</span>
          </div>

        </div>
      </div>

      {/* =====================================
          CLEAN PREMIUM MAIN FOOTER
      ===================================== */}

      <div className="velox-footer__main">

        {/* LIGHT GREY BACKGROUND TYPOGRAPHY */}
        <div
          className="velox-footer__watermark"
          aria-hidden="true"
        >
          VELOX
        </div>

        <div className="velox-footer__container">

          {/* =================================
              MAIN CONTENT GRID
          ================================= */}

          <div className="velox-footer__grid">

            {/* BRAND IDENTITY */}
            <div className="velox-footer__brand">

              <Link
                to="/"
                className="velox-footer__logo"
                aria-label="VELOX Home"
              >
                <img
                  src="/branding/velox-logo.png"
                  alt="VELOX — Built For Motion"
                  loading="lazy"
                />
              </Link>

              <p>
                A design-led sneaker experience
                inspired by the energy of motion,
                futuristic thinking and the freedom
                to move different.
              </p>

              <span className="velox-footer__brand-tag">
                <Zap size={16} />
                BUILT FOR MOTION
              </span>

            </div>

            {/* EXPLORE LINKS */}
            <div className="velox-footer__links">

              <h3>EXPLORE</h3>

              <nav aria-label="Footer navigation">
                {exploreLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                  >
                    <span>{link.label}</span>

                    <ArrowUpRight size={14} />
                  </Link>
                ))}
              </nav>

            </div>

            {/* COLLECTION LINKS */}
            <div className="velox-footer__links">

              <h3>THE COLLECTION</h3>

              <nav aria-label="VELOX sneakers">
                {collectionLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                  >
                    <span>{link.label}</span>

                    <ArrowUpRight size={14} />
                  </Link>
                ))}
              </nav>

            </div>

            {/* COLLECTION ARCHIVE */}
            <div className="velox-footer__archive">

              <div className="velox-footer__archive-top">
                <span>VELOX / ARCHIVE</span>

                <ScanLine size={17} />
              </div>

              <div className="velox-footer__archive-number">
                V1<span>/04</span>
              </div>

              <p>
                FOUR COLORWAYS.
                <br />
                ONE FREQUENCY.
              </p>

              <Link to="/#collection">
                ACCESS THE ARCHIVE

                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

          {/* =================================
              BRAND STATEMENT
          ================================= */}

          <div className="velox-footer__statement">

            <div className="velox-footer__statement-top">
              <span>
                <span className="velox-footer__live-dot" />
                THE MOVEMENT CONTINUES
              </span>

              <span>EST. IN IMAGINATION / V1</span>
            </div>

            <h2>
              MOVE
              <span> BEYOND.</span>
            </h2>

            <p>
              NEVER STATIC. ALWAYS EVOLVING.
            </p>

          </div>

          {/* =================================
              BOTTOM COPYRIGHT BAR
          ================================= */}

          <div className="velox-footer__bottom">

            <div className="velox-footer__copyright">
              <span>
                © {year} VELOX. BUILT FOR MOTION.
              </span>

              <span>
                DIGITAL SNEAKER CONCEPT / V1
              </span>
            </div>

            <Link
              to="/"
              className="velox-footer__back-top"
              onClick={backToTop}
            >
              BACK TO TOP

              <span>
                <ArrowUp size={18} />
              </span>
            </Link>

          </div>

        </div>
      </div>

    </footer>
  );
}

export default Footer;
