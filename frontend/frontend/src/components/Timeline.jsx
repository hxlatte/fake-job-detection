import React, { useState, useEffect } from "react";

export function Timeline({ score }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Job Submitted",
      desc: "Record parsed and ingested into system.",
      time: "T+0.00s"
    },
    {
      title: "Data Preprocessing",
      desc: "Cleaning text, handling missing values, encoding features.",
      time: "T+0.12s"
    },
    {
      title: "Feature Engineering",
      desc: "Preparing dataset and vectorizing descriptions for model input.",
      time: "T+0.28s"
    },
    {
      title: "Machine Learning Prediction",
      desc: "Running trained classification model on engineered features.",
      time: "T+0.35s"
    },
    {
      title: "Results Generated",
      desc: "Confidence score, Risk score, and final prediction calculated.",
      time: "T+0.42s"
    }
  ];

  useEffect(() => {
    setActiveStep(0);
    const intervals = [200, 500, 800, 1100, 1400];
    
    intervals.forEach((time, idx) => {
      setTimeout(() => {
        setActiveStep(prev => Math.max(prev, idx + 1));
      }, time);
    });
  }, [score]);

  return (
    <div className="timeline-track">
      {steps.map((step, idx) => (
        <div key={idx} className={`timeline-node ${activeStep > idx ? "active" : ""}`}>
          <div className="timeline-content">
            <div>
              <h5>{activeStep > idx ? "✓ " : ""}{step.title}</h5>
              <p className="text-dim">{step.desc}</p>
            </div>
            <span className="timeline-time">{activeStep > idx ? step.time : "..."}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
