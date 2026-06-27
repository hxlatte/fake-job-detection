# 🛡️ Job Integrity Analyzer & Fake Job Detection API

A full-stack, enterprise-grade AI solution designed to analyze job postings and detect fraudulent recruitment campaigns in real-time. By leveraging a high-performance **FastAPI** backend, a state-of-the-art **SentenceTransformer** embedding model, an **XGBoost** classification engine, and a dynamic **React/Vite** dashboard, this application provides deep transparency into employment opportunities.

---

## ✨ Features

- **🧠 Advanced NLP & ML Prediction**: Uses a fine-tuned SentenceTransformer model (`all-MiniLM-L6-v2`) to generate 384-dimensional dense semantic embeddings combined with structural binary metadata.
- **⚡ High-Performance Classification**: An XGBoost tree classifier evaluates 387 combined features to calculate highly accurate fraud probabilities in milliseconds.
- **🛡️ Dynamic Risk Triage**: Automatically categorizes job postings into **Low Risk (Genuine)**, **Medium Risk (Caution)**, and **High Risk (Fraudulent)** tiers.
- **✅ Intelligent UI Adaptability**: Seamlessly conceals risk indicators and recommendation panels for verified genuine jobs while providing deep security explanations for suspicious listings.
- **📊 Interactive Security Dashboard**: Visualizes data completeness, feature impact analysis, historical scan timelines, and automated recruiter email risk checks.

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19** & **Vite**: Ultra-fast component rendering and modular bundling.
- **Vanilla CSS / Glassmorphism**: Premium, state-of-the-art aesthetic featuring vibrant indicators, smooth micro-animations, and responsive layout grids.
- **React Router Dom**: Client-side dashboard navigation.

### **Backend**
- **FastAPI**: Asynchronous API runtime with automatic OpenAPI documentation and strict Pydantic data contracts.
- **XGBoost**: Gradient boosted decision trees for mission-critical tabular classification.
- **Sentence-Transformers**: Locally served, offline dense embedding pipeline.
- **Joblib & Scikit-Learn**: Model deserialization and inference pipeline management.
- **Uvicorn**: Lightning-fast ASGI production server.

---

## 📂 Folder Structure

```
project/
├── backend/                  # FastAPI Application & ML Inference Pipeline
│   ├── app/
│   │   ├── config.py         # Pipeline constants, feature ordering & thresholds
│   │   ├── explainability.py # Interprets XGBoost feature importance rules
│   │   ├── inference.py      # End-to-end prediction execution logic
│   │   ├── model_loader.py   # Lifespan single-instance model caching
│   │   ├── preprocessing.py  # Feature vector assembly & text concatenation
│   │   └── schemas.py        # Pydantic request & response models
│   ├── models/
│   │   ├── fake_job_model.pkl# Pre-trained XGBoost classification model
│   │   └── sentence_model/   # Exported SentenceTransformer local model weights
│   ├── main.py               # FastAPI initialization, middleware & routes
│   ├── requirements.txt      # Python package dependencies
│   ├── README.md             # Dedicated backend technical documentation
│   └── VALIDATION.md         # Evidence trail and pipeline validation reports
│
├── frontend/                 # React & Vite Single Page Application
│   └── frontend/
│       ├── public/           # Static web assets
│       ├── src/
│       │   ├── components/   # Dashboard widgets, cards & input fields
│       │   ├── hooks/        # Custom React hooks (e.g., useLocalStorage)
│       │   ├── pages/        # Application views (Home, About, AnalyzeJob)
│       │   ├── utils/        # Heuristics engine & scam keyword analyzers
│       │   ├── App.jsx       # Root router & layout wrapper
│       │   ├── index.css     # Design system, glassmorphism tokens & utilities
│       │   └── main.jsx      # React DOM entry point
│       ├── .env.example      # Sample environment variable template
│       ├── index.html        # Main HTML layout wrapper
│       ├── package.json      # Node dependency registry
│       └── vite.config.js    # Vite bundler configuration
│
├── .gitignore                # Comprehensive Git exclusion rules (Python & React)
└── README.md                 # Root project documentation
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/job-integrity-analyzer.git
cd job-integrity-analyzer
```

---

### 2. Backend Setup

The backend requires Python 3.10+ and runs entirely locally without making external Hugging Face network requests.

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment (Recommended)
python -m venv .venv
source .venv/bin/activate      # On Windows PowerShell: .\_.venv\Scripts\Activate.ps1

# Install required Python dependencies
pip install -r requirements.txt
```

---

### 3. Frontend Setup

The frontend uses Vite for blazing-fast local development.

```bash
# Navigate to the frontend directory
cd frontend/frontend

# Install Node dependencies
npm install

# Copy the environment template (if customizing API URL)
cp .env.example .env
```

---

## ⚡ Running the Project Locally

### Start the FastAPI Backend
Open a terminal, navigate to `backend/`, and start the Uvicorn ASGI server:
```bash
uvicorn main:app --host 127.0.0.1 --port 8080 --workers 1
```
*The backend API will be live at `http://127.0.0.1:8080`.*

### Start the React Frontend
Open a second terminal, navigate to `frontend/frontend/`, and launch the Vite development server:
```bash
npm run dev
```
*The frontend web application will be live at `http://localhost:5173`.*

---

## 📡 API Endpoints

### `POST /predict`
Evaluates a complete job posting payload and returns prediction metrics, fraud probabilities, and structured risk explanations.
- **Request Body**: JSON matching the `JobPostingRequest` schema (title, description, location, binary flags, etc.).
- **Response**:
```json
{
  "prediction": "Real",
  "fraud_probability": 0.0007351454114541411,
  "confidence": 98.4,
  "risk_score": 1,
  "risk_level": "Low Risk",
  "reasons": []
}
```

### `GET /health`
Confirms API reachability and verifies active in-memory model paths and SHA256 checksum hashes.

### `POST /predict/debug`
Returns standard prediction metrics alongside intermediate pipeline states (concatenated text strings, 384 embedding values, full 387 feature vectors, and raw `predict_proba()` arrays) for diagnostic inspection.

---

## 📸 Screenshots

### 🛡️ Job Integrity Analysis Dashboard (Clean / Genuine Job)
> *When a listing is verified as legitimate, the interface highlights a pristine green confirmation card while cleanly omitting unnecessary risk panels.*
```
+-----------------------------------------------------------------------+
|  ✅ Genuine Job Posting Verified                                      |
|  No significant fraud indicators were detected. This job posting      |
|  appears consistent with legitimate job listings based on the trained |
|  machine learning model.                                              |
+-----------------------------------------------------------------------+
```
<img width="1600" height="822" alt="image" src="https://github.com/user-attachments/assets/db4e4fb7-099c-47b7-9355-82f344e660c3" />

### ⚠️ Fraudulent Listing Triage (High Risk Warning)
> *For suspicious listings, the application immediately populates threat breakdowns, linguistic scam triggers, and actionable security recommendations.*
```
+-----------------------------------------------------------------------+
|  ⚠️ High Risk Report: Suspicious Hiring Phrases (4 Flagged)          |
|  Linguistic triggers matched: "earn money fast, wire transfers..."    |
+-----------------------------------------------------------------------+
|  💡 Recommendations:                                                  |
|  - Avoid sharing personal information.                                |
|  - Do not pay any registration fees.                                  |
+-----------------------------------------------------------------------+
```

<img width="1600" height="827" alt="image" src="https://github.com/user-attachments/assets/631193eb-1b95-4cfa-9183-ff6557459c05" />
---

## 🔒 Security & Best Practices

- **Zero External Network Tracking**: All embedding calculations and XGBoost inferences happen locally in memory.
- **Protected Secrets**: Using `.env.example` prevents accidental credential exposure.
- **Environment Isolation**: Comprehensive `.gitignore` configuration guarantees a pristine, production-ready repository structure upon cloning.
