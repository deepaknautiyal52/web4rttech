import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroIllustration from './HeroIllustration';
import './HeroSlider.css';

const SLIDES = [
  {
    id: 'development',
    eyebrow: 'Web & Mobile Development',
    title: "Building Tomorrow's Technology, Today",
    description: 'We design, build, and scale websites, apps, and cloud platforms that turn visitors into customers.',
    ctaLabel: 'Explore Development',
    ctaTo: '/services#development'
  },
  {
    id: 'growth',
    eyebrow: 'Digital Marketing & Growth',
    title: 'Marketing That Gets You Found — and Chosen',
    description: 'SEO, paid ads, and social strategy engineered around measurable growth, not vanity metrics.',
    ctaLabel: 'Explore Growth Marketing',
    ctaTo: '/services#growth'
  },
  {
    id: 'ai-data',
    eyebrow: 'AI & Data Science',
    title: 'Turn Data Into Decisions, Automatically',
    description: 'Practical AI and analytics that automate the busywork and surface the insights that actually matter.',
    ctaLabel: 'Explore AI & Data',
    ctaTo: '/services#ai-data'
  }
];

const AUTOPLAY_MS = 6000;

const HeroSlider = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    setActive((index + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [next, paused]);

  return (
    <section
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-slider-track">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide slide-${slide.id} ${index === active ? 'active' : ''}`}
            aria-hidden={index !== active}
          >
            <div className="hero-slide-content">
              <span className="hero-slide-eyebrow">{slide.eyebrow}</span>
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              <div className="hero-slide-actions">
                <Link to={slide.ctaTo} className="hero-slide-cta">{slide.ctaLabel}</Link>
                <Link to="/contact" className="hero-slide-secondary">Get a Quote →</Link>
              </div>
            </div>
            <HeroIllustration variant={slide.id} />
          </div>
        ))}
      </div>

      <button className="hero-slider-arrow prev" onClick={prev} aria-label="Previous slide">‹</button>
      <button className="hero-slider-arrow next" onClick={next} aria-label="Next slide">›</button>

      <div className="hero-slider-dots">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            className={`hero-slider-dot ${index === active ? 'active' : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Go to ${slide.eyebrow} slide`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
