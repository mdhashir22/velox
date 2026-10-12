
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Menu,
  X,
  ShoppingBag,
  ArrowUpRight,
} from 'lucide-react';

import { gsap } from 'gsap';

import { useCart } from '../../context/CartContext.jsx';
import CartDrawer from '../CartDrawer/CartDrawer.jsx';

import './Navbar.scss';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Collection', href: '/#collection' },
  { label: 'Experience', href: '/#experience' },
  { label: 'About', href: '/#about' },
];

function Navbar() {
  const navbarRef = useRef(null);
  const cartButtonRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const { totalItems } = useCart();

  // ==========================================
  // NAVBAR ENTRANCE + SCROLL EFFECT
  // ==========================================

  useEffect(() => {
    const animation = gsap.fromTo(
      navbarRef.current,
      {
        y: -100,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        ease: 'power3.out',
      }
    );

    const handleScroll = () => {
      setScrolled(window.scrollY > 35);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      animation.kill();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ==========================================
  // MOBILE MENU SCROLL LOCK
  // ==========================================

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // ==========================================
  // ESCAPE KEY
  // ==========================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // ==========================================
  // DESKTOP MENU RESET
  // ==========================================

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 761px)');

    const handleDesktop = (event) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleDesktop);

    return () => {
      mediaQuery.removeEventListener('change', handleDesktop);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ==========================================
  // CART DRAWER CONTROLS
  // ==========================================

  const openCart = () => {
    setMenuOpen(false);
    setCartOpen(true);
  };

  const closeCart = () => {
    setCartOpen(false);

    requestAnimationFrame(() => {
      cartButtonRef.current?.focus();
    });
  };

  return (
    <>
      <header
        ref={navbarRef}
        className={`velox-navbar ${
          scrolled ? 'is-scrolled' : ''
        } ${menuOpen ? 'menu-active' : ''}`}
      >
        {/* BRAND LOGO */}
        <Link
          to="/#home"
          className="velox-navbar__logo"
          onClick={closeMenu}
          aria-label="VELOX - Back to home"
        >
          <img
            src="/branding/velox-logo.png"
            alt="VELOX - Built for Motion"
            className="velox-navbar__logo-img"
          />
        </Link>

        {/* NAVIGATION LINKS */}
        <nav
          id="velox-main-navigation"
          className={`velox-navbar__links ${
            menuOpen ? 'is-open' : ''
          }`}
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={closeMenu}
              className="velox-navbar__nav-link"
            >
              <span>{link.label}</span>

              <span
                className="link-line"
                aria-hidden="true"
              />
            </Link>
          ))}

          {/* MOBILE CTA */}
          <Link
            to="/#collection"
            className="velox-navbar__mobile-shop"
            onClick={closeMenu}
          >
            <span>Explore Collection</span>
            <ArrowUpRight size={19} />
          </Link>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="velox-navbar__actions">

          {/* SHOP NOW */}
          <Link
            to="/#collection"
            className="velox-navbar__shop"
            onClick={closeMenu}
          >
            <span>SHOP NOW</span>
            <ArrowUpRight size={16} />
          </Link>

          {/* FUNCTIONAL CART BUTTON */}
          <button
            ref={cartButtonRef}
            className="velox-navbar__cart"
            type="button"
            onClick={openCart}
            aria-label={`Open shopping cart, ${totalItems} ${
              totalItems === 1 ? 'item' : 'items'
            }`}
            aria-haspopup="dialog"
            aria-expanded={cartOpen}
            title="View your shopping cart"
          >
            <ShoppingBag
              size={21}
              strokeWidth={1.8}
            />

            <span
              className="velox-navbar__cart-count"
              aria-live="polite"
            >
              {totalItems}
            </span>
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            className="velox-navbar__toggle"
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={
              menuOpen ? 'Close menu' : 'Open menu'
            }
            aria-expanded={menuOpen}
            aria-controls="velox-main-navigation"
          >
            {menuOpen ? (
              <X size={26} strokeWidth={1.8} />
            ) : (
              <Menu size={26} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </header>

      {/* JARVIS CART DRAWER */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={closeCart}
      />
    </>
  );
}

export default Navbar;
