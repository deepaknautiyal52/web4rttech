import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO, { SITE_URL } from '../components/SEO';
import { fetchArticle } from '../data/news';

const NewsArticle = () => {
  const { id } = useParams();
  // undefined = loading, null = not found
  const [article, setArticle] = useState(undefined);

  useEffect(() => {
    setArticle(undefined);
    fetchArticle(id).then(setArticle);
  }, [id]);

  if (article === undefined) {
    return (
      <main className="container">
        <p>Loading...</p>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="container">
        <h2>Article not found</h2>
        <Link to="/news">Back to News</Link>
      </main>
    );
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    url: `${SITE_URL}/news/${id}`,
    ...(article.published_at ? { datePublished: article.published_at } : {}),
    publisher: { '@type': 'Organization', name: 'Web4rtTech', url: SITE_URL }
  };

  const paragraphs = String(article.body || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main>
      <SEO
        title={article.title}
        description={article.excerpt}
        path={`/news/${id}`}
        type="article"
        jsonLd={articleJsonLd}
      />

      <section className="page-hero">
        <div className="container">
          <h1>{article.title}</h1>
        </div>
      </section>

      <section className="news-article-content">
        <div className="container">
          {paragraphs.map((p, i) => (
            <p key={i} style={{ whiteSpace: 'pre-line' }}>{p}</p>
          ))}
          <Link to="/news" className="back-link">← Back to News</Link>
        </div>
      </section>
    </main>
  );
};

export default NewsArticle;
