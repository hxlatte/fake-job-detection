import React, { useState, useEffect } from "react";

export function AITrustScoreCard({ score, prediction, confidence, riskLevel }) {
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

  // Color coding based on score
  const isHighRisk = score > 60;
  const isMediumRisk = score > 30 && score <= 60;
  const threatColor = isHighRisk ? "stroke-red text-red" : isMediumRisk ? "stroke-yellow text-yellow" : "stroke-green text-green";

  return (
    <div className="glass-card dashboard-card trust-gauge-card col-span-2 text-center" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Risk Score</h2>
      
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        {/* Trust Score Circular Gauge */}
        <div className="trust-circular-container" style={{ width: '160px', height: '160px', margin: 0 }}>
          <div className="trust-circle-svg-wrapper" style={{ width: '100%', height: '100%' }}>
            <svg className="circular-chart" viewBox="0 0 36 36">
              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path
                className={`circle-fill ${threatColor.split(' ')[0]}`}
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

        {/* Prediction Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left', minWidth: '200px' }}>
          <div>
            <div className="text-dim text-sm" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Prediction</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isHighRisk ? "❌ Fraudulent Job" : isMediumRisk ? "⚠️ Suspicious Job" : "✅ Genuine Job"}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '3rem' }}>
            <div>
              <div className="text-dim text-sm" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Confidence</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '500', color: '#fff' }}>{confidence}%</div>
            </div>
            <div>
              <div className="text-dim text-sm" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Risk Level</div>
              <div className={threatColor.split(' ')[1]} style={{ fontSize: '1.25rem', fontWeight: '600' }}>{riskLevel}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
