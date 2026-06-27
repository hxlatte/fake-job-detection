"""Orchestrates one prediction: preprocessing -> predict_proba -> response shape."""

from . import config
from .preprocessing import build_feature_vector
from .explainability import generate_reasons


def risk_level_from_score(risk_score: int) -> str:
    if risk_score <= config.RISK_THRESHOLDS["low_max"]:
        return "Low Risk"
    elif risk_score <= config.RISK_THRESHOLDS["medium_max"]:
        return "Medium Risk / Caution"
    return "High Risk"


def run_prediction(payload: dict, embedder, xgb_model) -> dict:
    feature_vector, combined_text, embedding = build_feature_vector(payload, embedder)

    # Raw predict_proba() output -- the single source of truth for fraud_probability.
    proba = xgb_model.predict_proba(feature_vector.reshape(1, -1))[0]
    fraud_probability = float(proba[1])
    predicted_class = int(fraud_probability >= 0.5)

    confidence = max(fraud_probability, 1 - fraud_probability) * 100
    risk_score = int(round(fraud_probability * 100))
    risk_level = risk_level_from_score(risk_score)
    prediction_label = "Fake" if predicted_class == 1 else "Real"

    reasons = generate_reasons(xgb_model, feature_vector)

    return {
        "prediction": prediction_label,
        "fraud_probability": fraud_probability,
        "confidence": round(confidence, 2),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reasons": reasons,
        # debug-only fields, used by /predict/debug to expose intermediate
        # pipeline state for validation against the training notebook.
        "combined_text": combined_text,
        "embedding_first_20": embedding[:20].tolist(),
        "embedding_dim": int(embedding.shape[0]),
        "feature_vector_shape": list(feature_vector.shape),
        "feature_vector_first_20": feature_vector[:20].tolist(),
        "feature_vector_last_10": feature_vector[-10:].tolist(),
        "raw_predict_proba": proba.tolist(),
    }
