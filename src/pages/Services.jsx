import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';
import services, { categories } from '../data/services';
import ServiceIcon from '../components/ServiceIcon';
import HeroIllustration from '../components/HeroIllustration';
import SEO from '../components/SEO';

const Services = () => {
  return (
    <main>
      <SEO
        title="Our Services"
        description="Explore Web4rtTech's services: web & mobile development, cloud services, SEO, SMO, PPC & Google Ads, digital marketing strategy, AdSense monetization, AI solutions, and data science."
        path="/services"
      />

      <section className="page-hero">
        <div className="container page-hero-flex">
          <div className="page-hero-text">
            <h1>Our Services</h1>
            <p>Development, growth marketing, and AI/data solutions for businesses in India and worldwide</p>
          </div>
          <div className="page-hero-illustration">
            <HeroIllustration variant="services" />
          </div>
        </div>
      </section>

      <section className="services-content">
        <div className="container">
          <div className="services-intro">
            <h2>What We Offer</h2>
            <p>
              Web4rtTech provides end-to-end technology and growth services that help businesses build
              great products and get them in front of the right customers.
            </p>
          </div>

          {categories.map((category) => (
            <div key={category.id} id={category.id} className="services-category">
              <div className="services-category-header">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>

              <div className="services-large-grid">
                {services
                  .filter((service) => service.category === category.id)
                  .map((service) => (
                    <div key={service.id} className="service-detail-card">
                      <div className="service-icon-large">
                        <ServiceIcon id={service.id} />
                      </div>
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                      <Link to={`/services/${service.id}`} className="service-link">Learn More →</Link>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="service-benefits">
        <div className="container">
          <h2>Why Choose Web4rtTech?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <h3>One Team, Every Channel</h3>
              <p>Development and growth marketing under one roof — your site, app, SEO, and ads all work toward the same goal</p>
            </div>
            <div className="benefit-item">
              <h3>Built for Global Clients</h3>
              <p>Comfortable working across time zones and currencies, with clear async communication and transparent reporting</p>
            </div>
            <div className="benefit-item">
              <h3>Data-Backed Decisions</h3>
              <p>Every campaign and product decision is measured — you always know what's working and why</p>
            </div>
            <div className="benefit-item">
              <h3>Direct Access, No Layers</h3>
              <p>You work directly with the people building your product and running your campaigns, not account managers relaying messages</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
