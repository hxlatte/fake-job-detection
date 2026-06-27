# Fake Job Posting Detection — Backend

FastAPI backend that loads your existing `fake_job_model.pkl` (XGBoost) and
`sentence_model/` (SentenceTransformer) and serves predictions to the React
frontend. Both models are used exactly as provided — nothing is retrained,
nothing is re-fit, no model is downloaded from Hugging Face at any point.

## Run it

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate   # optional but recommended
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8080 --workers 1
```

Then start the frontend (`npm install && npm run dev` in `frontend/`) — it's
already hardcoded to call `http://127.0.0.1:8080/predict`, so no config
changes are needed on that side.

`--workers 1` is intentional while you're validating: with multiple worker
processes, swapping the `.pkl` file without restarting every worker can
leave some workers silently serving the old model. Once you're confident
the pipeline is correct, scale workers up as needed.

## Endpoints

- `GET /health` — confirms which exact model files this running process
  has loaded (path + SHA256 of the `.pkl`), so you can rule out a stale or
  wrong model at a glance.
- `POST /predict` — the real endpoint the frontend calls. Returns
  `prediction`, `fraud_probability`, `confidence`, `risk_score`,
  `risk_level`, `reasons`.
- `POST /predict/debug` — same prediction, plus the combined text, first 20
  embedding values, full feature vector, and raw `predict_proba` output.
  Use this to validate against your notebook (see `VALIDATION.md`). Remove
  this route before any real deployment — it leaks internal pipeline state.

## Project layout

```
backend/
  main.py                  FastAPI app, CORS, startup model loading, routes
  app/
    config.py              Paths + the two things that still need your
                            confirmation: BINARY_FEATURES_ORDER, TEXT_FIELDS_ORDER
    schemas.py              Pydantic request/response contracts
    model_loader.py         Loads both models once at startup, exposes /health info
    preprocessing.py        combine_text() + build_feature_vector()
    explainability.py       Turns XGBoost's per-sample contributions into `reasons`
    inference.py            Orchestrates one prediction end-to-end
  models/
    fake_job_model.pkl      Your model, unmodified
    sentence_model/         Your SentenceTransformer, unmodified
  VALIDATION.md             Full evidence trail for the feature pipeline
```

## Before you trust this in production

Read `VALIDATION.md`. Short version: the 387-feature structure (384
embedding dims + 3 trailing binary features) is proven directly against
your model file. The *identity* of those 3 binary features and the *exact*
text-concatenation order are well-evidenced defaults, not proven facts.
Confirm them against your training notebook, or against the known
`0.98714465` test case, using `/predict/debug`.
