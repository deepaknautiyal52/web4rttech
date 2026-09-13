import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Web4rtTech';
const SITE_URL = 'https://web4rttech.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Sets per-page <title>, meta description, canonical URL, and Open
 * Graph/Twitter tags. Falls back to sensible site-wide defaults.
 * `jsonLd` accepts a schema.org object (or array of objects) to inject
 * as a <script type="application/ld+json"> block for this page.
 */
const SEO = ({ title, description, path = '', image = DEFAULT_IMAGE, type = 'website', jsonLd }) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Engineering Your Digital Future`;
  const canonical = `${SITE_URL}${path}`;
  const jsonLdList = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLdList.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
export { SITE_NAME, SITE_URL, DEFAULT_IMAGE };
