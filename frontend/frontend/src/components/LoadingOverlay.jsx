import React, { useState, useEffect } from "react";

const LOADER_STATUSES = [
  "Locating domain registry records...",
  "Checking recruiter SSL protocols...",
  "Correlating compensation benchmarks...",
  "Executing semantic text analysis...",
  "Compiling final heuristic report..."
];

export function LoadingOverlay({ active }) {
  if (!active) return null;

  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIndex(prev => (prev < LOADER_STATUSES.length - 1 ? prev + 1 : prev));
    }, 400);

    return () => clearInterval(timer);
  }, []);

  return (
    <div id="loading-overlay" className="loading-overlay">
      <div className="loader-content">
        <div className="scanner-box">
          <div className="scanner-line"></div>
          <svg className="loader-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Analyzing Job Posting</h3>
        <p className="loader-status">{LOADER_STATUSES[statusIndex]}</p>
        <div className="loader-progress-bar">
          <div className="loader-progress-fill"></div>
        </div>
      </div>
    </div>
  );
}
