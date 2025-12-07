from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import json
from typing import List

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar modelo y configuración
print("📦 Cargando modelo...")
model = tf.keras.models.load_model('models/sign_language_model.keras')
print("✅ Modelo cargado")

with open('models/model_config.json', 'r') as f:
    config = json.load(f)
print(f"✅ Config cargada: {config['class_names']}")


class PredictionRequest(BaseModel):
    sequence: List[List[float]]


@app.get("/config")
async def get_config():
    """Devuelve la configuración del modelo"""
    return config


@app.post("/predict")
async def predict(request: PredictionRequest):
    """Predice la seña basándose en la secuencia de landmarks"""
    try:
        # Convertir secuencia a numpy array
        sequence = np.array(request.sequence, dtype=np.float32)
        
        print(f"📥 Secuencia recibida: shape={sequence.shape}")
        
        # Validar dimensiones
        expected_shape = (config['frames_per_sample'], 63)  # 21 landmarks × 3 coordenadas
        if sequence.shape != expected_shape:
            raise HTTPException(
                status_code=400,
                detail=f"Forma incorrecta. Esperado {expected_shape}, recibido {sequence.shape}"
            )
        
        # Expandir dimensiones para batch
        sequence_batch = np.expand_dims(sequence, axis=0)
        
        # Hacer predicción
        predictions = model.predict(sequence_batch, verbose=0)[0]
        
        # Obtener clase predicha
        class_idx = int(np.argmax(predictions))
        confidence = float(predictions[class_idx])
        predicted_class = config['class_names'][class_idx]
        
        # Crear diccionario de probabilidades
        probabilities = {
            name: float(pred) 
            for name, pred in zip(config['class_names'], predictions)
        }
        
        print(f"✅ Predicción: {predicted_class} ({confidence*100:.1f}%)")
        
        return {
            'prediction': predicted_class,
            'confidence': confidence,
            'probabilities': probabilities
        }
        
    except Exception as e:
        print(f"❌ Error en predicción: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    return {
        "message": "API de Reconocimiento de Señas",
        "status": "online",
        "model_classes": config['class_names']
    }


if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando servidor FastAPI en http://localhost:5000")
    uvicorn.run(app, host="0.0.0.0", port=5000)