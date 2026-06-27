"""
FastAPI backend for the Fake Job Posting Detector.

Run with:
    uvicorn main:app --host 127.0.0.1 --port 8080 --workers 1

(--workers 1 matters while you're validating the pipeline: extra worker
processes load their own copy of the models, and if you swap the .pkl file
without restarting ALL of them you can end up with workers silently serving
different model versions.)
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app import config
from app.model_loader import load_models, get_embedder, get_xgb_model, get_model_info
from app.schemas import JobPostingRequest, PredictResponse, DebugPredictResponse
from app.inference import run_prediction

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Startup: loading models exactly once...")
    load_models()
    yield
    logger.info("Shutdown.")


app = FastAPI(title="Fake Job Posting Detection API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    """Confirms which exact model files/paths this running process has loaded
    -- use this to rule out a stale model or wrong path."""
    return {"status": "ok", "models": get_model_info()}


@app.post("/predict", response_model=PredictResponse)
def predict(payload: JobPostingRequest):
    try:
        result = run_prediction(payload.model_dump(), get_embedder(), get_xgb_model())
    except Exception as e:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=str(e))
    return PredictResponse(**{k: v for k, v in result.items() if k in PredictResponse.model_fields})


@app.post("/predict/debug", response_model=DebugPredictResponse)
def predict_debug(payload: JobPostingRequest):
    """
    Identical prediction to /predict, but also returns the intermediate
    pipeline values (combined text, embedding, feature vector, raw
    predict_proba). Use this to diff against the notebook's own dump for
    the same posting -- this is how you confirm or correct the assumptions
    flagged in config.py. Remove this route before any real deployment.
    """
    try:
        result = run_prediction(payload.model_dump(), get_embedder(), get_xgb_model())
    except Exception as e:
        logger.exception("Debug prediction failed")
        raise HTTPException(status_code=500, detail=str(e))
    return DebugPredictResponse(**result)
