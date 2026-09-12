import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import services, { categories } from '../data/services';
import ServiceIcon from '../components/ServiceIcon';
import './ServiceDetail.css';

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{q}</span>
        <span className="faq-toggle">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  );
};

const ServiceDetail = () => {
  const { id } = useParams();
  const service = services.find(s => s.id === id);
  const category = service ? categories.find(c => c.id === service.category) : null;
  const relatedServices = service
    ? services.filter(s => s.category === service.category && s.id !== service.id)
    : [];

  if (!service) {
    return (
      <main className="container">
        <h2>Service not found</h2>
        <p>The requested service does not exist.</p>
        <Link to="/services">Back to Services</Link>
      </main>
    );
  }

  return (
    <main>
      <section className="page-hero service-detail-hero">
        <div className="container">
          <Link to={`/services#${category.id}`} className="service-eyebrow">{category.title}</Link>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
        </div>
      </section>

      <section className="service-detail-content">
        <div className="container">
          <div className="service-detail-wrap">
            <div className="service-detail-icon">
              <ServiceIcon id={service.id} />
            </div>
            <h2>Overview</h2>
            <p>{service.long}</p>

            <h3>Key Offerings</h3>
            <ul className="offerings-list">
              {service.offerings.map((offering) => (
                <li key={offering}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {offering}
                </li>
              ))}
            </ul>

            {service.techStack && service.techStack.length > 0 && (
              <>
                <h3>Tools &amp; Technologies</h3>
                <div className="tech-stack">
                  {service.techStack.map((tech) => (
                    <span key={tech} className="tech-pill">{tech}</span>
                  ))}
                </div>
              </>
            )}

            <Link to={`/contact?service=${service.id}`} className="service-cta">Get a Quote</Link>
            <Link to="/services" className="back-link">← Back to Services</Link>
          </div>
        </div>
      </section>

      {service.pricing && service.pricing.length > 0 && (
        <section className="service-pricing-section">
          <div className="container">
            <h2>Pricing Guide</h2>
            <p className="pricing-intro">Typical starting prices for {service.title.toLowerCase()} projects — pick a starting point, then we'll scope the details together.</p>
            <div className="pricing-grid">
              {service.pricing.map((tier) => (
                <div key={tier.name} className={`pricing-card ${tier.featured ? 'featured' : ''}`}>
                  {tier.featured && <span className="pricing-badge">Most Popular</span>}
                  <h3>{tier.name}</h3>
                  <p className="pricing-tagline">{tier.tagline}</p>
                  <div className="pricing-amount">
                    <span className="pricing-usd">
                      {tier.priceUSD}
                      {tier.billing && <span className="pricing-billing">{tier.billing}</span>}
                    </span>
                    {tier.priceUSD !== tier.priceINR && (
                      <span className="pricing-inr">≈ {tier.priceINR}{tier.billing}</span>
                    )}
                  </div>
                  <ul className="pricing-features">
                    {tier.features.map((feature) => (
                      <li key={feature}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={`/contact?service=${service.id}`} className={`pricing-cta ${tier.featured ? 'primary' : ''}`}>
                    Get a Quote
                  </Link>
                </div>
              ))}
            </div>
            {service.pricingNote && <p className="pricing-note">{service.pricingNote}</p>}
          </div>
        </section>
      )}

      {category && (
        <section className="service-process-section">
          <div className="container">
            <h2>Our {category.title} Process</h2>
            <div className="service-process-grid">
              {category.process.map((step, index) => (
                <div key={step.title} className="service-process-step">
                  <div className="service-process-number">{index + 1}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {service.faqs && service.faqs.length > 0 && (
        <section className="service-faq-section">
          <div className="container">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              {service.faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section className="related-services-section">
          <div className="container">
            <h2>Related Services</h2>
            <div className="related-services-grid">
              {relatedServices.map((s) => (
                <Link key={s.id} to={`/services/${s.id}`} className="related-service-card">
                  <div className="related-service-icon">
                    <ServiceIcon id={s.id} />
                  </div>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="service-cta-section">
        <div className="container">
          <h2>Ready to talk about your {service.title.toLowerCase()} project?</h2>
          <p>Tell us what you're trying to achieve and we'll get back to you within one business day.</p>
          <Link to={`/contact?service=${service.id}`}>
            <button className="cta-button-primary">Get a Quote</button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ServiceDetail;
