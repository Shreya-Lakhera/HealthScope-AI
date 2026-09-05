# MediLocker

MediLocker is a full-stack educational healthcare machine-learning web app.
It provides approachable disease overviews for Heart, liver, chronic kidney disease, and stroke screening and runs four trained screening
models through a private, responsive interface.

> **Medical disclaimer:** MediLocker is a learning and portfolio project, not
> a medical device. Its estimates cannot diagnose, rule out, or treat disease.
> Seek qualified medical care for health concerns and emergency services for
> urgent symptoms.

## Technology stack

| Layer | Technologies | Purpose |
|---|---|---|
| Web interface | React 19, TypeScript, Vinext, Vite | Responsive pages, forms, and client-side API requests |
| Styling | Tailwind CSS, Radix UI primitives, custom CSS | Accessible controls and the MediLocker visual system |
| API | Python, FastAPI, Uvicorn, Pydantic | Model loading, input transport, and prediction endpoints |
| Machine learning | pandas, NumPy, scikit-learn | Cleaning, preprocessing, training, evaluation, and inference |
| Packaging | pickle model bundles | Stores each fitted preprocessing pipeline and classifier together |
| Deployment | Docker, Docker Compose, Render Blueprint | Reproducible local and hosted services |

## Included models

| Screening | Algorithm | Inputs | Test ROC-AUC | Artifact |
|---|---|---:|---:|---|
| Heart disease | Class-balanced logistic regression | 13 | 0.8983 | `ml/artifacts/heart_pipeline.pkl` |
| Liver disease | Class-balanced Extra Trees (400 trees) | 9 | 0.8136 | `ml/artifacts/liver_pipeline.pkl` |
| Chronic kidney disease | Class-balanced random forest (500 trees) | 24 | 1.0000* | `ml/artifacts/kidney_pipeline.pkl` |
| Stroke | Class-balanced logistic regression | 10 | 0.8436 | `ml/artifacts/stroke_pipeline.pkl` |

\*The kidney result comes from a small public dataset and should not be treated
as evidence of clinical performance. 

## Included datasets

All CSV files required to reproduce the current models are committed under
`ml/data/`:

| Dataset | Rows | Columns | Used by |
|---|---:|---:|---|
| `heart_disease_data.csv` | 303 | 14 | Heart model |
| `indian_liver_patient.csv` | 583 | 11 | Liver model |
| `kidney_disease.csv` | 400 | 26 | Kidney model |
| `healthcare-dataset-stroke-data.csv` | 5,110 | 12 | Stroke model |

## Clone or duplicate the repository

### Clone this repository

```bash
git clone https://github.com/Shreya-Lakhera/MediLocker.git
cd MediLocker
```

### Create your own independent copy

Use GitHub's **Fork** button for a linked copy, or duplicate it without history:

```bash
git clone https://github.com/Shreya-Lakhera/MediLocker.git my-medilocker
cd my-medilocker
rm -rf .git
git init
git add .
git commit -m "Initial MediLocker project"
```

On Windows PowerShell, replace `rm -rf .git` with:

```powershell
Remove-Item -Recurse -Force .git
```

Create an empty GitHub repository, then connect and push the copy:

```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Run locally

Requirements: Node.js 22.13+, Python 3.13, npm, and pip.

### 1. Create the Python environment

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r backend\requirements.txt
```

macOS or Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
```

### 2. Install the frontend and start both services

```bash
npm ci
npm run dev
```

Open <http://localhost:5173>. The API and interactive documentation are at
<http://127.0.0.1:8000> and <http://127.0.0.1:8000/docs>.

You can also run the services separately:

```bash
npm run dev:web
python -m uvicorn backend.app:app --reload --port 8000
```

## Run with Docker

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) or a
compatible Docker Engine, then run:

```bash
docker compose up --build
```

Open <http://localhost:3000>. The containerized API is available at
<http://localhost:8000/docs>.

Stop the stack with:

```bash
docker compose down
```

Build or run either image independently if needed:

```bash
docker build -f Dockerfile.api -t medilocker-api .
docker build -f Dockerfile.web --build-arg VITE_API_URL=http://localhost:8000 -t medilocker-web .
docker run --rm -p 8000:8000 -e CORS_ORIGINS=http://localhost:3000 medilocker-api
docker run --rm -p 3000:3000 medilocker-web
```

## Validation

```bash
npm run lint
npm run build
python -m py_compile backend/app.py ml/training/*.py
```
