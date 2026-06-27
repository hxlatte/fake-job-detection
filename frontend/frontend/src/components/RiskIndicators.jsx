import React from "react";

export function RiskIndicators({ reasons, formData }) {
  // If we have API reasons, use them, otherwise calculate missing features as risk indicators
  const indicators = [...(reasons || [])];

  if (!reasons || reasons.length === 0) {
    if (!formData.companyProfile) {
      indicators.push({ type: "missing", title: "Missing Company Profile", desc: "No company background provided. Legitimate jobs usually have detailed profiles." });
    }

    if (!formData.requirements) {
      indicators.push({ type: "missing", title: "Requirements Incomplete", desc: "Candidate criteria is missing or too vague." });
    }
    if (!formData.hasLogo) {
      indicators.push({ type: "missing", title: "No Company Logo", desc: "Visual verification of brand identity is absent." });
    }
    if (!formData.education) {
      indicators.push({ type: "missing", title: "Missing Education", desc: "No academic benchmarks specified." });
    }
    if (!formData.benefits) {
      indicators.push({ type: "missing", title: "Incomplete Benefits", desc: "Onboarding perks or standard benefits omitted." });
    }
  }

  return (
    <div className="glass-card dashboard-card checklist-card col-span-2">
      <div className="card-title-badge-bar mb-2">
        <h4>Risk Indicators</h4>
        <span className={`badge-accent ${indicators.length === 0 ? "safe" : ""}`}>
          {indicators.length} {indicators.length === 1 ? 'Indicator' : 'Indicators'}
        </span>
      </div>
      <p className="text-dim mb-4">Warning points captured during Machine Learning analysis:</p>
      
      <div className="checklist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {indicators.length > 0 ? (
          indicators.map((indicator, idx) => (
            <div key={idx} className="flag-node-card flagged" style={{ display: 'flex', gap: '12px', padding: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
              <svg className="node-status-icon text-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '24px', height: '24px', flexShrink: 0 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="2"/>
                <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2"></line>
                <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2"></line>
              </svg>
              <div className="flag-node-content">
                <h5 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#f87171' }}>{indicator.title || indicator}</h5>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>{indicator.desc || "Potential ML indicator pattern matched."}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center mt-2" style={{ padding: '2rem', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '8px' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>✅</span>
            <p className="text-dim" style={{ color: '#4ade80' }}>No major fraud indicators detected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
