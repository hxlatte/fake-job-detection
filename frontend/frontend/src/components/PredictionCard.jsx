import React, { useEffect, useState } from "react";

export function PredictionCard({ score, verdict, confidence }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(0);
    const timer = setTimeout(() => {
      setWidth(confidence);
    }, 100);
    return () => clearTimeout(timer);
  }, [confidence]);

  const isFake = score > 60;
  const isCaution = score > 30 && score <= 60;

  const getIcon = () => {
    if (isFake) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="2"/>
          <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2"/>
          <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2"/>
        </svg>
      );
    }
    if (isCaution) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 9v2m0 4h.01" strokeWidth="2" strokeLinecap="round"/>
          <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10z" strokeWidth="2"/>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2"/>
        <path d="M9 11l2 2 4-4" strokeWidth="2"/>
      </svg>
    );
  };

  const getFillClass = () => {
    if (isFake) return "fill-red";
    if (isCaution) return "fill-yellow";
    return "fill-green";
  };

  const getIconClass = () => {
    if (isFake || isCaution) return "text-red";
    return "text-green";
  };

  return (
    <div className="glass-card dashboard-card prediction-card">
      <div className="card-title-icon-bar">
        <h4>Verdict Analysis</h4>
        <div className={`verdict-icon ${getIconClass()}`}>
          {getIcon()}
        </div>
      </div>
      <div className="prediction-value">{verdict}</div>
      
      <div className="confidence-container">
        <span className="confidence-label">System Confidence</span>
        <span className="confidence-percent">{confidence}%</span>
      </div>
      <div className="progress-bar-container mini">
        <div className={`progress-fill ${getFillClass()}`} style={{ width: `${width}%` }}></div>
      </div>

      <hr className="card-divider" />

      <div className="confidence-viz-block">
        <div className="viz-row">
          <span>Prob. Fake Job</span>
          <span className="font-code font-bold text-red">{score}%</span>
        </div>
        <div className="progress-bar-container thin">
          <div className="progress-fill fill-red" style={{ width: `${width ? score : 0}%`, transition: 'width 1s ease' }}></div>
        </div>
        <div className="viz-row mt-2">
          <span>Prob. Real Job</span>
          <span className="font-code font-bold text-green">{100 - score}%</span>
        </div>
        <div className="progress-bar-container thin">
          <div className="progress-fill fill-green" style={{ width: `${width ? 100 - score : 0}%`, transition: 'width 1s ease' }}></div>
        </div>
      </div>
    </div>
  );
}
