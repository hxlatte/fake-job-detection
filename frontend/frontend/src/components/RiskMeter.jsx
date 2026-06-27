import React, { useState, useEffect } from "react";

export function RiskMeter({ score }) {
  const [pointerLeft, setPointerLeft] = useState(0);

  const threatVal = score;

  useEffect(() => {
    setPointerLeft(0);
    const timer = setTimeout(() => {
      setPointerLeft(threatVal);
    }, 150);
    return () => clearTimeout(timer);
  }, [threatVal]);

  const getLabelClass = () => {
    if (score > 60) return "threat-label text-red";
    if (score > 30) return "threat-label text-red"; // warning color yellow/red
    return "threat-label text-green";
  };

  const getLabelText = () => {
    if (score > 60) return "Danger / High Risk";
    if (score > 30) return "Caution Required";
    return "Low Threat / Secure";
  };

  return (
    <div className="glass-card dashboard-card risk-meter-card col-span-2">
      <div className="risk-meter-header">
        <h4>Credibility Threat Scale</h4>
        <span className={getLabelClass()}>{getLabelText()} — {threatVal}%</span>
      </div>
      <div className="risk-meter-track">
        <div className="risk-meter-indicator" style={{ left: `${pointerLeft}%` }}></div>
        <div className="track-segment safe-segment">Safe</div>
        <div className="track-segment moderate-segment">Caution</div>
        <div className="track-segment risk-segment">Danger</div>
      </div>
    </div>
  );
}
