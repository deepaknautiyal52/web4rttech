import React from 'react';
import { Link } from 'react-router-dom';
import ventures from '../data/ventures';
import './VentureGrid.css';

const ICONS = {
  // Mountains with a small house
  homestay: (
    <>
      <path d="M2 20 9 8l4 6 3-4 6 10H2Z" />
      <path d="M13 20v-4l3-2.5 3 2.5v4" />
    </>
  ),
  // City buildings
  'real-estate': (
    <>
      <path d="M3 21V9l6-4v16" />
      <path d="M9 21V3h8a2 2 0 0 1 2 2v16" />
      <path d="M2 21h20" />
      <path d="M13 7h2M13 11h2M13 15h2M5 12h1M5 16h1" />
    </>
  ),
  // Lotus
  yoga: (
    <>
      <path d="M12 20c-4 0-8-2.5-9-7 3 0 6 1.5 9 7Z" />
      <path d="M12 20c4 0 8-2.5 9-7-3 0-6 1.5-9 7Z" />
      <path d="M12 20c-2.5-3-2.5-9 0-14 2.5 5 2.5 11 0 14Z" />
    </>
  )
};

export const VentureIcon = ({ id }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[id]}
  </svg>
);

// Cards for the sister businesses. `detailed` adds the highlight list
// (used on the Ventures page); the Home page shows the compact version.
const VentureGrid = ({ detailed = false }) => (
  <div className="venture-grid">
    {ventures.map((v) => (
      <article key={v.id} id={v.id} className="venture-card" style={{ '--venture-color': v.color }}>
        <div className="venture-icon">
          <VentureIcon id={v.id} />
        </div>
        <span className="venture-category">{v.category}</span>
        <h3>{v.name}</h3>
        <p className="venture-tagline">{v.tagline}</p>
        <p>{v.description}</p>

        {detailed && (
          <ul className="venture-highlights">
            {v.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}

        <div className="venture-actions">
          {v.url ? (
            <a href={v.url} target="_blank" rel="noopener noreferrer" className="venture-link">
              Visit website ↗
            </a>
          ) : (
            <Link to="/contact" className="venture-link">
              Enquire with us →
            </Link>
          )}
        </div>
      </article>
    ))}
  </div>
);

export default VentureGrid;
