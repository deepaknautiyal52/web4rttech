import React from 'react';
import { Link } from 'react-router-dom';
import services, { categories } from '../data/services';
import HeroIllustration from '../components/HeroIllustration';
import SEO from '../components/SEO';
import './SiteMap.css';

const NEWS_ARTICLES = [
  { id: 'ai-first-delivery', title: 'Web4rtTech Launches AI-First Delivery Framework' },
  { id: 'cloud-fabric', title: 'Web4rtTech Cloud Fabric™ Now Live' },
  { id: 'innovations-2025', title: 'New Innovations in Tech' }
];

const SiteMap = () => {
  return (
    <main>
      <SEO
        title="Site Map"
        description="Browse every page on the Web4rtTech website, organized by section."
        path="/sitemap"
      />

      <section className="page-hero">
        <div className="container page-hero-flex">
          <div className="page-hero-text">
            <h1>Site Map</h1>
            <p>Every page on Web4rtTech, in one place</p>
          </div>
          <div className="page-hero-illustration">
            <HeroIllustration variant="careers" />
          </div>
        </div>
      </section>

      <section className="sitemap-content">
        <div className="container">
          <div className="sitemap-grid">
            <div className="sitemap-section">
              <h2>Company</h2>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/news">Newsroom</Link></li>
                <li><Link to="/contact">Contact / Get a Quote</Link></li>
              </ul>
            </div>

            {categories.map((category) => (
              <div key={category.id} className="sitemap-section">
                <h2>{category.title}</h2>
                <ul>
                  <li><Link to={`/services#${category.id}`}>All {category.title}</Link></li>
                  {services
                    .filter((s) => s.category === category.id)
                    .map((s) => (
                      <li key={s.id}><Link to={`/services/${s.id}`}>{s.title}</Link></li>
                    ))}
                </ul>
              </div>
            ))}

            <div className="sitemap-section">
              <h2>Newsroom</h2>
              <ul>
                <li><Link to="/news">All News</Link></li>
                {NEWS_ARTICLES.map((article) => (
                  <li key={article.id}><Link to={`/news/${article.id}`}>{article.title}</Link></li>
                ))}
              </ul>
            </div>

            <div className="sitemap-section">
              <h2>Legal</h2>
              <ul>
                <li><Link to="/terms">Terms of Use</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/cookies">Cookie Policy</Link></li>
                <li><Link to="/sitemap">Site Map</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SiteMap;
