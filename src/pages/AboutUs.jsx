import React from 'react';
import HeroIllustration from '../components/HeroIllustration';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-flex">
          <div className="page-hero-text">
            <h1>About Web4rt</h1>
            <p>A digital-first IT services and consulting company</p>
          </div>
          <div className="page-hero-illustration">
            <HeroIllustration variant="about" />
          </div>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-section">
            <h2>Who We Are</h2>
            <p>
              Web4rt is a technology partner for businesses that want to move faster. We design,
              build, and scale digital products, cloud platforms, and AI-driven solutions that
              help organizations navigate their next chapter of growth.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-card">
              <h3>Client-First Delivery</h3>
              <p>Dedicated teams that work as an extension of your business, not just a vendor</p>
            </div>
            <div className="about-card">
              <h3>Innovation Focus</h3>
              <p>Continuously exploring emerging technologies to keep our clients ahead</p>
            </div>
            <div className="about-card">
              <h3>Proven Reliability</h3>
              <p>Trusted by growing businesses for delivering quality, on-time results</p>
            </div>
            <div className="about-card">
              <h3>Social Responsibility</h3>
              <p>Committed to sustainable practices and giving back to our community</p>
            </div>
          </div>

          <div className="about-section">
            <h2>Our Values</h2>
            <ul className="values-list">
              <li><strong>Integrity:</strong> We maintain the highest ethical standards in all our dealings</li>
              <li><strong>Excellence:</strong> We strive for excellence in everything we do</li>
              <li><strong>Inclusivity:</strong> We embrace diversity and foster an inclusive workplace</li>
              <li><strong>Sustainability:</strong> We are committed to sustainable and responsible business practices</li>
              <li><strong>Client Focus:</strong> We put our clients at the center of everything we do</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
