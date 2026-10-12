
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  ArrowUpRight,
  ArrowDownRight,
  Crosshair,
  Fingerprint,
  Layers3,
  ScanLine,
  Zap,
} from 'lucide-react';

import './About.scss';

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    number: '01',
    icon: Fingerprint,
    title: 'DISTINCT BY DESIGN',
    description:
      'A bold visual identity that refuses to disappear into the crowd.',
  },
  {
    number: '02',
    icon: Zap,
    title: 'MADE FOR MOTION',
    description:
      'An attitude built around energy, momentum and moving forward.',
  },
  {
    number: '03',
    icon: Layers3,
    title: 'DETAILS THAT MATTER',
    description:
      'Strong silhouettes, expressive colorways and an unmistakable presence.',
  },
];

function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reducedMotion) return;

    const context = gsap.context(() => {
      // INTRO COPY
      gsap.fromTo(
        '.velox-about__reveal',
        {
          y: 55,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.13,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.velox-about__top',
            start: 'top 78%',
            once: true,
          },
        }
      );

      // PRIMARY PRODUCT VISUAL
      gsap.fromTo(
        '.velox-about__main-visual',
        {
          y: 75,
          opacity: 0,
          rotate: -2,
        },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.velox-about__story',
            start: 'top 80%',
            once: true,
          },
        }
      );

      // SECONDARY PRODUCT VISUAL
      gsap.fromTo(
        '.velox-about__secondary-visual',
        {
          x: 65,
          y: 35,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1.1,
          delay: 0.25,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.velox-about__story',
            start: 'top 75%',
            once: true,
          },
        }
      );

      // STORY CONTENT
      gsap.fromTo(
        '.velox-about__story-reveal',
        {
          y: 45,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.13,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.velox-about__story-copy',
            start: 'top 82%',
            once: true,
          },
        }
      );

      // VALUES
      gsap.fromTo(
        '.velox-about__value',
        {
          y: 55,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.13,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.velox-about__values',
            start: 'top 85%',
            once: true,
          },
        }
      );

      // SUBTLE PARALLAX
      gsap.to('.velox-about__main-visual img', {
        yPercent: -7,
        ease: 'none',
        scrollTrigger: {
          trigger: '.velox-about__story',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // HORIZONTAL TECH LINE
      gsap.fromTo(
        '.velox-about__scan-progress',
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.velox-about__values',
            start: 'top 90%',
            end: 'bottom 55%',
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section
      id="about"
      className="velox-about"
      ref={sectionRef}
      aria-labelledby="velox-about-title"
    >
      <div className="velox-about__ambient" />

      <div className="velox-about__container">

        {/* =====================================
            INTRO
        ===================================== */}

        <div className="velox-about__top">
          <div className="velox-about__eyebrow velox-about__reveal">
            <span className="velox-about__live-dot" />
            VELOX / THE IDENTITY
            <span className="velox-about__eyebrow-line" />
            001
          </div>

          <div className="velox-about__intro-grid">
            <h2
              id="velox-about-title"
              className="velox-about__heading velox-about__reveal"
            >
              WE MOVE
              <span> DIFFERENT.</span>
            </h2>

            <div className="velox-about__intro-aside velox-about__reveal">
              <Crosshair size={23} strokeWidth={1.3} />

              <p>
                NOT JUST A SILHOUETTE.
                <br />
                NOT JUST A COLORWAY.
                <br />
                A DIFFERENT STATE OF MOTION.
              </p>

              <span>THE VELOX MINDSET / V1</span>
            </div>
          </div>

          <div className="velox-about__intro-bottom">
            <span>EST. IN IMAGINATION</span>
            <span>
              DISCOVER OUR STORY
              <ArrowDownRight size={15} />
            </span>
          </div>
        </div>

        {/* =====================================
            BRAND STORY
        ===================================== */}

        <div className="velox-about__story">

          {/* PRODUCT IMAGE COMPOSITION */}
          <div className="velox-about__art">

            <div className="velox-about__main-visual">
              <img
                src="/images/products/ignition/velox-v1-ignition-hero.png"
                alt="VELOX IGNITION sneaker in cinematic orange lighting"
                loading="lazy"
              />

              <div className="velox-about__visual-overlay" />

              <div className="velox-about__visual-top">
                <span>
                  <ScanLine size={15} />
                  VISUAL ARCHIVE
                </span>
                <span>V / 001</span>
              </div>

              <div className="velox-about__visual-bottom">
                <span>ORIGINAL FREQUENCY</span>
                <strong>IGNITION.</strong>
              </div>

              <div className="velox-about__corner velox-about__corner--tl" />
              <div className="velox-about__corner velox-about__corner--tr" />
              <div className="velox-about__corner velox-about__corner--bl" />
              <div className="velox-about__corner velox-about__corner--br" />
            </div>

            <div className="velox-about__secondary-visual">
              <img
                src="/images/products/phantom/velox-v1-phantom-hero.png"
                alt="VELOX PHANTOM ivory and champagne sneaker"
                loading="lazy"
              />

              <div className="velox-about__secondary-label">
                <span>THE OTHER SIDE</span>
                <strong>PHANTOM / 03</strong>
              </div>
            </div>

            <div className="velox-about__image-code">
              VELOX / DIGITAL ARCHIVE / 001—004
            </div>
          </div>

          {/* STORY COPY */}
          <div className="velox-about__story-copy">

            <div className="velox-about__index velox-about__story-reveal">
              <span>01 / OUR VISION</span>
              <span className="velox-about__index-line" />
            </div>

            <h3 className="velox-about__story-title velox-about__story-reveal">
              THE FUTURE
              <span> DOESN'T WAIT.</span>
            </h3>

            <p className="velox-about__lead velox-about__story-reveal">
              Neither do we.
            </p>

            <p className="velox-about__description velox-about__story-reveal">
              VELOX is a design-led sneaker concept born
              from one simple idea: motion is more than
              movement. It's expression. It's confidence.
              It's the decision to keep pushing forward.
            </p>

            <p className="velox-about__description velox-about__story-reveal">
              From the electric intensity of IGNITION to
              the quiet presence of PHANTOM, each V1
              colorway explores a different side of the
              same identity.
            </p>

            <div className="velox-about__story-facts velox-about__story-reveal">
              <div>
                <strong>04</strong>
                <span>COLORWAYS</span>
              </div>

              <div>
                <strong>01</strong>
                <span>VISION</span>
              </div>

              <div>
                <strong>V1</strong>
                <span>COLLECTION</span>
              </div>
            </div>

            <Link
              to="/#collection"
              className="velox-about__cta velox-about__story-reveal"
            >
              EXPLORE THE COLLECTION
              <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>

        {/* =====================================
            BRAND VALUES
        ===================================== */}

        <div className="velox-about__values">
          <div className="velox-about__values-heading">
            <div>
              <span>02 / OUR LANGUAGE</span>
              <h3>
                THE VELOX
                <strong> CODE.</strong>
              </h3>
            </div>

            <span className="velox-about__values-count">
              03 PRINCIPLES / ONE IDENTITY
            </span>
          </div>

          <div className="velox-about__scan-track">
            <span className="velox-about__scan-progress" />
          </div>

          <div className="velox-about__values-grid">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.number}
                  className="velox-about__value"
                >
                  <div className="velox-about__value-top">
                    <span>{value.number} / 03</span>

                    <Icon size={25} strokeWidth={1.4} />
                  </div>

                  <h4>{value.title}</h4>

                  <p>{value.description}</p>

                  <div className="velox-about__value-bottom">
                    <span>VELOX / IDENTITY</span>
                    <ArrowUpRight size={17} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* =====================================
            FINAL BRAND SIGNATURE
        ===================================== */}

        <div className="velox-about__signature">
          <span>
            <span className="velox-about__live-dot" />
            THE MOVEMENT CONTINUES
          </span>

          <strong>BUILT FOR MOTION.</strong>
        </div>

      </div>
    </section>
  );
}

export default About;
