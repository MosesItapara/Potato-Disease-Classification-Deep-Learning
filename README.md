# Potato Disease Classification
A CNN-based image classifier that detects disease in potato leaves **Early Blight**, **Late Blight**, or **Healthy**  trained on the [PlantVillage](https://www.kaggle.com/datasets/arjuntejaswi/plant-village) dataset. Includes a FastAPI backend, a React frontend and a Google Cloud Function for serverless inference.

## Demo

Upload a photo of a potato leaf and get back a predicted class with a confidence score.

## Project Structure

```
├── training.ipynb / Modelling.ipynb   # Model training & experimentation notebooks
├── models/                            # Saved models (.keras, .h5, SavedModel format)
├── api/                                # FastAPI inference server
│   ├── main.py                        # Loads model directly and serves /predict
│   └── main_tf_serving.py             # Calls out to a TensorFlow Serving instance
├── gcp/                                # Google Cloud Function deployment (serverless inference)
├── frontend/                           # React + Vite + MUI upload UI
└── requirements.txt                    # Python dependencies for training/api
```

## Tech Stack

- **Model**: TensorFlow / Keras CNN
- **Backend**: FastAPI, TensorFlow Serving (optional)
- **Frontend**: React, Vite, MUI
- **Deployment**: Google Cloud Functions

## Getting Started

### 1. Train / use the model

Model artifacts are already in `models/`. To retrain, open `training.ipynb` or `Modelling.ipynb` in Jupyter.

### 2. Run the API

```bash
cd api
pip install -r ../requirements.txt
python main.py
```

Serves on `http://localhost:8000`, exposing:
- `GET /ping` — health check
- `POST /predict` — accepts a `file` (image) and returns `{predicted_class, confidence}`

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173`. Points to the API at `http://localhost:8000/predict` by default (override with `VITE_API_URL`).

### 4. Deploy to Google Cloud Functions

The `gcp/` folder contains an HTTP-triggered Cloud Function that downloads the model from a GCS bucket and serves predictions:

```bash
cd gcp
gcloud functions deploy predict --runtime python310 --trigger-http --allow-unauthenticated --no-gen2
```

## Classes

- Early Blight
- Late Blight
- Healthy
