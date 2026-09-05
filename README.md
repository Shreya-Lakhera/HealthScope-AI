# MediLocker

A polished, responsive educational health-screening interface built with React, TypeScript, Vinext, Tailwind CSS, and accessible UI components.

## What is included

- Landing page with heart, liver, kidney, and stroke screening cards
- Complete forms for all four trained screening models
- Required-field, range, and numeric validation
- Progress indicator and mobile-responsive layouts
- Exact model-order payload generation
- FastAPI prediction service with probability responses
- Privacy and educational-use messaging

## Requirements

- Node.js 22.13 or newer
- Python 3.10 or newer
- npm and pip

## Install and run

```bash
python -m venv .venv
.venv\Scripts\python -m pip install -r backend\requirements.txt
npm install
npm run dev
```

Open `http://localhost:5173`. The command starts both the web interface and
the prediction API (`http://127.0.0.1:8000`).

On macOS or Linux, activate the virtual environment and use
`pip install -r backend/requirements.txt`; the launcher detects `.venv/bin/python`.

## Production build

```bash
npm run build
npm run start
```

## Deploy on Render

This repository includes a `render.yaml` Blueprint for two services:

- `medilocker-web` — the Vinext web interface
- `medilocker-api` — the FastAPI prediction service

In the Render dashboard, choose **New > Blueprint**, connect this GitHub
repository, and apply the detected Blueprint. The frontend is configured to
call the public API service, and the API allows requests from the frontend.

If Render changes either service name because it is already taken, update
`VITE_API_URL` on the web service and `CORS_ORIGINS` on the API service to
match the two generated `onrender.com` URLs, then redeploy both services.

## Main files

- `app/page.tsx` — content, feature definitions, validation, interactions, and result view
- `app/globals.css` — visual design and responsive behavior
- `app/layout.tsx` — metadata and root document
- `components/ui/` — reusable accessible UI primitives
- `package.json` and `package-lock.json` — exact dependencies
- `public/` — favicon and static assets

## Feature order

Heart:

```text
age, sex, cp, trestbps, chol, fbs, restecg, thalach,
exang, oldpeak, slope, ca, thal
```

Liver:

```text
Age, Total_Bilirubin, Direct_Bilirubin, Alkaline_Phosphotase,
Alamine_Aminotransferase, Aspartate_Aminotransferase,
Total_Protiens, Albumin, Albumin_and_Globulin_Ratio
```

The misspellings in the liver feature keys are preserved because they match the original dataset and notebook.

## Medical safety

This project is for education and portfolio demonstration. It is not a medical device or diagnostic tool. Validate the model, calibration, subgroup performance, data handling, accessibility, and applicable regulatory requirements before any clinical or patient-facing use.
