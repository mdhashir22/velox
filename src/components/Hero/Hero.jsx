
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, Volume2, VolumeX } from 'lucide-react';
import { gsap } from 'gsap';
import './Hero.scss';

function Hero() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero__eyebrow',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: 'power3.out'
        }
      );

      gsap.fromTo(
        '.hero__title-line',
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.25,
          delay: 0.45,
          stagger: 0.15,
          ease: 'power4.out'
        }
      );

      gsap.fromTo(
        '.hero__description, .hero__actions, .hero__bottom',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 1,
          stagger: 0.12,
          ease: 'power3.out'
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const toggleSound = () => {
    if (!videoRef.current) return;

    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setMuted(nextMuted);
  };

  return (
    <section className="hero" id="home" ref={heroRef}>
      {/* BACKGROUND VIDEO */}
      <div className="hero__media">
        <video
          ref={videoRef}
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/products/ignition/velox-v1-ignition-hero.png"
        >
          <source
            src="/videos/velox-full-commercial.mp4"
            type="video/mp4"
          />
        </video>

        <div className="hero__overlay" />
      </div>

      {/* MAIN CONTENT */}
      <div className="hero__container">
        <div className="hero__content">
          <span className="hero__eyebrow">
            <span className="hero__eyebrow-line" />
            INTRODUCING VELOX V1
          </span>

          <h1 className="hero__title">
            <span className="hero__title-mask">
              <span className="hero__title-line">
                BUILT FOR
              </span>
            </span>

            <span className="hero__title-mask">
              <span className="hero__title-line hero__title-line--accent">
                MOTION.
              </span>
            </span>
          </h1>

          <p className="hero__description">
            Engineered to move beyond limits.
            Designed for those who never stand still.
          </p>

          <div className="hero__actions">
            <a href="#collection" className="hero__primary">
              EXPLORE COLLECTION
              <ArrowUpRight size={19} />
            </a>

            <a href="#experience" className="hero__secondary">
              DISCOVER VELOX
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>

        {/* BOTTOM INFORMATION */}
        <div className="hero__bottom">
          <div className="hero__edition">
            <span>01 / 04</span>
            <p>THE V1 COLLECTION</p>
          </div>

          <a href="#collection" className="hero__scroll">
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown size={17} />
          </a>

          <button
            type="button"
            className="hero__sound"
            onClick={toggleSound}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span>{muted ? 'SOUND OFF' : 'SOUND ON'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
