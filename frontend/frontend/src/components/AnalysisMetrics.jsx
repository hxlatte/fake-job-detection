import React from "react";

export function AnalysisMetrics({ predictionTime, featuresCount, modelStatus, date }) {
  return (
    <div className="glass-card dashboard-card analysis-metrics-card col-span-2">
      <div className="card-title-badge-bar">
        <h4>Analysis Metrics</h4>
      </div>
      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem' }}>
        <div className="metric-box" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <div className="text-dim text-sm">Prediction Time</div>
          <div className="metric-value font-code" style={{ fontSize: '1.2rem', marginTop: '0.5rem', color: '#fff' }}>{predictionTime} sec</div>
        </div>
        <div className="metric-box" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <div className="text-dim text-sm">Features Evaluated</div>
          <div className="metric-value font-code" style={{ fontSize: '1.2rem', marginTop: '0.5rem', color: '#fff' }}>{featuresCount}</div>
        </div>
        <div className="metric-box" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <div className="text-dim text-sm">Model Status</div>
          <div className="metric-value font-code" style={{ fontSize: '1.2rem', marginTop: '0.5rem', color: '#4ade80' }}>{modelStatus}</div>
        </div>
        <div className="metric-box" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <div className="text-dim text-sm">Analysis Date</div>
          <div className="metric-value font-code" style={{ fontSize: '1.2rem', marginTop: '0.5rem', color: '#fff' }}>{date}</div>
        </div>
      </div>
    </div>
  );
}
