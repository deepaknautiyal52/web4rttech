import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO, { SITE_URL } from '../components/SEO';
import VentureGrid from '../components/VentureGrid';
import ventures from '../data/ventures';
import './Ventures.css';

const Ventures = () => {
  const { hash } = useLocation();

  // Footer links point at /ventures#<id>; scroll that card into view.
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Web4rtTech',
    url: SITE_URL,
    subOrganization: ventures.map((v) => ({
      '@type': 'Organization',
      name: v.name,
      description: v.description,
      ...(v.url ? { url: v.url } : {})
    }))
  };

  return (
    <main>
      <SEO
        title="Our Ventures"
        description="Beyond IT services, the Web4rtTech family runs homestays in Uttarakhand, a real estate business, and yoga & wellness programmes, each with its own website."
        path="/ventures"
        jsonLd={orgJsonLd}
      />

      <section className="page-hero">
        <div className="container">
          <h1>Our Ventures</h1>
          <p>Beyond technology: hospitality, property and wellness, from the same team</p>
        </div>
      </section>

      <section className="ventures-intro">
        <div className="container">
          <p>
            Web4rtTech is our technology company, but it is not all we do. From our roots in Uttarakhand we also run
            three other businesses, each with its own dedicated website. Whether you are planning a stay in the hills,
            looking for property, or want to start your yoga journey, you are dealing with the same people you can trust
            with your software.
          </p>
        </div>
      </section>

      <section className="ventures-list">
        <div className="container">
          <VentureGrid detailed />
        </div>
      </section>

      <section className="ventures-cta">
        <div className="container">
          <h2>Not sure where to start?</h2>
          <p>Tell us what you need, whether it is a website, a stay, a property or a yoga programme, and we will point you to the right team.</p>
          <Link to="/contact" className="ventures-cta-btn">Contact Us →</Link>
        </div>
      </section>
    </main>
  );
};

export default Ventures;
