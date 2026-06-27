import React, { useState, useEffect } from "react";

export function TrustScoreCard({ score, threatColor, riskBadgeText, riskClass }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    setDisplayScore(0);
    if (score === 0) return;

    let start = 0;
    const duration = 1200; // ms
    const increment = Math.ceil(score / (duration / 20));
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(start);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="glass-card dashboard-card trust-gauge-card text-center">
      <h4>Overall Risk Score</h4>
      <div className="trust-circular-container">
        <div className="trust-circle-svg-wrapper" style={{ width: '100%', height: '100%' }}>
          <svg className="circular-chart" viewBox="0 0 36 36">
            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path
              className={`circle-fill ${threatColor}`}
              strokeDasharray={`${displayScore}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="trust-score-labels">
            <span className="trust-number">{displayScore}</span>
            <span className="trust-max">/100</span>
          </div>
        </div>
      </div>
      <div className="badge-status-container">
        <span className={`risk-badge ${riskClass}`}>{riskBadgeText}</span>
      </div>
      <p className="trust-text-explanation">
        {score > 60
          ? "Heavy vulnerabilities and threat indicators detected. High probability of scam."
          : score > 30
          ? "Moderate anomalies detected. Identity verification suggested before application."
          : "Credentials match secure industry indicators. Safe job profile verified."}
      </p>
    </div>
  );
}
