import React, { useState, useEffect } from "react";

export function DataCompleteness({ formData }) {
  const [percent, setPercent] = useState(0);
  
  // Array of 16 features evaluated for completeness
  const features = [
    { label: "Company Profile", key: "companyProfile" },
    { label: "Job Description", key: "description" },
    { label: "Requirements", key: "requirements" },
    { label: "Benefits", key: "benefits" },
    { label: "Education", key: "education" },
    { label: "Industry", key: "industry" },
    { label: "Function", key: "functionCode" },
    { label: "Employment Type", key: "employmentType" },
    { label: "Experience", key: "experience" },
    { label: "Location", key: "location" },
    { label: "Job Title", key: "title" },
    { label: "Telecommuting", key: "telecommuting", isBoolean: true },
    { label: "Has Logo", key: "hasLogo", isBoolean: true }
  ];

  let completedCount = 0;
  features.forEach(f => {
    if (f.isBoolean) {
      if (formData[f.key] !== undefined && formData[f.key] !== null) completedCount++;
    } else {
      if (formData[f.key] && formData[f.key].trim() !== "") completedCount++;
    }
  });

  const targetPercent = Math.round((completedCount / features.length) * 100);

  useEffect(() => {
    setPercent(0);
    if (targetPercent === 0) return;
    const timer = setInterval(() => {
      setPercent(prev => {
        if (prev >= targetPercent) {
          clearInterval(timer);
          return targetPercent;
        }
        return prev + 1;
      });
    }, 15);
    return () => clearInterval(timer);
  }, [targetPercent]);

  return (
    <div className="glass-card dashboard-card completeness-card">
      <h4>Data Completeness</h4>
      <div className="completeness-circle-progress" style={{ margin: '1.5rem 0' }}>
        <div className="completeness-percentage" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{percent}%</div>
        <div className="text-dim text-sm text-center mb-2">{completedCount} of {features.length} fields completed</div>
        <div className="progress-bar-container" style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            className={`progress-fill ${
              percent < 40 ? "fill-red" : percent < 75 ? "fill-yellow" : "fill-green"
            }`}
            style={{ width: `${percent}%`, transition: 'width 1s ease', height: '100%' }}
          ></div>
        </div>
      </div>
      <ul className="completeness-list" style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '10px' }}>
        {features.map((f, idx) => {
          const isComplete = f.isBoolean 
            ? (formData[f.key] !== undefined && formData[f.key] !== null)
            : (formData[f.key] && formData[f.key].trim() !== "");
          return (
            <li key={idx} className={`complete-item ${isComplete ? "active" : ""}`} style={{ padding: '0.4rem 0', display: 'flex', alignItems: 'center' }}>
              <span className={`comp-status ${isComplete ? "status-check text-green" : "status-x text-yellow"}`} style={{ marginRight: '10px', fontSize: '1.2rem' }}>
                {isComplete ? "✔" : "⚠"}
              </span>
              {f.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
