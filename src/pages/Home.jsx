import React from 'react';
import { Link } from 'react-router-dom';
import services from '../data/services';
import ServiceIcon from '../components/ServiceIcon';
import HeroSlider from '../components/HeroSlider';
import SEO from '../components/SEO';
import VentureGrid from '../components/VentureGrid';
import './Home.css';

const FEATURED_SERVICE_IDS = [
  'web-development',
  'mobile-app-development',
  'seo',
  'ppc-google-ads',
  'ai-solutions',
  'data-science'
];

const featuredServices = FEATURED_SERVICE_IDS.map((id) => services.find((s) => s.id === id));

const WHY_WEB4RT = [
  {
    title: 'One Team, Every Channel',
    description: 'Development and growth marketing under one roof — your site, app, SEO, and ads all work toward the same goal.'
  },
  {
    title: 'Built for Global Clients',
    description: 'Comfortable working across time zones and currencies, with clear async communication and transparent reporting.'
  },
  {
    title: 'Data-Backed Decisions',
    description: 'Every campaign and product decision is measured — you always know what’s working and why.'
  },
  {
    title: 'Direct Access, No Layers',
    description: 'You work directly with the people building your product and running your campaigns, not account managers relaying messages.'
  }
];

const PROCESS_STEPS = [
  { title: 'Discover', description: 'We start with a conversation about your goals, audience, and constraints — no cookie-cutter proposals.' },
  { title: 'Plan & Design', description: 'A clear scope, timeline, and design direction before any development or campaign work begins.' },
  { title: 'Build & Execute', description: 'Iterative delivery with regular check-ins, so you always know exactly where things stand.' },
  { title: 'Launch & Grow', description: 'We don’t disappear after launch — ongoing support and optimization keep results compounding.' }
];

const Home = () => {
  return (
    <main>
      <SEO
        title="Web Development, Digital Marketing & AI Solutions"
        description="Web4rtTech is a digital-first IT services and consulting company offering web & mobile development, SEO, PPC, digital marketing, and AI & data science solutions for businesses in India and worldwide."
        path="/"
      />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Purpose Section */}
      <section className="purpose-section">
        <div className="container">
          <div className="purpose-content">
            <h2>Our Purpose</h2>
            <p>To amplify human potential and unlock the next opportunity for people, businesses and communities through thoughtful technology</p>
          </div>
        </div>
      </section>

      {/* Why Web4rtTech Section */}
      <section className="why-section">
        <div className="container">
          <h2>Why Web4rtTech</h2>
          <div className="why-grid">
            {WHY_WEB4RT.map((item) => (
              <div key={item.title} className="why-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            {featuredServices.map((service) => (
              <Link key={service.id} to={`/services/${service.id}`} className="service-card">
                <div className="service-icon">
                  <ServiceIcon id={service.id} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </Link>
            ))}
          </div>
          <div className="services-view-all">
            <Link to="/services" className="services-view-all-link">View All Services →</Link>
          </div>
        </div>
      </section>

      {/* Ventures Section */}
      <section className="ventures-section">
        <div className="container">
          <h2>Beyond Technology</h2>
          <p className="ventures-section-intro">
            The Web4rtTech family also runs homestays in Uttarakhand, a real estate business, and yoga &amp; wellness
            programmes, each with its own website.
          </p>
          <VentureGrid />
          <div className="services-view-all">
            <Link to="/ventures" className="services-view-all-link">Explore Our Ventures →</Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <h2>How We Work</h2>
          <p className="process-intro">A straightforward engagement process, whether you're building a product or running a campaign.</p>
          <div className="process-grid">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.title} className="process-step">
                <div className="process-step-number">{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="news-section">
        <div className="container">
          <h2>Latest Updates</h2>
          <div className="news-grid">
            <article className="news-card">
              <h3>Web4rtTech Launches AI-First Delivery Framework</h3>
              <p>A new approach to project delivery that embeds AI-assisted engineering across every stage</p>
              <Link to="/news/ai-first-delivery" className="read-more">Read more →</Link>
            </article>
            <article className="news-card">
              <h3>Web4rtTech Cloud Fabric™ Now Live</h3>
              <p>A composable stack of cloud services and connectors built to accelerate enterprise migrations</p>
                <Link to="/news/cloud-fabric" className="read-more">Read more →</Link>
            </article>
            <article className="news-card">
              <h3>New Innovations in Tech</h3>
              <p>Discover how we're driving innovation and digital excellence for growing enterprises</p>
                <Link to="/news/innovations-2025" className="read-more">Read more →</Link>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Let's build what's next, together</h2>
          <p>Connect with our experts to discover how Web4rtTech can transform your business</p>
          <Link to="/contact">
            <button className="cta-button-primary">Contact Us</button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
