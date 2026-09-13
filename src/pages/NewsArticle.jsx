import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO, { SITE_URL } from '../components/SEO';

const content = {
  'ai-first-delivery': {
    title: 'Web4rtTech Launches AI-First Delivery Framework',
    excerpt: 'A new approach to project delivery that embeds AI-assisted engineering across every stage.',
    body: 'Web4rtTech announced a new AI-first delivery framework designed to embed applied AI and automation across every stage of a project. The framework emphasizes faster iteration, higher code quality, and closer collaboration between engineering and design teams.'
  },
  'cloud-fabric': {
    title: 'Web4rtTech Cloud Fabric™ – Composable Stack',
    excerpt: 'A composable stack of cloud services and connectors built to accelerate enterprise migrations.',
    body: 'Cloud Fabric is a composable stack of cloud services, connectors, and reusable components built to accelerate enterprise cloud migrations. It allows organizations to combine pre-built modules to speed up deployments and reduce time-to-value.'
  },
  'innovations-2025': {
    title: 'New Innovations in Tech',
    excerpt: "Discover how we're driving innovation and digital excellence for growing enterprises.",
    body: 'Web4rtTech continues to invest in research and experimentation, pushing boundaries in cloud-native architectures, AI, and sustainability-focused solutions to help clients navigate their next.'
  }
};

const NewsArticle = () => {
  const { id } = useParams();
  const article = content[id];

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
    publisher: { '@type': 'Organization', name: 'Web4rtTech', url: SITE_URL }
  };

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
          <p>{article.body}</p>
          <Link to="/news" className="back-link">← Back to News</Link>
        </div>
      </section>
    </main>
  );
};

export default NewsArticle;
