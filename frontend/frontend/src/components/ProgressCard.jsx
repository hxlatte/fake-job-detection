import React, { useState, useEffect } from "react";

export function ProgressCard({ label, value }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(0);
    const timer = setTimeout(() => {
      setWidth(value);
    }, 150);
    return () => clearTimeout(timer);
  }, [value]);

  const getColorClass = () => {
    if (value < 40) return "fill-red";
    if (value < 75) return "fill-yellow";
    return "fill-green";
  };

  return (
    <div className="breakdown-group">
      <div className="breakdown-header">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="progress-bar-container thin">
        <div className={`progress-fill ${getColorClass()}`} style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
}
