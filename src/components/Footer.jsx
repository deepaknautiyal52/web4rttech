import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-cta">
        <div className="container footer-cta-inner">
          <div>
            <h3>Have a project in mind?</h3>
            <p>Let's talk about how Web4rt can help you build, grow, and scale.</p>
          </div>
          <Link to="/contact" className="footer-cta-btn">Get a Quote →</Link>
        </div>
      </div>

      <div className="footer-content container">
        <div className="footer-section footer-brand">
          <Link to="/" className="footer-logo">Web<span>4</span>rt</Link>
          <p className="footer-tagline">Engineering digital experiences that move your business forward.</p>
        </div>

        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/news">Newsroom</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Services</h3>
          <ul>
            <li><Link to="/services/web-development">Web Development</Link></li>
            <li><Link to="/services/mobile-app-development">Mobile App Development</Link></li>
            <li><Link to="/services/seo">SEO</Link></li>
            <li><Link to="/services/ppc-google-ads">PPC &amp; Google Ads</Link></li>
            <li><Link to="/services/ai-solutions">AI Solutions</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Resources</h3>
          <ul>
            <li><Link to="/services">All Services</Link></li>
            <li><Link to="/news">Insights &amp; News</Link></li>
            <li><Link to="/careers">Open Roles</Link></li>
            <li><a href="#faq">FAQs</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-links">
            <a href="#twitter" className="social-icon">𝕏</a>
            <a href="#facebook" className="social-icon">f</a>
            <a href="#linkedin" className="social-icon">in</a>
            <a href="#youtube" className="social-icon">▶</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Web4rt. All rights reserved.</p>
          <div className="footer-links">
            <a href="#terms">Terms of Use</a>
            <a href="#privacy">Privacy Statement</a>
            <a href="#cookies">Cookie Policy</a>
            <a href="#sitemap">Site Map</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
