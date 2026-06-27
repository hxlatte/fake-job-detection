import React from "react";

export function About() {
  const futureMilestones = [
    {
      phase: "Phase 1: ML Model Integration",
      desc: "Connect the frontend forms with a Python-based FastAPI backend hosting pre-trained Random Forest and DistilBERT classifiers to output actual probability scores.",
      active: true
    },
    {
      phase: "Phase 2: Automated Crawler Pipelines",
      desc: "Implement microservices to index public jobs boards and run heuristic checks automatically before users query them.",
      active: true
    },
    {
      phase: "Phase 3: Browser Extension Modules",
      desc: "Develop Chrome and Firefox security extensions to assess listings directly on LinkedIn, Indeed, and ZipRecruiter with inline warning tags.",
      active: false
    }
  ];

  return (
    <div className="section-container about-section page-fade-in">
      <div className="section-header">
        <h2 className="section-title">System Architecture Overview</h2>
        <p className="section-subtitle">Learn about our threat verification prototype, tech stack, and development milestones.</p>
      </div>

      <div className="about-grid">
        {/* Card 1: Overview */}
        <div className="glass-card about-card">
          <h3>Project Integrity</h3>
          <p>
            The Fake Job Posting Detector is designed to empower career seekers against modern digital employment scams. Fraudulent job postings are rising rapidly on public boards, misleading applicants to obtain personal data, bank details, or setup fees under false pretenses.
          </p>
          <p className="mt-2">
            Our system parses metadata ranges (logo files, salaries, sectors, and locations) and runs linguistic scans on job details bodies, compiling findings into a unified threat dashboard.
          </p>
        </div>

        {/* Card 2: Mechanics */}
        <div className="glass-card about-card">
          <h3>How It Works</h3>
          <ul className="styled-list">
            <li><strong>Form Parsing:</strong> Divides input parameters across sections for clear data organization.</li>
            <li><strong>Heuristic Calculations:</strong> Assigns warning weights to variables such as personal contact domains or missing details.</li>
            <li><strong>Regex Text Scan:</strong> Highlights match indexes for scam-prone phrases in description logs.</li>
            <li><strong>Local Log Ledger:</strong> Persists analysis records in browser database nodes without remote data leaks.</li>
          </ul>
        </div>

      </div>

    </div>
  );
}
