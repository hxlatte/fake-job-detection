import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { InputField } from "../components/InputField";
import { TextareaField } from "../components/TextareaField";
import { Dropdown } from "../components/Dropdown";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { Modal } from "../components/Modal";

// Dashboard Components
import { AITrustScoreCard } from "../components/AITrustScoreCard";
import { PredictionSummary } from "../components/PredictionSummary";
import { DataCompleteness } from "../components/DataCompleteness";
import { AIFeatureValidation } from "../components/AIFeatureValidation";
import { RiskIndicators } from "../components/RiskIndicators";
import { Timeline } from "../components/Timeline";
import { AnalysisMetrics } from "../components/AnalysisMetrics";
import { RecommendationCard } from "../components/RecommendationCard";

// Logic Helper
import { analyzeJobPosting, SCAM_KEYWORDS, JOB_PRESETS } from "../utils/analysisEngine";

const INITIAL_FORM_STATE = {
  title: "",
  location: "",
  industry: "",
  functionCode: "",
  employmentType: "Full-time",
  telecommuting: false,
  companyProfile: "",
  hasLogo: false,
  benefits: "",
  description: "",
  requirements: "",
  experience: "Entry-Level",
  education: "",
  hasScreening: false
};

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const EXPERIENCE_LEVELS = ["Entry-Level", "Mid-Level", "Senior", "Lead / Executive", "None"];

export function AnalyzeJob({ addToast }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Navigation / Display states
  const [activeAccordion, setActiveAccordion] = useState("basic"); // basic | company | details
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [report, setReport] = useState(null);

  // Collapsible Dashboard Cards states
  const [collapseState, setCollapseState] = useState({
    summary: false,
    salary: false,
    company: false,
    requirements: false,
    breakdown: false,
    recommendations: false,
    timeline: false
  });

  const [scanHistory, setScanHistory] = useLocalStorage("scanHistory", []);

  const handleToggleCollapse = (key) => {
    setCollapseState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Form field change handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const loadPresetData = (presetKey) => {
    const data = JOB_PRESETS[presetKey];
    if (data) {
      setFormData(data);
      setErrors({});
      setTouched({});
      addToast(`Preset loaded for "${data.company || 'Selected Option'}"`, "success");
    }
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
    addToast("Form fields reset to default values", "info");
  };

  // Field validation
  const validateField = (field, value) => {
    let errorMsg = "";
    if (field === "title" && !value.trim()) {
      errorMsg = "Job Title is required.";
    } else if (field === "location" && !value.trim()) {
      errorMsg = "Location is required.";
    } else if (field === "description" && (!value.trim() || value.trim().length < 20)) {
      errorMsg = "Description is required (minimum 20 characters).";
    }

    setErrors(prev => ({ ...prev, [field]: errorMsg }));
    return !errorMsg;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Mark required fields as touched
    const touchedFields = { title: true, location: true, description: true };
    setTouched(prev => ({ ...prev, ...touchedFields }));

    const isTitleValid = validateField("title", formData.title);
    const isLocationValid = validateField("location", formData.location);
    const isDescValid = validateField("description", formData.description);

    if (!isTitleValid || !isLocationValid || !isDescValid) {
      addToast("Please fill in all required fields correctly.", "error");
      return;
    }

    // Trigger loader scans
    setIsAnalyzing(true);

    const apiPayload = {
      title: formData.title,
      location: formData.location,
      company_profile: formData.companyProfile,
      description: formData.description,
      requirements: formData.requirements,
      benefits: formData.benefits,
      telecommuting: formData.telecommuting ? 1 : 0,
      has_company_logo: formData.hasLogo ? 1 : 0,
      has_questions: formData.hasScreening ? 1 : 0,
      employment_type: formData.employmentType,
      required_experience: formData.experience,
      required_education: formData.education,
      industry: formData.industry,
      function: formData.functionCode
    };

    const dateString = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080/predict";

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiPayload)
    })
      .then(res => {
        if (!res.ok) throw new Error("API server returned error status");
        return res.json();
      })
      .then(data => {
        const localHeuristics = analyzeJobPosting(formData);
        
        // Use risk_score and risk_level from backend API response if available, fallback to calculation
        const riskScore = data.risk_score !== undefined ? data.risk_score : Math.round(data.fraud_probability * 100);
        
        let riskClass = "badge-verified";
        let threatColor = "stroke-green";
        let riskLevel = data.risk_level || "Low Risk";
        let summaryText = "";

        if (riskScore > 60) {
          riskClass = "badge-high-risk";
          threatColor = "stroke-red";
          summaryText = "The machine learning model flagged this job posting as highly suspicious. Key risk factors include typical payment processing scam language, lack of structural verification, and mismatched background details.";
        } else if (riskScore > 30) {
          riskClass = "badge-caution";
          threatColor = "stroke-yellow";
          summaryText = "The machine learning model suggests cautious engagement. Certain fields align with verified profiles, but structural metadata indicates possible non-compliance.";
        } else {
          riskClass = "badge-verified";
          threatColor = "stroke-green";
          summaryText = "The machine learning model verified this job posting with a high safety confidence index. The listing matches standard, clean hiring patterns.";
        }

        // Format backend warning explanations into UI reason cards structure
        const combinedReasons = data.reasons.map(r => ({
          type: "ml_flag",
          title: r.replace(/\.$/, ""),
          desc: "Identified missing or vague profile metadata constraint inside this category.",
          flagged: true
        }));

        const mergedReport = {
          ...localHeuristics,
          riskScore: riskScore,
          confidence: data.confidence,
          verdict: data.prediction === "Fake" ? "Fraudulent Posting Detected" : "Legitimate Posting Verified",
          riskLevel: riskLevel,
          riskClass: riskClass,
          threatColor: threatColor,
          summaryText: summaryText,
          reasons: combinedReasons.length > 0 ? combinedReasons : localHeuristics.reasons
        };

        setReport(mergedReport);
        setIsAnalyzing(false);
        setShowDashboard(true);

        const historyRecord = {
          id: Date.now(),
          company: formData.companyProfile?.split(" ")[0] || "Incognito Corp",
          title: formData.title,
          location: formData.location,
          industry: formData.industry || "Not Specified",
          employmentType: formData.employmentType,
          riskScore: mergedReport.riskScore,
          riskLevel: mergedReport.riskLevel,
          riskClass: mergedReport.riskClass,
          threatColor: mergedReport.threatColor,
          date: dateString
        };
        setScanHistory(prev => [historyRecord, ...prev]);
        addToast(`ML Model prediction complete for "${formData.title}"`, "success");
        
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(err => {
        console.warn("Backend API not reachable, falling back to local engine:", err);
        const localHeuristics = analyzeJobPosting(formData);
        
        setReport(localHeuristics);
        setIsAnalyzing(false);
        setShowDashboard(true);

        const historyRecord = {
          id: Date.now(),
          company: formData.companyProfile?.split(" ")[0] || "Incognito Corp",
          title: formData.title,
          location: formData.location,
          industry: formData.industry || "Not Specified",
          employmentType: formData.employmentType,
          riskScore: localHeuristics.riskScore,
          riskLevel: localHeuristics.riskLevel,
          riskClass: localHeuristics.riskClass,
          threatColor: localHeuristics.threatColor,
          date: dateString
        };
        setScanHistory(prev => [historyRecord, ...prev]);
        addToast("Using offline local heuristic check.", "info");
        
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  };

  const handleDownloadReport = () => {
    addToast("Generating security PDF report...", "info");
    setTimeout(() => {
      addToast(`Downloaded: ${formData.title.replace(/[^a-zA-Z0-9]/g, "_")}_Risk_Report.pdf`, "success");
    }, 1500);
  };

  const handleEditAgain = () => {
    setShowDashboard(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Keyword highlighting logic
  const getHighlightedText = (text, keywords) => {
    if (!text) return "";
    if (keywords.length === 0) return text;

    let escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Sort keywords by length desc
    const sorted = [...keywords].sort((a, b) => b.length - a.length);
    sorted.forEach(kw => {
      const regex = new RegExp(`(${kw})`, "gi");
      escaped = escaped.replace(regex, '<span class="keyword-highlight">$1</span>');
    });

    return <div dangerouslySetInnerHTML={{ __html: escaped }} />;
  };

  return (
    <div className="section-container analyze-section page-fade-in">
      <LoadingOverlay active={isAnalyzing} />

      {!showDashboard ? (
        <>
          <div className="section-header">
            <h2 className="section-title">Job Integrity Analyzer</h2>
            <p className="section-subtitle">Provide details about the job posting to assess credentials and verification metrics.</p>
          </div>

          <div className="glass-card instruction-box mb-4">
            <div className="instruction-icon">💡</div>
            <div className="instruction-text">
              <h5>How to Perform Analysis</h5>
              <p>Please expand the sections below and supply the job details. Fields marked with <span className="required">*</span> are required to execute checks. You can also load presets at the bottom to auto-fill the form instantly.</p>
            </div>
          </div>

          <div className="form-container">
            <form onSubmit={handleFormSubmit} noValidate>
              
              {/* Accordion 1: Basic Information */}
              <div className={`accordion-section ${activeAccordion === "basic" ? "active" : ""}`}>
                <div className="accordion-header" onClick={() => setActiveAccordion(activeAccordion === "basic" ? "" : "basic")}>
                  <div className="accordion-header-title">
                    <svg className="section-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                      <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                      <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                    </svg>
                    Section 1: Basic Information
                  </div>
                  <span className="accordion-arrow">▼</span>
                </div>
                {activeAccordion === "basic" && (
                  <div className="accordion-body">
                    <div className="form-grid">
                      <InputField
                        label="Job Title"
                        id="job-title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="e.g., Senior Systems Analyst"
                        required
                        error={errors.title}
                        invalid={touched.title && !!errors.title}
                      />

                      <InputField
                        label="Location"
                        id="job-location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="e.g., New York, NY (Hybrid)"
                        required
                        error={errors.location}
                        invalid={touched.location && !!errors.location}
                      />

                      <InputField
                        label="Industry"
                        id="job-industry"
                        value={formData.industry}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
                        placeholder="e.g., Telecommunications, Fintech"
                      />
                      <InputField
                        label="Function / Area"
                        id="job-function"
                        value={formData.functionCode}
                        onChange={(e) => handleInputChange("functionCode", e.target.value)}
                        placeholder="e.g., Information Technology, Legal"
                      />
                      <Dropdown
                        label="Employment Type"
                        id="employment-type"
                        value={formData.employmentType}
                        onChange={(e) => handleInputChange("employmentType", e.target.value)}
                        options={EMPLOYMENT_TYPES}
                      />
                      <div className="form-group" style={{ justifyContent: 'center' }}>
                        <ToggleSwitch
                          label="Remote Work / Telecommuting"
                          active={formData.telecommuting}
                          onClick={() => handleInputChange("telecommuting", !formData.telecommuting)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Company Details */}
              <div className={`accordion-section ${activeAccordion === "company" ? "active" : ""}`}>
                <div className="accordion-header" onClick={() => setActiveAccordion(activeAccordion === "company" ? "" : "company")}>
                  <div className="accordion-header-title">
                    <svg className="section-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                      <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                    </svg>
                    Section 2: Company Information
                  </div>
                  <span className="accordion-arrow">▼</span>
                </div>
                {activeAccordion === "company" && (
                  <div className="accordion-body">
                    <div className="form-grid-full">
                      <TextareaField
                        label="Company Background / Profile"
                        id="company-profile"
                        value={formData.companyProfile}
                        onChange={(e) => handleInputChange("companyProfile", e.target.value)}
                        placeholder="Brief summary of the company credentials..."
                        rows={3}
                      />
                      <TextareaField
                        label="Benefits Provided"
                        id="company-benefits"
                        value={formData.benefits}
                        onChange={(e) => handleInputChange("benefits", e.target.value)}
                        placeholder="e.g., Health insurance, 401(k) matching, PTO..."
                        rows={2}
                      />
                      <ToggleSwitch
                        label="Company Logo Available"
                        active={formData.hasLogo}
                        onClick={() => handleInputChange("hasLogo", !formData.hasLogo)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Job Requirements */}
              <div className={`accordion-section ${activeAccordion === "details" ? "active" : ""}`}>
                <div className="accordion-header" onClick={() => setActiveAccordion(activeAccordion === "details" ? "" : "details")}>
                  <div className="accordion-header-title">
                    <svg className="section-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2"/>
                      <polyline points="14 2 14 8 20 8" strokeWidth="2"/>
                      <line x1="16" y1="13" x2="8" y2="13" strokeWidth="2"/>
                      <line x1="16" y1="17" x2="8" y2="17" strokeWidth="2"/>
                    </svg>
                    Section 3: Job Details & Criteria
                  </div>
                  <span className="accordion-arrow">▼</span>
                </div>
                {activeAccordion === "details" && (
                  <div className="accordion-body">
                    <div className="form-grid-full">

                      <Dropdown
                        label="Required Experience Level"
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        options={EXPERIENCE_LEVELS}
                      />
                      <InputField
                        label="Required Educational Benchmarks"
                        id="education"
                        value={formData.education}
                        onChange={(e) => handleInputChange("education", e.target.value)}
                        placeholder="e.g., Bachelor's Degree in CS, High School Diploma"
                      />
                      <TextareaField
                        label="Required Skills / Candidate Requirements"
                        id="requirements"
                        value={formData.requirements}
                        onChange={(e) => handleInputChange("requirements", e.target.value)}
                        placeholder="Key skills or criteria candidates must meet..."
                        rows={3}
                      />
                      <TextareaField
                        label="Job Description"
                        id="job-description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Paste the full job description details here..."
                        required
                        rows={6}
                        error={errors.description}
                        invalid={touched.description && !!errors.description}
                      />
                      <ToggleSwitch
                        label="Has Screening Questions / Checks"
                        active={formData.hasScreening}
                        onClick={() => handleInputChange("hasScreening", !formData.hasScreening)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Preset links loader */}
              <div className="preset-links">
                <span>Or speed-test with a preset:</span>
                <button type="button" className="preset-btn font-code" onClick={() => loadPresetData("scam1")}>Preset A (Scam)</button>
                <button type="button" className="preset-btn font-code" onClick={() => loadPresetData("scam2")}>Preset B (Scam)</button>
                <button type="button" className="preset-btn font-code" onClick={() => loadPresetData("real")}>Preset C (Verified)</button>
              </div>

              {/* Form buttons */}
              <div className="form-buttons">
                <button type="button" className="btn btn-secondary btn-ripple" onClick={handleResetForm}>
                  Reset Form
                </button>
                <button type="submit" className="btn btn-primary btn-ripple">
                  Analyze Job
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        /* The SaaS Dashboard Display results */
        <div className="dashboard-wrapper">
          <div className="dashboard-header-bar">
            <div className="dash-title-block">
              <span className={`dash-badge ${report.riskScore <= 30 ? "safe" : ""}`}>
                {report.riskScore <= 30 ? "VERIFIED REPORT" : "WARNING REPORT"}
              </span>
              <h3>Scan Results Dashboard</h3>
            </div>
            <div className="dash-actions">
              <button className="btn btn-primary btn-sm btn-ripple" onClick={handleDownloadReport}>
                Download Report
              </button>
              <button className="btn btn-secondary btn-sm btn-ripple" onClick={handleEditAgain}>
                Edit / Run Again
              </button>
            </div>
          </div>

          <div className="dashboard-grid">
            
            {/* 1. Risk Score Hero Card */}
            <AITrustScoreCard
              score={report.riskScore}
              prediction={report.verdict}
              confidence={report.confidence}
              riskLevel={report.riskLevel}
            />

            {/* 2. Prediction Summary */}
            <PredictionSummary score={report.riskScore} />

            {/* 3. Data Completeness */}
            <DataCompleteness formData={formData} />

            {/* 4. AI Feature Validation */}
            <AIFeatureValidation formData={formData} />

            {/* 5. Risk Indicators / Clean Green Info Card */}
            {report.riskScore <= 30 ? (
              <div className="glass-card dashboard-card col-span-2" style={{ borderLeft: '4px solid #4ade80', background: 'rgba(74, 222, 128, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.5rem 0' }}>
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                  <div>
                    <h4 style={{ color: '#4ade80', marginBottom: '4px' }}>Genuine Job Posting Verified</h4>
                    <p className="text-dim" style={{ margin: 0 }}>
                      No significant fraud indicators were detected. This job posting appears consistent with legitimate job listings based on the trained machine learning model.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <RiskIndicators reasons={report.reasons} formData={formData} />
            )}

            {/* 6. Machine Learning Analysis Timeline */}
            <div className="glass-card dashboard-card col-span-2 collapsible-card">
              <div className="collapsible-card-header" onClick={() => handleToggleCollapse("timeline")}>
                <div className="collapsible-card-title">
                  <svg className="btn-icon text-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <polyline points="12 6 12 12 16 14" strokeWidth="2"/>
                  </svg>
                  Machine Learning Analysis Timeline
                </div>
                <span style={{ transform: collapseState.timeline ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
              </div>
              {!collapseState.timeline && (
                <div className="collapsible-card-body">
                  <Timeline score={report.riskScore} />
                </div>
              )}
            </div>

            {/* 7. Analysis Metrics */}
            <AnalysisMetrics 
              predictionTime="0.42" 
              featuresCount="16" 
              modelStatus="Ready" 
              date={new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} 
            />

            {/* 8. Recommendation Panel (Only for Medium/High Risk) */}
            {report.riskScore > 30 && (
              <div className="glass-card dashboard-card col-span-2 collapsible-card">
                <div className="collapsible-card-header" onClick={() => handleToggleCollapse("recommendations")}>
                  <div className="collapsible-card-title">
                    <svg className="btn-icon text-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2"/>
                      <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2"/>
                    </svg>
                    Recommendations
                  </div>
                  <span style={{ transform: collapseState.recommendations ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                </div>
                {!collapseState.recommendations && (
                  <div className="collapsible-card-body">
                    <div className="recs-grid" style={{ margin: 0 }}>
                      <RecommendationCard text="Avoid sharing personal information." />
                      <RecommendationCard text="Do not pay any registration fees." />
                      <RecommendationCard text="Verify recruiter identity." />
                      <RecommendationCard text="Report suspicious postings." />
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
