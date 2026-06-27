# Pipeline Validation — Evidence Trail

You asked me not to guess. Here is exactly what was verified, how, and what
still needs your confirmation before you should trust this in production.

## What I had to work with

You uploaded `frontend_only.zip` and `backend_models_only.zip`. The backend
zip contained only `models/fake_job_model.pkl` and `models/sentence_model/`
— no training notebook, no preprocessing script, no `models/content/`
contents (that folder was empty). So the feature-engineering logic had to be
reverse-engineered from the model files themselves and from the frontend's
existing payload shape, not read off a script.

## PROVEN facts (verified by directly running real commands against your files)

1. **`xgb_model.n_features_in_` is exactly 387.** Loaded via
   `joblib.load("fake_job_model.pkl")` and checked directly.

2. **387 = 384 + 3, and the split is not arbitrary.** I called
   `booster.trees_to_dataframe()` and grouped every split node in every tree
   by feature index, looking at how many *distinct* threshold values each
   feature splits on:
   - Features `f0`...`f383`: ~10,586 split nodes total, thresholds spread
     continuously across roughly **-0.18 to +0.18** — exactly the shape of
     components of a unit-length 384-dim vector.
   - Features `f384`, `f385`, `f386`: **every single split, in every tree,
     is at threshold 1.0** — i.e. these three features only ever take the
     values 0 or 1. They are binary, and they sit at the **end** of the
     vector, not the start or interleaved.

3. **The SentenceTransformer auto-normalizes — confirmed by actually running
   it**, not by reading docs. I loaded the exact `sentence_model/` folder
   you shipped and ran:
   ```
   model = SentenceTransformer("models/sentence_model")
   emb = model.encode("some text")
   np.linalg.norm(emb)  ->  0.99999994
   ```
   `modules.json` shows the saved pipeline is
   `Transformer -> Pooling(mean) -> Normalize`, so calling `.encode(text)`
   with no extra arguments reproduces mean-pooling + L2-normalization
   automatically. The std-dev of the embedding components I measured this
   way (~0.053) matches the std-dev of the split thresholds found in step 2
   almost exactly — independent confirmation that the embedding pipeline and
   the trained feature space line up.

4. **The full backend was run end-to-end with real HTTP requests** (not
   just unit-tested in isolation) — `uvicorn` was started, `/health` and
   `/predict` were hit with `curl`, and the 387-length feature vector's
   last 3 values were confirmed to exactly equal whatever
   `telecommuting/has_company_logo/has_questions` values were sent in the
   request body, in that order.

## BEST-EVIDENCE assumptions (not provable from the .pkl alone)

5. **Which binary feature is f384 vs f385 vs f386.** I can't read column
   names off the model (`booster.feature_names` is `None` — it was trained
   on a raw array, not a named DataFrame). But:
   - `f385` is the single most important feature in the **entire 387-feature
     model** (rank #1 of 387 by gain, used in 113 splits, total gain ~84,700
     — an order of magnitude above almost every embedding dimension).
   - `f384` is almost never used (1 split, rank #382 of 387 — essentially
     dead weight).
   - This matches a well-documented property of the public "Fake Job
     Posting Prediction" dataset this model is clearly built for:
     `has_company_logo` is consistently reported as the single strongest
     fraud predictor in that dataset, while `telecommuting` is consistently
     the weakest (it's true for only a small minority of postings and
     barely correlates with the label).
   - This also matches the field order your **frontend already sends**:
     `telecommuting, has_company_logo, has_questions`.
   - **Confidence: high, but not proof.** I used this ordering in
     `config.BINARY_FEATURES_ORDER`.

6. **Which text fields get concatenated, in what order, with what
   cleaning.** I used `title, company_profile, description, requirements,
   benefits` (space-joined, empty fields skipped) — the 5 free-text fields
   your frontend collects, in their natural reading order. I did **not**
   apply any extra cleaning (no HTML stripping, no punctuation removal) —
   the tokenizer already lowercases (`do_lower_case: true`), so I didn't
   duplicate that, but if your original notebook did other cleaning before
   embedding, this will diverge. **Confidence: medium. This is the most
   likely remaining source of any notebook-vs-backend mismatch.**

## How to close the gap completely

Two ways, in order of preference:

**A. Share the training notebook** (or just the cell that builds the
feature vector / combines text). I'll diff it against
`app/preprocessing.py` and `app/config.py` directly and fix anything that
doesn't match — no more inference required.

**B. Share the exact posting that gave you `0.98714465` in the notebook**
(from your earlier message). Send it as a POST body to `/predict/debug` on
this backend (see `main.py` — that route returns the combined text, first
20 embedding values, full feature vector, and raw `predict_proba` output).
If `fraud_probability` comes back close to `0.987`, items 5 and 6 above are
confirmed correct. If it doesn't, the `_debug` fields will show you exactly
where the divergence starts — same approach as the diagnostic script from
earlier in this conversation, just built into the real backend now.

Until one of those happens, treat `BINARY_FEATURES_ORDER` and
`TEXT_FIELDS_ORDER` in `app/config.py` as the two lines to double check —
everything else in the pipeline is verified against your actual files.
