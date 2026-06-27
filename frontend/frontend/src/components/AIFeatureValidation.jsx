import React from "react";

export function AIFeatureValidation({ formData }) {
  const evaluateField = (val, successLabel, failLabel) => {
    return val && val.trim() !== "" ? { text: successLabel, valid: true } : { text: failLabel, valid: false };
  };

  const validationItems = [
    { label: "Company Profile", ...evaluateField(formData.companyProfile, "Complete", "Incomplete") },
    { label: "Job Description", ...evaluateField(formData.description, "Detailed", "Basic") },
    { label: "Requirements", ...evaluateField(formData.requirements, "Provided", "Not Provided") },
    { label: "Education", ...evaluateField(formData.education, "Specified", "Not Provided") },
    { label: "Industry", ...evaluateField(formData.industry, "Specified", "Not Provided") },
    { label: "Function", ...evaluateField(formData.functionCode, "Specified", "Not Provided") },
    { label: "Employment Type", ...evaluateField(formData.employmentType, "Specified", "Not Provided") },
  ];

  return (
    <div className="glass-card dashboard-card breakdown-card">
      <div className="card-title-badge-bar mb-3">
        <h4>AI Feature Validation</h4>
      </div>
      <div className="breakdown-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {validationItems.map((item, idx) => (
          <div key={idx} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '12px 16px', 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <span style={{ color: '#e2e8f0' }}>{item.label}</span>
            <span style={{ 
              color: item.valid ? '#4ade80' : '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {item.valid ? '✔' : '⚠'} {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
