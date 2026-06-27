import React from "react";

export function ReasonCard({ reason }) {
  const { title, desc, flagged } = reason;

  return (
    <div className={`flag-node-card ${flagged ? "flagged" : "passed"}`}>
      {flagged ? (
        <svg className="node-status-icon text-red" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="2" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg className="node-status-icon text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      <div className="flag-node-content">
        <h5>{title}</h5>
        <p>{desc}</p>
      </div>
    </div>
  );
}
