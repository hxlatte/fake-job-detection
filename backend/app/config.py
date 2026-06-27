"""
Central configuration for the inference pipeline.

This file deliberately documents WHICH parts of the pipeline were verified
empirically against the actual fake_job_model.pkl / sentence_model files,
and which parts are best-evidence assumptions that still need confirmation
against the original training notebook. See VALIDATION.md for the full
evidence trail.
"""

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent  # backend/
MODEL_DIR = BASE_DIR / "models"
SBERT_PATH = MODEL_DIR / "sentence_model"
XGB_MODEL_PATH = MODEL_DIR / "fake_job_model.pkl"

# ---------------------------------------------------------------------------
# PROVEN (verified directly against the shipped model files — see VALIDATION.md)
# ---------------------------------------------------------------------------
# - xgb_model.n_features_in_ == 387
# - Analyzing booster.trees_to_dataframe(): features f0-f383 split on ~10,586
#   distinct continuous thresholds in the range [-0.18, 0.18] (consistent with
#   a unit-normalized 384-dim embedding). Features f384, f385, f386 split
#   ONLY ever at threshold 1.0 (i.e. they are binary 0/1 features), and they
#   sit at the END of the vector, not interleaved or at the start.
# - Loading the shipped sentence_model and calling .encode(text) with NO
#   extra kwargs produces a unit-L2-norm 384-dim vector (norm == 0.99999994).
#   This confirms mean-pooling + L2-normalization are baked into the saved
#   model graph itself (see modules.json: Transformer -> Pooling -> Normalize),
#   so the backend does NOT need to pass normalize_embeddings=True manually.
EMBEDDING_DIM = 384
TOTAL_FEATURES = 387

# ---------------------------------------------------------------------------
# BEST-EVIDENCE ASSUMPTIONS (not provable from the .pkl alone — pending
# confirmation against the original notebook or a known ground-truth example)
# ---------------------------------------------------------------------------
# Evidence for this exact order of the 3 trailing binary features:
#   1. It matches the field order the React frontend already sends.
#   2. Feature importance pattern matches well-documented characteristics of
#      the public "Fake Job Posting Prediction" Kaggle dataset: f385 is by
#      far the single most important feature in the whole 387-feature model
#      (rank #1 of 387 by gain) which matches has_company_logo being the
#      dataset's best-known single fraud predictor. f384 is almost unused
#      (used in exactly 1 split, rank #382 of 387) which matches
#      telecommuting being the dataset's weakest binary predictor.
# CONFIRM THIS before relying on it for production decisions.
BINARY_FEATURES_ORDER = ["telecommuting", "has_company_logo", "has_questions"]

# Evidence: these are the 5 free-text fields the frontend collects and the
# standard text columns in the public dataset this model is built for.
# UNVERIFIED: exact join order/separator/cleaning used at training time.
TEXT_FIELDS_ORDER = [
    "title",
    "company_profile",
    "description",
    "requirements",
    "benefits",
    "required_education",
    "industry",
    "function",
    "employment_type",
    "required_experience",
    "location",
]

assert len(BINARY_FEATURES_ORDER) == TOTAL_FEATURES - EMBEDDING_DIM, (
    "BINARY_FEATURES_ORDER length must equal TOTAL_FEATURES - EMBEDDING_DIM"
)

# ---------------------------------------------------------------------------
# Risk level thresholds — mirrors the thresholds already hardcoded in the
# React frontend (AnalyzeJob.jsx) so /predict and the UI agree even if the
# UI's own client-side recompute is ever removed.
# ---------------------------------------------------------------------------
RISK_THRESHOLDS = {"low_max": 30, "medium_max": 60}

# ---------------------------------------------------------------------------
# CORS — the frontend calls an absolute http://127.0.0.1:8080 URL from its
# Vite dev server (default port 5173), so both hosts/ports need to be allowed.
# ---------------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

API_PORT = 8080
