"""
Reproduces the preprocessing pipeline the XGBoost model expects:

    feature_vector = concat(
        sentence_embedding(combined_text),   # 384 dims, mean-pooled + L2-normalized
        [telecommuting, has_company_logo, has_questions],  # 3 dims
    )                                          # 387 dims total

The 384/3 split and the fact that the 3 binary features sit at the END of
the vector are PROVEN (see config.py and VALIDATION.md). The specific
identity/order of those 3 binary features, and the exact text-field join
order, are best-evidence assumptions — see config.py for the reasoning.
If you have the original notebook, diff its preprocessing function against
this one before trusting this in production.
"""

import numpy as np

from . import config


def combine_text(payload: dict) -> str:
    """
    Builds the exact string fed into the SentenceTransformer.

    Joins config.TEXT_FIELDS_ORDER with single spaces, skipping any field
    that is empty/whitespace-only. No lowercasing or HTML-stripping is done
    here: the tokenizer itself lowercases (do_lower_case=True in
    tokenizer_config.json), so manual lowercasing would be redundant -- but
    if the training notebook stripped HTML tags, punctuation, or stopwords
    before embedding, that step is NOT replicated here and would need to be
    added to match exactly.
    """
    parts = []
    for field in config.TEXT_FIELDS_ORDER:
        value = (payload.get(field) or "").strip()
        if value:
            parts.append(value)
    return " ".join(parts)


def binary_feature_vector(payload: dict) -> np.ndarray:
    values = [float(payload.get(field, 0) or 0) for field in config.BINARY_FEATURES_ORDER]
    return np.array(values, dtype=float)


def build_feature_vector(payload: dict, embedder) -> tuple[np.ndarray, str, np.ndarray]:
    """
    Returns (feature_vector, combined_text, embedding) -- the text and
    embedding are returned too so the /predict/debug route can expose them
    for validation against the notebook.
    """
    text = combine_text(payload)

    # .encode() with NO extra kwargs: mean-pooling + L2-normalization are
    # baked into the saved model's module graph (Transformer -> Pooling ->
    # Normalize), confirmed empirically -- see VALIDATION.md.
    embedding = embedder.encode(text)
    embedding = np.asarray(embedding, dtype=float)

    if embedding.shape[0] != config.EMBEDDING_DIM:
        raise ValueError(
            f"Embedder produced {embedding.shape[0]} dims, expected {config.EMBEDDING_DIM}. "
            f"Wrong sentence_model loaded?"
        )

    binaries = binary_feature_vector(payload)
    feature_vector = np.concatenate([embedding, binaries])

    if feature_vector.shape[0] != config.TOTAL_FEATURES:
        raise ValueError(
            f"Built a {feature_vector.shape[0]}-dim feature vector, "
            f"but the model expects {config.TOTAL_FEATURES}."
        )

    return feature_vector, text, embedding
