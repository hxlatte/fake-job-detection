"""
Generates the `reasons` list for the API response.

Rather than reimplementing the frontend's local heuristic checklist (missing
company profile, no logo, etc. -- see analysisEngine.js), this asks the
trained XGBoost model itself which features actually drove THIS prediction,
using its built-in per-sample contribution output (predict(pred_contribs=True),
XGBoost's SHAP-equivalent). This means the reasons reflect the real model
behavior for this specific input, not a fixed set of rules.
"""

from __future__ import annotations

import numpy as np
import xgboost as xgb

from . import config

BINARY_FEATURE_LABELS: dict[str, dict[str, str]] = {
    "telecommuting": {
        "positive": "Marked as a telecommuting-only role, a pattern the model weakly associates with higher fraud risk.",
        "negative": "Not marked as telecommuting-only, removing one minor fraud signal.",
    },
    "has_company_logo": {
        "positive": "No company logo provided — the single strongest signal this model learned for fraud.",
        "negative": "Company logo present, the strongest legitimacy signal this model learned.",
    },
    "has_questions": {
        "positive": "No screening questions included, a pattern often seen in fraudulent postings.",
        "negative": "Screening questions present, consistent with a genuine hiring process.",
    },
}


def generate_reasons(xgb_model, feature_vector: np.ndarray, top_k: int = 4) -> list[str]:
    booster = xgb_model.get_booster()
    dmat = xgb.DMatrix(feature_vector.reshape(1, -1))

    # shape (1, n_features + 1): last column is the bias/base-value term
    contribs = booster.predict(dmat, pred_contribs=True)[0]

    embedding_contrib = float(np.sum(contribs[: config.EMBEDDING_DIM]))
    binary_contribs = {
        name: float(contribs[config.EMBEDDING_DIM + i])
        for i, name in enumerate(config.BINARY_FEATURES_ORDER)
    }

    reasons: list[str] = []

    if embedding_contrib > 0.05:
        reasons.append(
            "The wording in the title/description/requirements/benefits text matches "
            "patterns this model associates with fraudulent postings."
        )
    elif embedding_contrib < -0.05:
        reasons.append(
            "The wording in the title/description/requirements/benefits text matches "
            "patterns this model associates with legitimate postings."
        )

    ranked = sorted(binary_contribs.items(), key=lambda kv: -abs(kv[1]))
    for name, contrib in ranked:
        if abs(contrib) < 0.01:
            continue
        direction = "positive" if contrib > 0 else "negative"
        reasons.append(BINARY_FEATURE_LABELS[name][direction])

    if not reasons:
        reasons.append(
            "No single feature dominated this prediction; the result reflects a "
            "balanced combination of weak signals."
        )

    return reasons[:top_k]
