import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { fetchArticles } from '../data/news';
import './News.css';

const News = () => {
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    fetchArticles().then(setArticles);
  }, []);

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
            {!articles && <p>Loading...</p>}
            {articles && articles.length === 0 && <p>No news yet. Check back soon.</p>}
            {articles && articles.map(a => (
              <article key={a.slug} className="news-card">
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <Link to={`/news/${a.slug}`} className="read-more">Read more →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default News;
