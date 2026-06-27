import React, { useState, useEffect } from "react";

export function StatisticCard({ label, value, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    if (!value) return;

    let start = 0;
    const isDecimal = value.toString().includes(".");
    const target = parseFloat(value);
    const step = isDecimal ? target / 60 : Math.ceil(target / 60);

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? parseFloat(start.toFixed(1)) : Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="stat-card">
      <div className="stat-number">
        {count}
        {suffix}
      </div>
      <div className="stat-label text-dim">{label}</div>
    </div>
  );
}
