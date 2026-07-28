from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

endpoint = "http://localhost:8501/v1/models/potato_disease_model:predict"

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

def read_file_as_image(data) -> "np.ndarray":
    image = Image.open(BytesIO(data)).convert("RGB").resize((256, 256))
    return np.array(image)

@app.get("/ping")
async def ping():
    return  "Hello, I am alive and running!"


@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read()) 

    # Implement your prediction logic here
    # For example, you might use a pre-trained TensorFlow model to make predictions

    img_batch = np.expand_dims(image, axis=0)  # Add batch dimension
    
    response = requests.post(endpoint, json={"instances": img_batch.tolist()})
    predictions = np.array(response.json()["predictions"])

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])

    # return {"predictions": predictions.tolist()}

    return {
        "predicted_class": predicted_class,
        "confidence": float(confidence)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)