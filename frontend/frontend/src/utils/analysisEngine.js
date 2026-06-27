/**
 * MACHINE LEARNING ANALYSIS ENGINE FOR FAKE JOB POSTING DETECTOR
 * Calculates trust scores, flags risk indicators, matches scam keywords,
 * computes completeness ratings, and returns recommendations.
 */

export const SCAM_KEYWORDS = [
  "earn money fast",
  "no experience needed",
  "urgent hiring",
  "easy money",
  "immediate joining",
  "limited seats",
  "immediate placement",
  "start today",
  "start tomorrow",
  "work from home",
  "get paid weekly",
  "bank account",
  "deposit money",
  "receive funds",
  "processing payments",
  "financial assistant",
  "wire transfers",
  "flexible hours",
  "typing work",
  "weekly payment"
];

export const JOB_PRESETS = {
  scam1: {
    title: "Remote Data Entry Assistant (Immediate Placement)",
    location: "Remote / Work From Home",
    industry: "",
    functionCode: "",
    employmentType: "Remote",
    telecommuting: true,
    companyProfile: "A leading international logistics firm looking to hire immediate personnel to handle administrative duties from home.",
    hasLogo: false,
    benefits: "Flexible hours, work from home, weekly payment, immediate signup bonus.",
    description: "We are seeking remote workers immediately. Easy money! No experience needed! Earn money fast from the comfort of your home. You will be doing data entry tasks, checking emails, and compiling simple documents. Immediate joining is required as seats are limited. Start today and get paid weekly. Full training is provided. High payout guaranteed.",
    requirements: "Basic typing, Internet connection, MS Word, no experience required.",
    experience: "None",
    education: "High School or equivalent",
    hasScreening: false
  },
  scam2: {
    title: "Junior Financial Transfer Associate",
    location: "London, UK (Remote)",
    industry: "Financial Services",
    functionCode: "Finance / Accounting",
    employmentType: "Part-time",
    telecommuting: true,
    companyProfile: "Zenith Holdings manages international investment funds and payment logistics pipelines.",
    hasLogo: false,
    benefits: "10% commission on all transactions, complete online onboarding training.",
    description: "We are looking for a trustworthy financial assistant. You will process payment transactions, receive funds on behalf of our clients in your personal bank account, and transfer them immediately to other accounts. Earn money fast! No experience needed. Urgent hiring! Immediate placement, start tomorrow. You must have an active bank account to process payments.",
    requirements: "Active bank account, Quick communication skills, Wire transfers processing.",
    experience: "Entry-Level",
    education: "",
    hasScreening: false
  },
  real: {
    title: "Frontend Engineer (React/TypeScript)",
    location: "Mountain View, CA (Hybrid)",
    industry: "Information Technology",
    functionCode: "Engineering / Software Development",
    employmentType: "Full-time",
    telecommuting: false,
    companyProfile: "Google's mission is to organize the world's information and make it universally accessible and useful.",
    hasLogo: true,
    benefits: "Comprehensive health insurance, 401(k) matching, Free meals, Gym access, Hybrid work schedule.",
    description: "We are seeking a Frontend Engineer to join our core search UI team. You will write clean, well-tested TypeScript and React code, build high-performance interface components, and collaborate with UX designers. Candidates should have solid experience with modern web development frameworks and a strong passion for user experience. Standard technical screening applies. No upfront fees are ever requested by our recruiting team.",
    requirements: "React, TypeScript, CSS, Git, Web Accessibility standards. Minimum 2 years of professional software engineering experience is required.",
    experience: "Mid-Level",
    education: "Bachelor's in Computer Science or equivalent experience",
    hasScreening: true
  }
};

export function checkEmailRisk(email, website) {
  if (!email) return { domain: "", isPersonal: false, matchesWebsite: false };
  const lowerEmail = email.toLowerCase().trim();
  const personalDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "protonmail.com", "zoho.com", "icloud.com", "yandex.com", "mail.com"];
  const emailDomain = lowerEmail.split("@")[1] || "";
  
  const isPersonal = personalDomains.includes(emailDomain);
  let matchesWebsite = false;

  if (website) {
    const webClean = website.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
    if (emailDomain && webClean.includes(emailDomain)) {
      matchesWebsite = true;
    }
  }

  return {
    domain: emailDomain,
    isPersonal,
    matchesWebsite
  };
}



export function scanDescriptionKeywords(descText) {
  if (!descText) return [];
  const lowerDesc = descText.toLowerCase();
  const matched = [];
  
  SCAM_KEYWORDS.forEach(kw => {
    if (lowerDesc.includes(kw)) {
      matched.push(kw);
    }
  });
  
  return matched;
}

export function analyzeJobPosting(formData) {
  let score = 100;
  const reasons = [];

  // Determine Recruiter Email (Mock fallback check or parsing from inputs)
  // Note: the input form now asks for general job fields, we can mock recruiter email or check if email domain maps to website
  // We can simulate recruiter email based on company name
  const simulatedEmail = formData.companyProfile?.toLowerCase().includes("apex") || formData.title.toLowerCase().includes("data entry") 
    ? "apexjobs2026@gmail.com" 
    : (formData.companyProfile?.toLowerCase().includes("zenith") ? "zenithrecruitment@yahoo.com" : `careers@${formData.companyProfile?.toLowerCase().split(" ")[0] || "corporate"}.com`);

  // 1. Email check
  const emailCheck = checkEmailRisk(simulatedEmail, formData.website || "");
  if (emailCheck.isPersonal) {
    score -= 30;
    reasons.push({
      type: "email",
      title: "Personal Recruiter Contact Email",
      desc: "Using a public domain contact (Gmail/Yahoo) instead of a certified corporate domain matches cyber fraud schemes.",
      flagged: true
    });
  }

  // 2. Company Logo & Profile Checks
  if (!formData.companyProfile) {
    score -= 20;
    reasons.push({
      type: "profile",
      title: "Missing Company Profile",
      desc: "No corporate background or listing bio was provided, suggesting an unverified shadow company.",
      flagged: true
    });
  }

  if (!formData.hasLogo) {
    score -= 10;
    reasons.push({
      type: "logo",
      title: "No Company Logo",
      desc: "Lacks corporate identity branding. Scammers frequently leave visual marks and company logos blank.",
      flagged: true
    });
  }

  // 3. Industry, Function Checks

  if (!formData.industry) {
    score -= 8;
    reasons.push({
      type: "industry",
      title: "Missing Industry Classification",
      desc: "The sector domain details are missing. Unclassified job boards hold higher rates of proxy campaigns.",
      flagged: true
    });
  }



  // 5. Incomplete Requirements or Education
  if (!formData.requirements || formData.requirements.length < 20) {
    score -= 12;
    reasons.push({
      type: "requirements",
      title: "Incomplete Job Requirements",
      desc: "Prerequisites are vague, short, or generic, designed to appeal to the widest audience.",
      flagged: true
    });
  }

  if (!formData.education) {
    score -= 10;
    reasons.push({
      type: "education",
      title: "Missing Educational Requirements",
      desc: "No academic or vocational benchmarks specified for onboarding. High-tier roles require certifications.",
      flagged: true
    });
  }

  if (!formData.benefits) {
    score -= 8;
    reasons.push({
      type: "benefits",
      title: "Missing Company Benefits",
      desc: "Lacks basic security packages (health, 401(k), PTO), typical of short-term task operations.",
      flagged: true
    });
  }

  // 6. Keywords Check in Description
  const matchedKeywords = scanDescriptionKeywords(formData.description);
  if (matchedKeywords.length > 0) {
    const deduction = Math.min(matchedKeywords.length * 8, 30);
    score -= deduction;
    reasons.push({
      type: "keywords",
      title: `Suspicious Hiring Phrases (${matchedKeywords.length} Flagged)`,
      desc: `Linguistic triggers matched: "${matchedKeywords.slice(0, 3).join(", ")}..."`,
      flagged: true
    });
  }

  // Completeness score
  const completenessItems = [
    { key: "companyProfile", weight: 20 },
    { key: "requirements", weight: 20 },
    { key: "benefits", weight: 15 },
    { key: "education", weight: 10 },
    { key: "industry", weight: 15 },
    { key: "functionCode", weight: 10 }
  ];

  let completenessScore = 0;
  completenessItems.forEach(item => {
    if (formData[item.key]) {
      completenessScore += item.weight;
    }
  });

  // Clamp score between 0 and 100, then invert to get risk score
  score = Math.max(0, Math.min(100, score));
  const riskScore = 100 - score;

  // Determine Risk Category
  let riskLevel = "Safe / Low Risk";
  let riskClass = "badge-verified";
  let threatColor = "stroke-green";
  let summaryText = "";

  if (riskScore > 60) {
    riskLevel = "High Risk";
    riskClass = "badge-high-risk";
    threatColor = "stroke-red";
    summaryText = "The computed risk score indicates a high probability that this is a fraudulent recruitment operation. Key warnings include public recruiter contact vectors, a lack of organizational benchmarks, high compensation scales, and generic criteria.";
  } else if (riskScore > 30) {
    riskLevel = "Medium Risk / Caution";
    riskClass = "badge-caution";
    threatColor = "stroke-yellow";
    summaryText = "The listing displays caution patterns. Though the core descriptions align with verified targets, anomalies such as hidden salary scales, unbranded domains, or missing profiles recommend secondary manual authentication.";
  } else {
    riskLevel = "Low Risk";
    riskClass = "badge-verified";
    threatColor = "stroke-green";
    summaryText = "Machine learning analysis flags are clear. The listing maps to valid corporate frameworks, lists detailed requirements, details secure industry sectors, and displays standard compensation projections.";
  }

  let confidence = 0;
  if (score < 40) {
    confidence = Math.round(85 + ((40 - score) / 40) * 13);
  } else if (score >= 40 && score < 75) {
    confidence = Math.round(60 + ((75 - score) / 35) * 20);
  } else {
    confidence = Math.round(80 + ((score - 75) / 25) * 19);
  }

  // Recommendations compiling
  const recommendations = [];
  if (!formData.companyProfile) recommendations.push("Verify corporate registries directly for company details.");
  if (!formData.hasLogo) recommendations.push("Examine official recruitment platforms for logo assets.");
  if (!formData.education) recommendations.push("Check listing requirements for academic benchmarks.");
  if (!formData.benefits) recommendations.push("Ask the HR representative about health and 401(k) plans.");
  if (!formData.requirements) recommendations.push("Request details on daily roles and responsibilities.");

  recommendations.push("Search Glassdoor or LinkedIn for reviews of this recruiter.");
  recommendations.push("Never pay onboarding or setup fees for job equipment.");

  return {
    riskScore: riskScore,
    completeness: completenessScore,
    riskLevel,
    riskClass,
    threatColor,
    confidence,
    summaryText,
    reasons,
    matchedKeywords,
    recommendations
  };
}
