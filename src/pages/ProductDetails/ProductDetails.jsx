
import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';

import { useCart } from '../../context/CartContext.jsx';

import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  ScanLine,
  Crosshair,
} from 'lucide-react';

import './ProductDetails.scss';

// ==========================================
// VELOX PRODUCT DATABASE
// ==========================================

const products = {
  ignition: {
    id: 'ignition',
    name: 'IGNITION',
    number: '01',
    subtitle: 'Built to ignite every move.',
    description:
      'Engineered for those who refuse to stand still. The VELOX V1 IGNITION combines futuristic design, responsive comfort and an unmistakable electric-orange identity.',
    colorway: 'Black / Electric Orange',
    accent: '#ff641c',
    price: 24999,
    edition: 'SIGNATURE EDITION',
  },

  frostbyte: {
    id: 'frostbyte',
    name: 'FROSTBYTE',
    number: '02',
    subtitle: 'Cold precision. Limitless energy.',
    description:
      'A striking combination of midnight black and electric ice blue. FROSTBYTE delivers a bold futuristic aesthetic designed to move with confidence.',
    colorway: 'Midnight / Ice Blue',
    accent: '#54bfff',
    price: 24999,
    edition: 'ICE EDITION',
  },

  phantom: {
    id: 'phantom',
    name: 'PHANTOM',
    number: '03',
    subtitle: 'Quiet confidence. Bold presence.',
    description:
      'Understated luxury meets futuristic motion. PHANTOM pairs an elegant ivory finish with champagne accents for a refined statement.',
    colorway: 'Ivory / Champagne',
    accent: '#d6b98a',
    price: 26999,
    edition: 'LIMITED EDITION',
  },

  pulse: {
    id: 'pulse',
    name: 'PULSE',
    number: '04',
    subtitle: 'Feel the energy in every step.',
    description:
      'A high-impact visual statement with obsidian black, crimson highlights and an aggressive futuristic silhouette.',
    colorway: 'Obsidian / Crimson',
    accent: '#ff365a',
    price: 25999,
    edition: 'PERFORMANCE EDITION',
  },
};

// ==========================================
// CONFIGURATION
// ==========================================

const sizes = [39, 40, 41, 42, 43, 44, 45];

const formatPrice = (price) =>
  `PKR ${price.toLocaleString('en-PK')}`;

// ==========================================
// PRODUCT DETAILS COMPONENT
// ==========================================

function ProductDetails() {
  const { productId } = useParams();

  const product = products[productId];

  // CART CONTEXT
  const { addToCart: addItemToCart } = useCart();

  // REFS
  const pageRef = useRef(null);
  const imageRef = useRef(null);
  const feedbackTimerRef = useRef(null);

  // STATES
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  // ==========================================
  // PRODUCT IMAGES
  // ==========================================

  const images = product
    ? [
        {
          label: 'HERO',
          src: `/images/products/${product.id}/velox-v1-${product.id}-hero.png`,
        },
        {
          label: 'SIDE',
          src: `/images/products/${product.id}/velox-v1-${product.id}-side.png`,
        },
        {
          label: 'FRONT',
          src: `/images/products/${product.id}/velox-v1-${product.id}-front.png`,
        },
        {
          label: 'BACK',
          src: `/images/products/${product.id}/velox-v1-${product.id}-back.png`,
        },
        {
          label: 'TOP',
          src: `/images/products/${product.id}/velox-v1-${product.id}-top.png`,
        },
        {
          label: 'SOLE',
          src: `/images/products/${product.id}/velox-v1-${product.id}-sole.png`,
        },
      ]
    : [];

  // ==========================================
  // RESET WHEN PRODUCT CHANGES
  // ==========================================

  useEffect(() => {
    window.scrollTo(0, 0);

    setActiveImage(0);
    setSelectedSize(null);
    setQuantity(1);
    setAdded(false);
    setError('');

    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }
  }, [productId]);

  // ==========================================
  // PAGE ENTRANCE ANIMATIONS
  // ==========================================

  useEffect(() => {
    if (!product || !pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.product-details__gallery',
        {
          opacity: 0,
          x: -55,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
        }
      );

      gsap.fromTo(
        '.product-details__info > *',
        {
          opacity: 0,
          y: 28,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.09,
          duration: 0.75,
          ease: 'power3.out',
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [productId, product]);

  // ==========================================
  // IMAGE GALLERY TRANSITION
  // ==========================================

  const changeImage = (index) => {
    if (index === activeImage || !imageRef.current) {
      return;
    }

    gsap.killTweensOf(imageRef.current);

    gsap.to(imageRef.current, {
      opacity: 0,
      scale: 0.96,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setActiveImage(index);
      },
    });
  };

  useEffect(() => {
    if (!imageRef.current) return;

    gsap.fromTo(
      imageRef.current,
      {
        opacity: 0,
        scale: 1.04,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: true,
      }
    );

    return () => {
      if (imageRef.current) {
        gsap.killTweensOf(imageRef.current);
      }
    };
  }, [activeImage]);

  const nextImage = () => {
    if (!images.length) return;

    changeImage((activeImage + 1) % images.length);
  };

  const previousImage = () => {
    if (!images.length) return;

    changeImage(
      (activeImage - 1 + images.length) % images.length
    );
  };

  // ==========================================
  // FUNCTIONAL ADD TO CART
  // ==========================================

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      setError('Please select your shoe size first.');
      setAdded(false);
      return;
    }

    setError('');

    // Save product, size and quantity to CartContext
    addItemToCart(product, selectedSize, quantity);

    // Visual success feedback
    setAdded(true);

    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }

    feedbackTimerRef.current = setTimeout(() => {
      setAdded(false);
    }, 2200);
  };

  // ==========================================
  // CLEANUP
  // ==========================================

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  // ==========================================
  // PRODUCT NOT FOUND
  // ==========================================

  if (!product) {
    return (
      <main className="product-not-found">
        <h1>PRODUCT NOT FOUND</h1>

        <p>
          The requested VELOX sneaker could not be located.
        </p>

        <Link to="/#collection">
          <ArrowLeft size={18} />
          BACK TO COLLECTION
        </Link>
      </main>
    );
  }

  // ==========================================
  // PAGE UI
  // ==========================================

  return (
    <main
      ref={pageRef}
      className="product-details"
      style={{
        '--product-accent': product.accent,
      }}
    >
      <div className="product-details__ambient" />

      <div className="product-details__container">

        {/* ====================================
            BREADCRUMB + BACK BUTTON
        ==================================== */}

        <div className="product-details__topbar">

          <div className="product-details__breadcrumb">
            <Link to="/">HOME</Link>

            <span>/</span>

            <Link to="/#collection">
              COLLECTION
            </Link>

            <span>/</span>

            <strong>{product.name}</strong>
          </div>

          <Link
            to="/#collection"
            className="product-details__back-btn"
          >
            <ArrowLeft size={17} />
            <span>BACK TO COLLECTION</span>
          </Link>

        </div>

        <div className="product-details__layout">

          {/* ==================================
              LEFT — IMAGE GALLERY
          ================================== */}

          <div className="product-details__gallery">

            <div className="product-details__visual">

              <div className="product-details__visual-grid" />

              <div className="product-details__visual-top">
                <span>
                  <ScanLine size={15} />
                  PRODUCT SCAN / {product.number}
                </span>

                <span>
                  {images[activeImage].label} VIEW
                </span>
              </div>

              {/* HUD CORNERS */}

              <div className="product-details__corner product-details__corner--tl" />
              <div className="product-details__corner product-details__corner--tr" />
              <div className="product-details__corner product-details__corner--bl" />
              <div className="product-details__corner product-details__corner--br" />

              {/* MAIN PRODUCT IMAGE */}

              <img
                ref={imageRef}
                src={images[activeImage].src}
                alt={`${product.name} ${images[activeImage].label} view`}
                className="product-details__main-image"
                draggable="false"
              />

              <div className="product-details__visual-bottom">
                <span>
                  <Crosshair size={15} />
                  VELOX V1 / {product.name}
                </span>

                <span>
                  {String(activeImage + 1).padStart(2, '0')} /{' '}
                  {String(images.length).padStart(2, '0')}
                </span>
              </div>

              {/* GALLERY NAVIGATION */}

              <button
                type="button"
                className="product-details__gallery-arrow product-details__gallery-arrow--prev"
                onClick={previousImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={23} />
              </button>

              <button
                type="button"
                className="product-details__gallery-arrow product-details__gallery-arrow--next"
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight size={23} />
              </button>

            </div>

            {/* ==================================
                IMAGE THUMBNAILS
            ================================== */}

            <div className="product-details__thumbnails">
              {images.map((image, index) => (
                <button
                  key={image.label}
                  type="button"
                  className={`product-details__thumbnail ${
                    activeImage === index ? 'is-active' : ''
                  }`}
                  onClick={() => changeImage(index)}
                  aria-label={`View ${image.label.toLowerCase()} image`}
                  aria-pressed={activeImage === index}
                >
                  <img
                    src={image.src}
                    alt=""
                    loading="lazy"
                  />

                  <span>{image.label}</span>
                </button>
              ))}
            </div>

          </div>

          {/* ==================================
              RIGHT — PRODUCT INFORMATION
          ================================== */}

          <div className="product-details__info">

            {/* EDITION */}

            <div className="product-details__edition">
              <span className="product-details__edition-dot" />

              VELOX V1 / {product.edition}
            </div>

            {/* PRODUCT NAME */}

            <h1 className="product-details__name">
              {product.name}
              <span>.</span>
            </h1>

            {/* SUBTITLE */}

            <p className="product-details__subtitle">
              {product.subtitle}
            </p>

            {/* PRICE */}

            <div className="product-details__price">
              {formatPrice(product.price)}

              <span>CONCEPT RETAIL PRICE</span>
            </div>

            <div className="product-details__divider" />

            {/* DESCRIPTION */}

            <p className="product-details__description">
              {product.description}
            </p>

            {/* ==================================
                COLORWAY
            ================================== */}

            <div className="product-details__colorway">
              <span>COLORWAY</span>

              <div>
                <span
                  className="product-details__color-dot"
                  style={{
                    background: product.accent,
                  }}
                />

                {product.colorway}
              </div>
            </div>

            {/* ==================================
                SIZE SELECTOR
            ================================== */}

            <div className="product-details__size-section">

              <div className="product-details__section-heading">
                <span>SELECT SIZE / EU</span>
                <span>SIZE GUIDE</span>
              </div>

              <div className="product-details__sizes">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={
                      selectedSize === size
                        ? 'is-selected'
                        : ''
                    }
                    onClick={() => {
                      setSelectedSize(size);
                      setError('');
                      setAdded(false);
                    }}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {error && (
                <p
                  className="product-details__error"
                  role="alert"
                >
                  {error}
                </p>
              )}

            </div>

            {/* ==================================
                QUANTITY SELECTOR
            ================================== */}

            <div className="product-details__quantity-section">

              <span>QUANTITY</span>

              <div className="product-details__quantity">

                <button
                  type="button"
                  onClick={() => {
                    setQuantity((prev) =>
                      Math.max(1, prev - 1)
                    );
                    setAdded(false);
                  }}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  <Minus size={17} />
                </button>

                <strong>{quantity}</strong>

                <button
                  type="button"
                  onClick={() => {
                    setQuantity((prev) =>
                      Math.min(10, prev + 1)
                    );
                    setAdded(false);
                  }}
                  aria-label="Increase quantity"
                  disabled={quantity >= 10}
                >
                  <Plus size={17} />
                </button>

              </div>
            </div>

            {/* ==================================
                FUNCTIONAL ADD TO CART
            ================================== */}

            <button
              type="button"
              className={`product-details__add-cart ${
                added ? 'is-added' : ''
              }`}
              onClick={handleAddToCart}
            >
              {added ? (
                <>
                  <Check size={21} />
                  ADDED TO CART
                </>
              ) : (
                <>
                  <ShoppingBag size={21} />
                  ADD TO CART
                </>
              )}

              <ArrowUpRight size={20} />
            </button>

            <p className="product-details__checkout-note">
  Choose your size and add your favourite pair to the cart.
</p>

            {/* ==================================
                BENEFITS
            ================================== */}

            <div className="product-details__benefits">

              <div>
                <Truck size={20} />
                <span>DELIVERY EXPERIENCE</span>
              </div>

              <div>
                <ShieldCheck size={20} />
                <span>PREMIUM DESIGN</span>
              </div>

              <div>
                <RotateCcw size={20} />
                <span>EXPLORE ALL COLORWAYS</span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
