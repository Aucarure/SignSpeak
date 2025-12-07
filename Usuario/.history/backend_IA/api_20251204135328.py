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
    try:
        # Convertir secuencia a numpy array
        sequence = np.array(request.sequence, dtype=np.float32)
        
        print(f"📥 SECUENCIA RECIBIDA:")
        print(f"   - Shape: {sequence.shape}")
        print(f"   - Primer frame, primeros 10 valores: {sequence[0, :10]}")
        
        # Validar que tengamos exactamente 63 valores por frame
        if sequence.shape[1] != 63:
            raise HTTPException(
                status_code=400,
                detail=f"Cada frame debe tener 63 valores (21 landmarks × 3). Recibido: {sequence.shape[1]}"
            )
        
        # Rellenar o truncar si el número de frames no coincide
        expected_frames = config['frames_per_sample']
        current_frames = sequence.shape[0]
        
        if current_frames < expected_frames:
            # Rellenar con el último frame
            padding = np.tile(sequence[-1:], (expected_frames - current_frames, 1))
            sequence = np.vstack([sequence, padding])
            print(f"⚠️ Secuencia rellenada de {current_frames} a {expected_frames} frames")
        elif current_frames > expected_frames:
            # Truncar al número esperado
            sequence = sequence[:expected_frames]
            print(f"⚠️ Secuencia truncada de {current_frames} a {expected_frames} frames")
        
        # Expandir dimensiones para batch
        sequence_batch = np.expand_dims(sequence, axis=0)
        
        print(f"📊 INPUT AL MODELO:")
        print(f"   - Shape final: {sequence_batch.shape}")
        print(f"   - Valores min/max: {sequence_batch.min():.3f} / {sequence_batch.max():.3f}")
        
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
        
        print(f"✅ RESULTADO PREDICCIÓN:")
        for i, (name, prob) in enumerate(zip(config['class_names'], predictions)):
            star = "⭐" if i == class_idx else "  "
            print(f"   {star} {name}: {prob*100:.1f}%")
        
        return {
            'prediction': predicted_class,
            'confidence': confidence,
            'probabilities': probabilities
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error en predicción: {str(e)}")
        import traceback
        traceback.print_exc()
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


