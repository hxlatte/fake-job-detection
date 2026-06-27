import React from "react";
import { Hero } from "../components/Hero";
import { FeatureCard } from "../components/FeatureCard";
import { StatisticCard } from "../components/StatisticCard";

export function Home() {
  const features = [
    {
      title: "📄 Job Details",
      desc: "Reviews the overall completeness and consistency of the submitted job posting.",
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      title: "🏢 Company Information",
      desc: "Evaluates the provided company profile and organizational information.",
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="7" r="4" strokeWidth="2"/>
        </svg>
      )
    },
    {
      title: "📝 Job Description",
      desc: "Assesses the clarity and quality of the job description.",
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="23" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      title: "🎓 Qualifications",
      desc: "Reviews education, experience, and skill requirements.",
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="2"/>
          <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2"/>
          <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2"/>
        </svg>
      )
    },
    {
      title: "💼 Employment Details",
      desc: "Evaluates salary, employment type, location, and benefits.",
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2"/>
          <path d="M22 6l-10 7L2 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "📊 Overall Assessment",
      desc: "Presents the final prediction, confidence score, risk score, and recommendations.",
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round"/>
          <polyline points="14 2 14 8 20 8" strokeWidth="2"/>
          <line x1="16" y1="13" x2="8" y2="13" strokeWidth="2"/>
          <line x1="16" y1="17" x2="8" y2="17" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  return (
    <div className="page-fade-in">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Features Grid */}
      <section className="section-container features-section">
        <div className="section-header">
          <h2 className="section-title">AI Evaluation Categories</h2>
          <p className="section-subtitle">How our multi-layered parser evaluates job postings.</p>
        </div>

        <div className="features-grid">
          {features.map((feat, idx) => (
            <FeatureCard
              key={idx}
              title={feat.title}
              desc={feat.desc}
              icon={feat.icon}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
