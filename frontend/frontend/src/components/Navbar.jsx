import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export function Navbar({ theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={handleLinkClick}>
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="logo-text">Fake Job <span className="accent-text">Detector</span></span>
        </Link>

        {/* Desktop Navigation links */}
        <nav className="nav-menu">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} end>Home</NavLink>
          <NavLink to="/analyze" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Analyze</NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>History</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>About</NavLink>
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          <button id="theme-toggle" className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === "light" ? (
              <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="5" strokeWidth="2"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          
          <Link to="/analyze" className="btn btn-primary nav-cta">Verify Now</Link>
          
          {/* Mobile Hamburger menu toggle */}
          <button
            className={`mobile-menu-btn ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>

      {/* Mobile drop menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`} onClick={handleLinkClick} end>Home</NavLink>
          <NavLink to="/analyze" className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`} onClick={handleLinkClick}>Analyze</NavLink>
          <NavLink to="/history" className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`} onClick={handleLinkClick}>History</NavLink>
          <NavLink to="/about" className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`} onClick={handleLinkClick}>About</NavLink>
          <Link to="/analyze" className="btn btn-primary mobile-cta" onClick={handleLinkClick}>Verify Now</Link>
        </div>
      )}
    </header>
  );
}
