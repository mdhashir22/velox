
import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  MoveHorizontal,
  ScanLine,
  Crosshair,
  Activity,
  Zap,
} from 'lucide-react';

import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

import './Collection.scss';

gsap.registerPlugin(Draggable, ScrollTrigger);

const products = [
  {
    id: 'ignition',
    number: '01',
    name: 'IGNITION',
    edition: 'VELOX V1',
    colorway: 'BLACK / ELECTRIC ORANGE',
    description: 'Built to ignite every move.',
    image: '/images/products/ignition/velox-v1-ignition-hero.png',
    accent: '#ff641c',
    tag: 'SIGNATURE',
  },
  {
    id: 'frostbyte',
    number: '02',
    name: 'FROSTBYTE',
    edition: 'VELOX V1',
    colorway: 'MIDNIGHT / ICE BLUE',
    description: 'Cold precision. Limitless energy.',
    image: '/images/products/frostbyte/velox-v1-frostbyte-hero.png',
    accent: '#54bfff',
    tag: 'NEW COLORWAY',
  },
  {
    id: 'phantom',
    number: '03',
    name: 'PHANTOM',
    edition: 'VELOX V1',
    colorway: 'IVORY / CHAMPAGNE',
    description: 'Quiet confidence. Bold presence.',
    image: '/images/products/phantom/velox-v1-phantom-hero.png',
    accent: '#d6b98a',
    tag: 'LIMITED EDITION',
  },
  {
    id: 'pulse',
    number: '04',
    name: 'PULSE',
    edition: 'VELOX V1',
    colorway: 'OBSIDIAN / CRIMSON',
    description: 'Feel the energy in every step.',
    image: '/images/products/pulse/velox-v1-pulse-hero.png',
    accent: '#ff365a',
    tag: 'PERFORMANCE',
  },
];

const TOTAL = products.length;

const wrapIndex = (index) =>
  ((index % TOTAL) + TOTAL) % TOTAL;

const shortestOffset = (index, active) => {
  let difference = index - active;

  if (difference > TOTAL / 2) {
    difference -= TOTAL;
  }

  if (difference < -TOTAL / 2) {
    difference += TOTAL;
  }

  return difference;
};

function Collection() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const cardRefs = useRef([]);
  const activeRef = useRef(0);
  const dragStartRef = useRef(0);
  const suppressClickRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const activeProduct = products[activeIndex];

  const animateCards = useCallback((current, immediate = false) => {
    const isMobile = window.innerWidth <= 650;
    const isTablet = window.innerWidth <= 1024;

    const spacing = isMobile ? 175 : isTablet ? 250 : 370;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      const offset = shortestOffset(index, current);
      const distance = Math.abs(offset);
      const isActive = offset === 0;

      const x = offset * spacing;

      const y = isActive
        ? 0
        : distance === 1
          ? 25
          : 55;

      const scale = isActive
        ? 1
        : distance === 1
          ? 0.76
          : 0.58;

      const rotation = isActive
        ? 0
        : offset < 0
          ? 13
          : -13;

      const opacity = isActive
        ? 1
        : distance === 1
          ? 0.62
          : 0.22;

      gsap.to(card, {
        x,
        y,
        scale,
        rotationY: rotation,
        opacity,
        zIndex: 10 - distance,
        duration: immediate ? 0 : 0.85,
        ease: 'power3.out',
        overwrite: true,
      });

      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-hidden', String(!isActive));

      const action = card.querySelector('.holo-card__action');

      if (action) {
        action.tabIndex = isActive ? 0 : -1;
      }
    });
  }, []);

  const goTo = useCallback(
    (index) => {
      const nextIndex = wrapIndex(index);

      activeRef.current = nextIndex;
      setActiveIndex(nextIndex);

      animateCards(nextIndex);
    },
    [animateCards]
  );

  const next = useCallback(() => {
    goTo(activeRef.current + 1);
  }, [goTo]);

  const previous = useCallback(() => {
    goTo(activeRef.current - 1);
  }, [goTo]);

  useEffect(() => {
    animateCards(0, true);

    const handleResize = () => {
      animateCards(activeRef.current, true);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [animateCards]);

  useEffect(() => {
    const stage = stageRef.current;
    const proxy = dragRef.current;

    if (!stage || !proxy) return;

    const dragger = Draggable.create(proxy, {
      type: 'x',
      trigger: stage,
      minimumMovement: 5,
      dragResistance: 0.12,
      allowNativeTouchScrolling: true,

      onPress() {
        dragStartRef.current = this.x;
        suppressClickRef.current = false;
      },

      onDragStart() {
        setIsDragging(true);
      },

      onDragEnd() {
        setIsDragging(false);

        const distance = this.x - dragStartRef.current;
        const velocity = this.getDirection() === 'left' ? -1 : 1;

        if (Math.abs(distance) > 35) {
          const steps = Math.min(
            3,
            Math.max(1, Math.round(Math.abs(distance) / 160))
          );

          const direction = distance < 0 ? 1 : -1;

          goTo(activeRef.current + direction * steps);

          suppressClickRef.current = true;
        }

        gsap.set(proxy, { x: 0 });
      },
    })[0];

    return () => {
      dragger.kill();
    };
  }, [goTo]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.holo-collection__eyebrow, .holo-collection__title, .holo-collection__intro',
        {
          y: 45,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.holo-collection__header',
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.holo-collection__stage',
        {
          opacity: 0,
          y: 70,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.holo-collection__stage',
            start: 'top 90%',
            once: true,
          },
        }
      );

      gsap.to('.holo-collection__scanline', {
        yPercent: 200,
        repeat: -1,
        duration: 5,
        ease: 'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardClick = (index) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    if (index !== activeRef.current) {
      goTo(index);
    }
  };

  return (
    <section
      className="holo-collection"
      id="collection"
      ref={sectionRef}
    >
      <div className="holo-collection__ambient" />

      <div className="holo-collection__container">

        {/* HEADER */}
        <div className="holo-collection__header">
          <div>
            <span className="holo-collection__eyebrow">
              <span className="holo-collection__eyebrow-line" />
              VELOX / HOLOGRAPHIC ARCHIVE
              <span className="holo-collection__system-dot" />
              SYSTEM ONLINE
            </span>

            <h2 className="holo-collection__title">
              SELECT YOUR
              <span> FREQUENCY.</span>
            </h2>
          </div>

          <p className="holo-collection__intro">
            Four expressions of motion.
            One relentless pursuit of what's next.
            Swipe through the V1 archive.
          </p>
        </div>

        {/* HOLOGRAPHIC INTERFACE */}
        <div
          className={`holo-collection__stage ${
            isDragging ? 'is-dragging' : ''
          }`}
          ref={stageRef}
          aria-label="VELOX sneaker collection slider"
        >
          <div className="holo-collection__scanline" />

          <div className="holo-collection__hud-top">
            <span>
              <ScanLine size={14} />
              VISUAL ARCHIVE / V1
            </span>

            <span>
              <Activity size={14} />
              LIVE INTERFACE
            </span>
          </div>

          <div className="holo-collection__crosshair holo-collection__crosshair--left">
            <Crosshair size={24} />
          </div>

          <div className="holo-collection__crosshair holo-collection__crosshair--right">
            <Crosshair size={24} />
          </div>

          {/* DRAG PROXY */}
          <div
            className="holo-collection__drag-proxy"
            ref={dragRef}
            aria-hidden="true"
          />

          {/* 3D CARDS */}
          <div className="holo-collection__deck">
            {products.map((product, index) => (
              <article
                key={product.id}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className={`holo-card ${
                  index === activeIndex ? 'is-active' : ''
                }`}
                style={{
                  '--card-accent': product.accent,
                }}
                onClick={() => handleCardClick(index)}
              >
                <div className="holo-card__corners" />

                <div className="holo-card__top">
                  <span>
                    FILE / {product.number}
                  </span>

                  <span>
                    {product.tag}
                  </span>
                </div>

                <div className="holo-card__visual">
                  <img
                    src={product.image}
                    alt={`VELOX V1 ${product.name}`}
                    draggable="false"
                    loading="lazy"
                  />
                </div>

                <div className="holo-card__bottom">
                  <span>{product.edition}</span>

                  <h3>{product.name}</h3>

                  <div className="holo-card__bottom-row">
                    <span>{product.colorway}</span>

                    <Link
                      className="holo-card__action"
                      to={`/product/${product.id}`}
                      aria-label={`View ${product.name} details`}
                      onClick={(event) => event.stopPropagation()}
>
                      <ArrowUpRight size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="holo-collection__hud-bottom">
            <span>
              <MoveHorizontal size={16} />
              DRAG / SWIPE TO NAVIGATE
            </span>

            <span>
              <Zap size={14} />
              MOTION SYSTEM ACTIVE
            </span>
          </div>
        </div>

        {/* ACTIVE PRODUCT INFO */}
        <div className="holo-collection__controls">
          <div className="holo-collection__active-info">
            <span className="holo-collection__active-label">
              CURRENTLY SELECTED / {activeProduct.number}
            </span>

            <h3 key={activeProduct.id}>
              {activeProduct.name}
            </h3>

            <p>{activeProduct.description}</p>
          </div>

          <div className="holo-collection__navigation">
            <div className="holo-collection__counter">
              <strong>
                {String(activeIndex + 1).padStart(2, '0')}
              </strong>

              <span>/</span>

              <span>
                {String(TOTAL).padStart(2, '0')}
              </span>
            </div>

            <div className="holo-collection__buttons">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous sneaker"
              >
                <ArrowLeft size={22} />
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next sneaker"
              >
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* PROGRESS INDICATORS */}
        <div className="holo-collection__progress">
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              className={
                index === activeIndex ? 'is-active' : ''
              }
              onClick={() => goTo(index)}
              aria-label={`Select ${product.name}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            >
              <span />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Collection;
