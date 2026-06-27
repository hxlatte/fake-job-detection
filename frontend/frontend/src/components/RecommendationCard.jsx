import React from "react";

export function RecommendationCard({ text }) {
  return (
    <div className="rec-node-card">
      <svg className="rec-node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8v4M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="rec-node-content">
        <h5>Recommended Safety Action</h5>
        <p className="text-dim">{text}</p>
      </div>
    </div>
  );
}
