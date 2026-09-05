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

## Main files

- `app/page.tsx` — content, feature definitions, validation, interactions, and result view
- `app/globals.css` — visual design and responsive behavior
- `app/layout.tsx` — metadata and root document
- `components/ui/` — reusable accessible UI primitives
- `package.json` and `package-lock.json` — exact dependencies
- `public/` — favicon and static assets

## Medical safety

This project is for education and portfolio demonstration. It is not a medical device or diagnostic tool. Validate the model, calibration, subgroup performance, data handling, accessibility, and applicable regulatory requirements before any clinical or patient-facing use.
