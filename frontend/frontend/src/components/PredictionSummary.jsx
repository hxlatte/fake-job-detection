import React from "react";

export function PredictionSummary({ score }) {
  const isHighRisk = score > 60;
  const isMediumRisk = score > 30 && score <= 60;

  let summaryText = "";
  if (isHighRisk) {
    summaryText = "This job posting appears to be fraudulent based on the information provided. The machine learning model found significant fraud indicators and the submitted job information has missing or suspicious patterns.";
  } else if (isMediumRisk) {
    summaryText = "This job posting appears to be suspicious based on the information provided. The machine learning model found some potential fraud indicators and the submitted job information may be incomplete or inconsistent.";
  } else {
    summaryText = "This job posting appears to be legitimate based on the information provided. The machine learning model found no significant fraud indicators and the submitted job information is complete and consistent.";
  }

  return (
    <div className="glass-card dashboard-card summary-report-card col-span-2">
      <div className="card-title-badge-bar">
        <h4>📄 Prediction Summary</h4>
      </div>
      <div className="summary-box mt-3" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', borderLeft: isHighRisk ? '4px solid #ef4444' : isMediumRisk ? '4px solid #eab308' : '4px solid #22c55e' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>{summaryText}</p>
      </div>
    </div>
  );
}
