import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2"/>
              <path d="M9 11l2 2 4-4" strokeWidth="2"/>
            </svg>
            <span>Fake Job <span className="accent-text">Detector</span></span>
          </Link>
          <p>An educational prototype demonstrating high-fidelity React UI design architectures for threat scanning tools.</p>
        </div>

        <div className="footer-links-group">
          <div className="footer-col">
            <h5>Navigation</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/analyze">Analyze Job</Link></li>
              <li><Link to="/history">Scan History</Link></li>
              <li><Link to="/about">About Project</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Core Parameters</h5>
            <ul>
              <li><Link to="/">AI Job Analysis</Link></li>
              <li><Link to="/">Email Verifier</Link></li>
              <li><Link to="/">Salary Benchmarks</Link></li>
              <li><Link to="/">Keyword Scanners</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Fake Job Detector. Protected under educational licensing. Built with React &amp; Vite.</p>
      </div>
    </footer>
  );
}
