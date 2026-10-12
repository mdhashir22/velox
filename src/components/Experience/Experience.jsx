
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  ArrowUpRight,
  ArrowDown,
  Activity,
  Crosshair,
  Cpu,
  Gauge,
  MoveRight,
  Radio,
  ScanLine,
  Zap,
} from 'lucide-react';

import './Experience.scss';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// VELOX CINEMATIC EXPERIENCE
// ==========================================

const scenes = [
  {
    id: 'engineering',
    number: '01',
    eyebrow: 'THE VELOX PHILOSOPHY',
    title: ['ENGINEERED', 'FOR MOTION.'],
    description:
      'Every movement begins with a decision. VELOX is a vision of fearless design, bold silhouettes and a future that never stands still.',
    video: '/videos/velox-hero-02-power.mp4',
    poster:
      '/images/products/ignition/velox-v1-ignition-hero.png',
    label: 'DESIGN / EVOLUTION',
    stat: '01 / DESIGN',
    tags: ['FORM', 'IDENTITY', 'MOTION'],
    Icon: Cpu,
  },

  {
    id: 'power',
    number: '02',
    eyebrow: 'ENERGY IN EVERY DETAIL',
    title: ['FEEL THE', 'POWER.'],
    description:
      'A visual language of raw energy. Sharp contrasts, striking colorways and unmistakable character make every VELOX V1 a statement.',
    video: '/videos/velox-hero-03-velocity.mp4',
    poster:
      '/images/products/pulse/velox-v1-pulse-hero.png',
    label: 'ENERGY / EXPRESSION',
    stat: '02 / POWER',
    tags: ['ENERGY', 'PRESENCE', 'ATTITUDE'],
    Icon: Zap,
  },

  {
    id: 'future',
    number: '03',
    eyebrow: 'NO LIMITS. NO COMPROMISE.',
    title: ['BEYOND', 'LIMITS.'],
    description:
      "The future isn't something we wait for. It's something we create. Discover four distinctive expressions of the VELOX V1.",
    video: '/videos/velox-hero-04-final-reveal.mp4',
    poster:
      '/images/products/phantom/velox-v1-phantom-hero.png',
    label: 'FUTURE / UNLOCKED',
    stat: '03 / FUTURE',
    tags: ['EVOLVE', 'DISCOVER', 'REPEAT'],
    Icon: Activity,
  },
];

function Experience() {
  const sectionRef = useRef(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const playVideo = (index) => {
      const video = videoRefs.current[index];

      if (!video) return;

      video.muted = true;

      const playPromise = video.play();

      if (playPromise?.catch) {
        playPromise.catch(() => {
          // Poster remains visible if autoplay is blocked.
        });
      }
    };

    const pauseVideo = (index) => {
      videoRefs.current[index]?.pause();
    };

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray(
        '.experience__scene'
      );

      elements.forEach((scene, index) => {
        const visual = scene.querySelector(
          '.experience__visual'
        );

        const copy = scene.querySelectorAll(
          '.experience__reveal'
        );

        const progress = scene.querySelector(
          '.experience__progress-fill'
        );

        // Play videos only while their scene is visible.
        ScrollTrigger.create({
          trigger: scene,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => playVideo(index),
          onEnterBack: () => playVideo(index),
          onLeave: () => pauseVideo(index),
          onLeaveBack: () => pauseVideo(index),
        });

        if (prefersReducedMotion) return;

        // Cinematic frame expands as user scrolls in.
        gsap.fromTo(
          visual,
          {
            clipPath: 'inset(9% 7% round 16px)',
            scale: 1.045,
          },
          {
            clipPath: 'inset(0% 0% round 0px)',
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: scene,
              start: 'top 92%',
              end: 'top 28%',
              scrub: 1,
            },
          }
        );

        // Heading, text and HUD reveal.
        gsap.fromTo(
          copy,
          {
            y: 45,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.95,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: scene,
              start: 'top 70%',
              once: true,
            },
          }
        );

        // Scroll-linked progress indicator.
        gsap.fromTo(
          progress,
          {
            scaleX: 0,
          },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: scene,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: true,
            },
          }
        );

        // Subtle parallax movement.
        gsap.fromTo(
          scene.querySelector('.experience__video'),
          {
            yPercent: -5,
          },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: scene,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    }, section);

    return () => {
      ctx.revert();

      videoRefs.current.forEach((video) => {
        video?.pause();
      });
    };
  }, []);

  return (
    <section
      id="experience"
      className="experience"
      ref={sectionRef}
      aria-label="VELOX cinematic experience"
    >
      {/* SECTION INTRO */}

      <div className="experience__intro">
        <div className="experience__intro-inner">
          <span className="experience__intro-label">
            <span className="experience__signal" />
            VELOX / MOTION EXPERIENCE
          </span>

          <h2>
            THIS IS NOT
            <span> JUST A SHOE.</span>
          </h2>

          <p>
            A visual journey into the world of VELOX.
            Three chapters. One obsession with motion.
          </p>

          <div className="experience__intro-bottom">
            <span>
              <ScanLine size={15} />
              CINEMATIC ARCHIVE INITIALIZED
            </span>

            <span>
              SCROLL TO EXPLORE
              <ArrowDown size={16} />
            </span>
          </div>
        </div>
      </div>

      {/* THREE CINEMATIC SCENES */}

      {scenes.map((scene, index) => {
        const Icon = scene.Icon;

        return (
          <article
            className={`experience__scene experience__scene--${scene.id}`}
            key={scene.id}
          >
            <div className="experience__visual">
              <video
                ref={(element) => {
                  videoRefs.current[index] = element;
                }}
                className="experience__video"
                src={scene.video}
                poster={scene.poster}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
              />

              <div className="experience__video-overlay" />
              <div className="experience__grid" />
              <div className="experience__vignette" />
            </div>

            <div className="experience__hud-top">
              <div className="experience__reveal">
                <span className="experience__hud-dot" />
                VELOX / EXPERIENCE
              </div>

              <div className="experience__reveal">
                <Radio size={14} />
                SYSTEM ACTIVE
              </div>
            </div>

            <div className="experience__corner experience__corner--tl" />
            <div className="experience__corner experience__corner--tr" />
            <div className="experience__corner experience__corner--bl" />
            <div className="experience__corner experience__corner--br" />

            <div className="experience__body">
              <div className="experience__content">
                <div className="experience__chapter experience__reveal">
                  <span className="experience__chapter-line" />

                  CHAPTER {scene.number} / 03
                </div>

                <div className="experience__eyebrow experience__reveal">
                  <Icon size={17} strokeWidth={1.7} />
                  {scene.eyebrow}
                </div>

                <h3 className="experience__title experience__reveal">
                  <span>{scene.title[0]}</span>
                  <span>{scene.title[1]}</span>
                </h3>

                <p className="experience__description experience__reveal">
                  {scene.description}
                </p>

                <div className="experience__tags experience__reveal">
                  {scene.tags.map((tag) => (
                    <span key={tag}>
                      <Crosshair size={12} />
                      {tag}
                    </span>
                  ))}
                </div>

                {index === 2 ? (
                  <Link
                    to="/#collection"
                    className="experience__cta experience__reveal"
                  >
                    EXPLORE THE COLLECTION
                    <ArrowUpRight size={19} />
                  </Link>
                ) : (
                  <div className="experience__scroll-cue experience__reveal">
                    <ArrowDown size={17} />
                    CONTINUE THE JOURNEY
                  </div>
                )}
              </div>

              <div className="experience__data experience__reveal">
                <div className="experience__data-icon">
                  {index === 0 && <Cpu size={25} />}
                  {index === 1 && <Gauge size={25} />}
                  {index === 2 && <Zap size={25} />}
                </div>

                <span>VISUAL SYSTEM / {scene.number}</span>

                <strong>{scene.label}</strong>

                <div className="experience__data-line">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>

            <div className="experience__hud-bottom">
              <div className="experience__sequence">
                <strong>{scene.number}</strong>
                <span>/ 03</span>
              </div>

              <div className="experience__progress">
                <span className="experience__progress-fill" />
              </div>

              <div className="experience__hud-label">
                {scene.stat}
                <MoveRight size={17} />
              </div>
            </div>
          </article>
        );
      })}

      {/* END OF EXPERIENCE */}

      <div className="experience__outro">
        <span>
          <span className="experience__signal" />
          EXPERIENCE COMPLETE
        </span>

        <h2>
          BUILT FOR
          <strong> MOTION.</strong>
        </h2>

        <p>
          Four colorways. One identity.
          Discover the pair that moves with you.
        </p>

        <Link to="/#collection">
          FIND YOUR FREQUENCY
          <ArrowUpRight size={18} />
        </Link>

        <div className="experience__outro-code">
          VELOX / END TRANSMISSION / V1
        </div>
      </div>
    </section>
  );
}

export default Experience;
