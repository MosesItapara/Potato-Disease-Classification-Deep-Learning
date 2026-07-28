from fastapi import FastAPI, File, UploadFile
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

model_prod = tf.keras.models.load_model("../models/1.keras")
beta_model = tf.keras.models.load_model("../models/2.keras")
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

def read_file_as_image(data) -> "np.ndarray":
    image = Image.open(BytesIO(data))
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
    predictions = model_prod.predict(img_batch)  # Make predictions using the model
    
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