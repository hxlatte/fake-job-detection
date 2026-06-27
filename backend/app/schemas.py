"""
Request/response contracts.

JobPostingRequest mirrors exactly the `apiPayload` object built in
frontend/src/pages/AnalyzeJob.jsx (handleFormSubmit) -- field names and
types match what fetch() actually sends, not a re-imagined schema.

PredictResponse mirrors exactly what AnalyzeJob.jsx's `.then(data => ...)`
reads off the response: data.fraud_probability, data.confidence,
data.prediction (compared literally against the string "Fake"), and
data.reasons (an array of plain strings, each passed through
`r.replace(/\\.$/, "")` on the frontend).
"""

from pydantic import BaseModel, Field
from typing import List


class JobPostingRequest(BaseModel):
    title: str = ""
    location: str = ""
    company_profile: str = ""
    description: str = ""
    requirements: str = ""
    benefits: str = ""
    telecommuting: int = 0
    has_company_logo: int = 0
    has_questions: int = 0
    employment_type: str = ""
    required_experience: str = ""
    required_education: str = ""
    industry: str = ""
    function: str = ""


class PredictResponse(BaseModel):
    prediction: str = Field(..., description='"Fake" or "Real"')
    fraud_probability: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=100.0)
    risk_score: int = Field(..., ge=0, le=100)
    risk_level: str
    reasons: List[str]


class DebugPredictResponse(PredictResponse):
    """Adds intermediate pipeline values, for validating against the notebook."""
    combined_text: str
    embedding_first_20: List[float]
    embedding_dim: int
    feature_vector_shape: List[int]
    feature_vector_first_20: List[float]
    feature_vector_last_10: List[float]
    raw_predict_proba: List[float]
