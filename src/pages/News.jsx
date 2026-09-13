import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './News.css';

const articles = [
  { id: 'ai-first-delivery', title: 'Web4rtTech Launches AI-First Delivery Framework', excerpt: 'A new approach to project delivery that embeds AI-assisted engineering across every stage' },
  { id: 'cloud-fabric', title: 'Web4rtTech Cloud Fabric™ Now Live', excerpt: 'A composable stack of cloud services and connectors built to accelerate enterprise migrations' },
  { id: 'innovations-2025', title: 'New Innovations in Tech', excerpt: 'Discover how we\'re driving innovation and digital excellence for growing enterprises' }
];

const News = () => {
  return (
    <main>
      <SEO
        title="Newsroom"
        description="Latest press releases, product announcements, and insights from Web4rtTech."
        path="/news"
      />

      <section className="page-hero">
        <div className="container">
          <h1>Newsroom</h1>
          <p>Latest press releases, announcements and insights</p>
        </div>
      </section>

      <section className="news-list-section">
        <div className="container">
          <div className="news-grid">
            {articles.map(a => (
              <article key={a.id} className="news-card">
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <Link to={`/news/${a.id}`} className="read-more">Read more →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default News;
