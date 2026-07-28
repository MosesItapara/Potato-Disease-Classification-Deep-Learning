from google.cloud import storage
from httpx import request
import tensorflow as tf
from PIL import Image
import numpy as np

BUCKET_NAME = 'hmoses-tf'

class_names = ['Early Blight', 'Late Blight', 'Healthy']

model = NotImplemented

def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)

def predict(request):
    global model
    if model is None:
        download_blob(
        BUCKET_NAME, 'models/potatoes.h5', "/tmp/potatoes.h5"
    )

        model = tf.keras.load_model("/tmp/potatoes.h5")

    image = request.files["file"]

    image = np.array(Image.open(image).convert("RGB").resize((256,256)))
    image = image/255
    img_array = tf.expand_dims(image, 0)

    predictions = model.predict(img_array)
    print(predictions)


    predictions = class_names[np.argmax(predictions[0])]
    confidence = round(100 * (np.max(predictions[0])), 2)

    return {"predictions": predictions, "confidence": confidence}