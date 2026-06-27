import React from "react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="section-container hero-section page-fade-in">
      <div className="hero-content">
        <div className="badge-container">
          <span className="pulse-dot"></span>
          <span className="badge-text">Secure Hiring System</span>
        </div>
        <h1 className="hero-title">
          AI-Powered <span className="gradient-text">Fake Job</span> Posting Detector
        </h1>
        <p className="hero-subtitle">
          Evaluate the credibility of employment offers instantly. Our multi-heuristic scanning engine flags fraudulent companies, suspicious recruitment profiles, and unrealistic salary benchmarks.
        </p>
        <div className="hero-actions">
          <Link to="/analyze" className="btn btn-primary btn-lg btn-ripple">Analyze a Job</Link>
          <Link to="/about" className="btn btn-secondary btn-lg btn-ripple">Learn More</Link>
        </div>
      </div>

      {/* Abstract scanning visual */}
      <div className="hero-visual">
        <div className="visual-glass-card">
          <div className="visual-header">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <div className="visual-title">Scam Heuristics Scanner v2.0</div>
          </div>
          <div className="visual-body">
            <div className="visual-radar">
              <div className="radar-sweep"></div>
              <div className="radar-circle rc1"></div>
              <div className="radar-circle rc2"></div>
              <div className="radar-circle rc3"></div>
              <div className="radar-blip blip-1"></div>
              <div className="radar-blip blip-2"></div>
              <div className="radar-blip blip-3"></div>
              <svg className="radar-center-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="visual-data-feed">
              <div className="feed-line">Checking domain credibility... <span className="feed-ok">SECURE</span></div>
              <div className="feed-line">Checking salary benchmarks... <span className="feed-warn">WARNING</span></div>
              <div className="feed-line">Scanning recruiter signature... <span className="feed-fail">SUSPICIOUS</span></div>
              <div className="feed-line">Parsing job requirements... <span className="feed-info">DONE</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
