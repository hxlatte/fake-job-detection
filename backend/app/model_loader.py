"""
Loads both models exactly once, at FastAPI startup -- never per-request,
never from anywhere except the local paths in config.py. No Hugging Face
download is triggered: SentenceTransformer(str(local_path)) loads straight
from disk.
"""

import hashlib
import logging

import joblib
from sentence_transformers import SentenceTransformer

from . import config

logger = logging.getLogger("model_loader")

_embedder: SentenceTransformer | None = None
_xgb_model = None
_model_sha256: str | None = None


def _hash_file(path) -> str:
    sha256 = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            sha256.update(chunk)
    return sha256.hexdigest()


def load_models():
    """Called once from the FastAPI lifespan handler."""
    global _embedder, _xgb_model, _model_sha256

    if not config.SBERT_PATH.exists():
        raise RuntimeError(f"SentenceTransformer path not found: {config.SBERT_PATH}")
    if not config.XGB_MODEL_PATH.exists():
        raise RuntimeError(f"XGBoost model file not found: {config.XGB_MODEL_PATH}")

    logger.info("Loading SentenceTransformer from local path: %s", config.SBERT_PATH)
    _embedder = SentenceTransformer(str(config.SBERT_PATH))

    logger.info("Loading XGBoost model via joblib.load(): %s", config.XGB_MODEL_PATH)
    _xgb_model = joblib.load(config.XGB_MODEL_PATH)

    n_features = getattr(_xgb_model, "n_features_in_", None)
    expected = config.TOTAL_FEATURES
    if n_features != expected:
        raise RuntimeError(
            f"Loaded XGBoost model expects {n_features} input features, but this "
            f"pipeline is configured to build {expected}-length feature vectors "
            f"({config.EMBEDDING_DIM} embedding dims + {len(config.BINARY_FEATURES_ORDER)} "
            f"binary features). Either the wrong .pkl was loaded, or config.py is "
            f"out of date for this model. Refusing to start."
        )

    _model_sha256 = _hash_file(config.XGB_MODEL_PATH)
    logger.info(
        "Models loaded OK | xgb.n_features_in_=%s | xgb sha256=%s",
        n_features,
        _model_sha256,
    )
    return _embedder, _xgb_model


def get_embedder() -> SentenceTransformer:
    if _embedder is None:
        raise RuntimeError("Embedder requested before startup ran load_models().")
    return _embedder


def get_xgb_model():
    if _xgb_model is None:
        raise RuntimeError("XGBoost model requested before startup ran load_models().")
    return _xgb_model


def get_model_info() -> dict:
    """Surfaced on GET /health so you can verify, at runtime, exactly which
    model file and which embedder are actually loaded in this process."""
    return {
        "sentence_model_path": str(config.SBERT_PATH.resolve()),
        "xgb_model_path": str(config.XGB_MODEL_PATH.resolve()),
        "xgb_model_sha256": _model_sha256,
        "xgb_n_features_in_": getattr(_xgb_model, "n_features_in_", None) if _xgb_model else None,
        "embedding_dim": config.EMBEDDING_DIM,
        "total_features": config.TOTAL_FEATURES,
        "binary_features_order": config.BINARY_FEATURES_ORDER,
        "text_fields_order": config.TEXT_FIELDS_ORDER,
    }
