import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="container header-container">
        <NavLink to="/" onClick={closeMenu} className="logo">
          <span className="logo-mark">4</span>
          <span className="logo-text">Web<span className="logo-accent">4</span>rtTech</span>
        </NavLink>

        <nav className={`nav ${menuOpen ? 'active' : ''}`} aria-label="Primary Navigation">
          <NavLink to="/" onClick={closeMenu} end className={({ isActive }) => (isActive ? 'active-link' : '')}>Home</NavLink>
          <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active-link' : '')}>About</NavLink>
          <NavLink to="/services" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active-link' : '')}>Services</NavLink>
          <NavLink to="/careers" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active-link' : '')}>Careers</NavLink>
          <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active-link' : '')}>Contact</NavLink>
          <NavLink to="/contact" onClick={closeMenu} className="nav-cta nav-cta-mobile">Get a Quote</NavLink>
        </nav>

        <div className="header-actions">
          <NavLink to="/contact" className="nav-cta">Get a Quote</NavLink>
        </div>

        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {menuOpen && <div className="nav-backdrop" onClick={closeMenu} />}
    </header>
  );
};

export default Header;
